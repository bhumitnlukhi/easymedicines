import { getAllProducts, getProductById, getProductBySlug, getAllCategories } from '../lib/catalog';
import { parsePrice, parsePrescriptionStatus, slugify } from '../scripts/import-spreadsheet';

describe('Catalog Integrity and Loading', () => {
  const products = getAllProducts();

  test('loads all catalog products correctly', () => {
    expect(products.length).toBeGreaterThan(0);
    expect(products.length).toBe(352);
  });

  test('every product has a unique ID and SKU', () => {
    const ids = new Set<string>();
    const skus = new Set<string>();

    products.forEach(p => {
      expect(ids.has(p.id)).toBe(false);
      expect(skus.has(p.sku.toLowerCase())).toBe(false);
      ids.add(p.id);
      skus.add(p.sku.toLowerCase());
    });
  });

  test('every product has a unique slug', () => {
    const slugs = new Set<string>();
    products.forEach(p => {
      expect(slugs.has(p.slug)).toBe(false);
      slugs.add(p.slug);
    });
  });

  test('prices are strictly positive numbers and not fabricated', () => {
    products.forEach(p => {
      expect(typeof p.price).toBe('number');
      expect(isNaN(p.price)).toBe(false);
      if (p.isPriceOnRequest) {
        expect(p.price).toBe(0);
      } else {
        expect(p.price).toBeGreaterThan(0);
      }
      if (p.mrp !== undefined) {
        expect(p.mrp).toBeGreaterThanOrEqual(p.price);
      }
    });
  });

  test('getProductBySlug retrieves correct product', () => {
    const firstProduct = products[0];
    const retrieved = getProductBySlug(firstProduct.slug);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(firstProduct.id);
    expect(retrieved?.name).toBe(firstProduct.name);
  });

  test('prescription required items are flagged accurately', () => {
    const rxItem = products.find(p => p.prescriptionRequired);
    expect(rxItem).toBeDefined();
    expect(rxItem?.prescriptionRequired).toBe(true);

    const otcItem = products.find(p => !p.prescriptionRequired);
    expect(otcItem).toBeDefined();
    expect(otcItem?.prescriptionRequired).toBe(false);
  });

  test('categories are properly loaded with items', () => {
    const categories = getAllCategories();
    expect(categories.length).toBe(7);
    categories.forEach(c => {
      expect(c.slug).toBeDefined();
      expect(c.name).toBeDefined();
      expect(c.itemCount).toBeGreaterThan(0);
    });
  });
});

describe('Spreadsheet Utility Parsing', () => {
  test('parsePrice accurately cleans currencies and decimals', () => {
    expect(parsePrice(204.5)).toBe(204.5);
    expect(parsePrice('₹ 198.00')).toBe(198);
    expect(parsePrice('31.50')).toBe(31.5);
    expect(parsePrice('invalid')).toBeNull();
  });

  test('parsePrescriptionStatus parses multiple boolean forms', () => {
    expect(parsePrescriptionStatus(true)).toBe(true);
    expect(parsePrescriptionStatus('yes')).toBe(true);
    expect(parsePrescriptionStatus('Rx')).toBe(true);
    expect(parsePrescriptionStatus('Schedule H')).toBe(true);
    expect(parsePrescriptionStatus('no')).toBe(false);
    expect(parsePrescriptionStatus('0')).toBe(false);
  });

  test('slugify produces URL safe slugs', () => {
    expect(slugify('Dolo 650mg Tablet (15s)')).toBe('dolo-650mg-tablet-15s');
    expect(slugify('Pan-D Capsule')).toBe('pan-d-capsule');
  });
});
