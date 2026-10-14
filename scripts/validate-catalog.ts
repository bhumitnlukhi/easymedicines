import fs from 'fs';
import path from 'path';
import { Product } from '../types/product';

function validateCatalog() {
  const productsPath = path.join(process.cwd(), 'data', 'products.json');
  if (!fs.existsSync(productsPath)) {
    console.error(`[Catalog Validator] Error: ${productsPath} does not exist.`);
    process.exit(1);
  }

  const data: Product[] = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  console.log(`[Catalog Validator] Inspecting ${data.length} products...`);

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  let errors = 0;
  let warnings = 0;

  data.forEach((p, index) => {
    // Unique ID check
    if (seenIds.has(p.id)) {
      console.error(`Row ${index + 1}: Duplicate ID "${p.id}"`);
      errors++;
    }
    seenIds.add(p.id);

    // Unique Slug check
    if (seenSlugs.has(p.slug)) {
      console.error(`Row ${index + 1}: Duplicate slug "${p.slug}"`);
      errors++;
    }
    seenSlugs.add(p.slug);

    // Price validity
    if (p.isPriceOnRequest) {
      if (typeof p.price !== 'number' || isNaN(p.price)) {
        console.error(`Product "${p.name}" has invalid price format: ${p.price}`);
        errors++;
      }
    } else {
      if (typeof p.price !== 'number' || p.price <= 0 || isNaN(p.price)) {
        console.error(`Product "${p.name}" has invalid price: ${p.price}`);
        errors++;
      }
    }

    // MRP validity
    if (p.mrp !== undefined && p.mrp < p.price) {
      console.warn(`Product "${p.name}" has MRP (${p.mrp}) lower than selling price (${p.price})`);
      warnings++;
    }

    // Prescription validation
    if (p.prescriptionRequired && !p.genericName && (!p.activeIngredients || p.activeIngredients.length === 0)) {
      console.warn(`Product "${p.name}" is prescription-required but missing generic active ingredients`);
      warnings++;
    }
  });

  console.log(`-------------------------------------------`);
  console.log(`Validation Complete: ${data.length} products scanned.`);
  console.log(`Errors: ${errors}`);
  console.log(`Warnings: ${warnings}`);

  if (errors > 0) {
    console.error(`[Catalog Validator] FAILED with ${errors} critical errors.`);
    process.exit(1);
  } else {
    console.log(`[Catalog Validator] PASSED successfully.`);
  }
}

if (require.main === module) {
  validateCatalog();
}
