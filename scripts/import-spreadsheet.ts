import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Product, ProductCategory, CatalogValidationReport, MatchConfidence, VerificationStatus } from '../types/product';

// Known column aliases for flexible matching
const COLUMN_ALIASES = {
  name: ['product_name', 'name', 'medicine_name', 'item_name', 'title', 'product', 'drug_name'],
  price: ['price', 'selling_price', 'rate', 'our_price', 'discounted_price', 'offer_price'],
  mrp: ['mrp', 'maximum_retail_price', 'list_price', 'original_price'],
  brand: ['brand', 'manufacturer', 'company', 'mfg', 'mfg_by'],
  genericName: ['generic_name', 'generic', 'composition', 'salt'],
  strength: ['strength', 'potency', 'mg', 'dosage_strength'],
  dosageForm: ['dosage_form', 'form', 'type', 'formulation'],
  packSize: ['pack_size', 'packaging', 'unit', 'pack', 'quantity_per_pack'],
  category: ['category', 'sub_category', 'department', 'type_category'],
  sku: ['sku', 'product_code', 'item_code', 'id', 'code'],
  prescription: ['prescription_required', 'rx_required', 'is_rx', 'schedule_h', 'prescription'],
  description: ['description', 'about', 'details', 'short_description'],
  imageUrl: ['image_url', 'image', 'photo', 'picture', 'img'],
};

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').trim();
}

function findMatchingColumn(headers: string[], aliases: string[]): string | undefined {
  const normalizedHeaders = headers.map(normalizeHeader);
  for (const alias of aliases) {
    const idx = normalizedHeaders.indexOf(alias);
    if (idx !== -1) return headers[idx];
  }
  // Partial substring check
  for (const alias of aliases) {
    const idx = normalizedHeaders.findIndex(h => h.includes(alias));
    if (idx !== -1) return headers[idx];
  }
  return undefined;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parsePrice(val: any): number | null {
  if (typeof val === 'number') return isNaN(val) ? null : Number(val.toFixed(2));
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : Number(num.toFixed(2));
  }
  return null;
}

export function parsePrescriptionStatus(val: any): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val === 1;
  if (typeof val === 'string') {
    const lower = val.toLowerCase().trim();
    return ['yes', 'true', '1', 'rx', 'schedule h', 'schedule h1', 'schedule x', 'required'].includes(lower);
  }
  return false;
}

export function importCatalogFile(filePath: string): {
  products: Product[];
  categories: ProductCategory[];
  report: CatalogValidationReport;
} {
  const ext = path.extname(filePath).toLowerCase();
  let rawRows: any[] = [];

  if (ext === '.csv') {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
    rawRows = parsed.data;
  } else if (ext === '.xlsx' || ext === '.xls') {
    const workbook = XLSX.readFile(filePath);
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  } else {
    throw new Error(`Unsupported file format: ${ext}. Supported formats are .xlsx, .xls, .csv`);
  }

  if (rawRows.length === 0) {
    throw new Error('Spreadsheet contains no data rows.');
  }

  const sampleRow = rawRows[0];
  const headers = Object.keys(sampleRow);

  const colMap = {
    name: findMatchingColumn(headers, COLUMN_ALIASES.name),
    price: findMatchingColumn(headers, COLUMN_ALIASES.price),
    mrp: findMatchingColumn(headers, COLUMN_ALIASES.mrp),
    brand: findMatchingColumn(headers, COLUMN_ALIASES.brand),
    genericName: findMatchingColumn(headers, COLUMN_ALIASES.genericName),
    strength: findMatchingColumn(headers, COLUMN_ALIASES.strength),
    dosageForm: findMatchingColumn(headers, COLUMN_ALIASES.dosageForm),
    packSize: findMatchingColumn(headers, COLUMN_ALIASES.packSize),
    category: findMatchingColumn(headers, COLUMN_ALIASES.category),
    sku: findMatchingColumn(headers, COLUMN_ALIASES.sku),
    prescription: findMatchingColumn(headers, COLUMN_ALIASES.prescription),
    description: findMatchingColumn(headers, COLUMN_ALIASES.description),
    imageUrl: findMatchingColumn(headers, COLUMN_ALIASES.imageUrl),
  };

  const report: CatalogValidationReport = {
    timestamp: new Date().toISOString(),
    sourceFile: filePath,
    totalRows: rawRows.length,
    validProducts: 0,
    duplicateRows: [],
    missingRequiredFields: [],
    ambiguousMatches: [],
    missingImages: [],
    prescriptionReviewRequired: [],
    priceDiscrepancies: [],
  };

  const products: Product[] = [];
  const seenSkus = new Set<string>();
  const seenSlugs = new Set<string>();
  const categoryMap = new Map<string, number>();

  rawRows.forEach((row, index) => {
    const rowNum = index + 2; // Accounting for 1-indexed Excel header
    const rawName = colMap.name ? String(row[colMap.name] || '').trim() : '';
    const rawPrice = colMap.price ? row[colMap.price] : undefined;
    const rawMrp = colMap.mrp ? row[colMap.mrp] : undefined;

    const missingFields: string[] = [];
    if (!rawName) missingFields.push('name');
    if (rawPrice === undefined || rawPrice === '') missingFields.push('price');

    if (missingFields.length > 0) {
      report.missingRequiredFields.push({ row: rowNum, missing: missingFields });
      return;
    }

    const price = parsePrice(rawPrice);
    if (price === null || price <= 0) {
      report.missingRequiredFields.push({ row: rowNum, missing: ['valid positive price'] });
      return;
    }

    const mrp = rawMrp !== undefined ? parsePrice(rawMrp) : undefined;
    if (mrp && mrp < price) {
      report.priceDiscrepancies.push({
        id: `row-${rowNum}`,
        name: rawName,
        price,
        mrp,
        issue: 'MRP is less than selling price. Price preserved without artificial alteration.',
      });
    }

    let rawSku = colMap.sku ? String(row[colMap.sku] || '').trim() : '';
    if (!rawSku) {
      rawSku = `EM-SKU-${rowNum.toString().padStart(4, '0')}`;
    }

    if (seenSkus.has(rawSku)) {
      report.duplicateRows.push({
        row: rowNum,
        identifier: rawSku,
        reason: 'Duplicate SKU identifier detected',
      });
      rawSku = `${rawSku}-R${rowNum}`;
    }
    seenSkus.add(rawSku);

    let baseSlug = slugify(rawName);
    let finalSlug = baseSlug;
    let slugCounter = 1;
    while (seenSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${slugCounter}`;
      slugCounter++;
    }
    seenSlugs.add(finalSlug);

    const brand = colMap.brand ? String(row[colMap.brand] || 'Standard Healthcare').trim() : 'Standard Healthcare';
    const category = colMap.category ? String(row[colMap.category] || 'General Healthcare').trim() : 'General Healthcare';
    const genericName = colMap.genericName ? String(row[colMap.genericName] || '').trim() : undefined;
    const strength = colMap.strength ? String(row[colMap.strength] || '').trim() : undefined;
    const dosageForm = colMap.dosageForm ? String(row[colMap.dosageForm] || 'Item').trim() : 'Item';
    const packSize = colMap.packSize ? String(row[colMap.packSize] || 'Standard Pack').trim() : 'Standard Pack';
    const description = colMap.description ? String(row[colMap.description] || '').trim() : `${rawName} provided by ${brand}.`;
    const prescriptionRequired = colMap.prescription ? parsePrescriptionStatus(row[colMap.prescription]) : false;
    const imageUrl = colMap.imageUrl && row[colMap.imageUrl] ? String(row[colMap.imageUrl]).trim() : '/images/placeholder-medicine.svg';

    if (imageUrl === '/images/placeholder-medicine.svg') {
      report.missingImages.push({ id: rawSku, name: rawName });
    }

    const dataWarnings: string[] = [];
    let matchConfidence: MatchConfidence = 'high';
    let verificationStatus: VerificationStatus = 'verified';

    if (!colMap.genericName && prescriptionRequired) {
      report.prescriptionReviewRequired.push({
        id: rawSku,
        name: rawName,
        reason: 'Prescription flag set but active ingredients/salt not specified in spreadsheet',
      });
      dataWarnings.push('Prescription status requires clinical salt verification');
    }

    const product: Product = {
      id: rawSku.toLowerCase(),
      sku: rawSku,
      slug: finalSlug,
      name: rawName,
      brand,
      genericName,
      activeIngredients: genericName ? [genericName] : undefined,
      strength,
      dosageForm,
      packSize,
      category,
      description,
      price,
      mrp: mrp || undefined,
      currency: 'INR',
      imageUrl,
      prescriptionRequired,
      availabilityStatus: 'in_stock',
      manufacturer: brand,
      sourceSpreadsheetRow: rowNum,
      sourceProductName: rawName,
      matchConfidence,
      verificationStatus,
      dataWarnings: dataWarnings.length > 0 ? dataWarnings : undefined,
    };

    products.push(product);
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });

  report.validProducts = products.length;

  const categories: ProductCategory[] = Array.from(categoryMap.entries()).map(([catName, count]) => ({
    id: slugify(catName),
    slug: slugify(catName),
    name: catName,
    description: `Discover genuine ${catName.toLowerCase()} and healthcare essentials.`,
    iconName: 'Pill',
    itemCount: count,
  }));

  return { products, categories, report };
}

// CLI runner
if (require.main === module) {
  const args = process.argv.slice(2);
  const inputPath = args[0] || 'data/source-catalog.xlsx';
  const outputPath = 'data/products.json';
  const reportPath = 'data/catalog-validation-report.json';
  const categoriesPath = 'data/categories.json';

  console.log(`[EasyMeds] Importing catalog from: ${inputPath}`);

  if (!fs.existsSync(inputPath)) {
    console.error(`[EasyMeds Error] Source file "${inputPath}" not found.`);
    console.log(`Please place your catalog file (.xlsx, .xls, .csv) at "${inputPath}" and re-run: npm run import-catalog -- <path-to-file>`);
    process.exit(1);
  }

  try {
    const { products, categories, report } = importCatalogFile(inputPath);
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf8');
    fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2), 'utf8');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

    console.log(`[EasyMeds Success] Processed ${report.totalRows} rows -> ${report.validProducts} valid products saved to ${outputPath}`);
    console.log(`[EasyMeds Report] Validation report written to ${reportPath}`);
    if (report.duplicateRows.length > 0) console.warn(`- Duplicates detected: ${report.duplicateRows.length}`);
    if (report.missingRequiredFields.length > 0) console.warn(`- Missing required fields: ${report.missingRequiredFields.length}`);
    if (report.priceDiscrepancies.length > 0) console.warn(`- Price discrepancies: ${report.priceDiscrepancies.length}`);
    if (report.prescriptionReviewRequired.length > 0) console.warn(`- Prescription review needed: ${report.prescriptionReviewRequired.length}`);
  } catch (err: any) {
    console.error(`[EasyMeds Error] Failed to process spreadsheet:`, err.message);
    process.exit(1);
  }
}
