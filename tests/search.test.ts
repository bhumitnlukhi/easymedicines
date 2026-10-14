import { searchProducts, sortProducts } from '../lib/search';
import { getAllProducts } from '../lib/catalog';

describe('Search and Filtering Engine', () => {
  const allProducts = getAllProducts();

  test('prioritizes exact name match at the top', () => {
    const results = searchProducts('DOLO 650MG', undefined, allProducts);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe('DOLO 650MG');
  });

  test('finds medicines by active generic ingredient', () => {
    const results = searchProducts('Paracetamol', undefined, allProducts);
    expect(results.length).toBeGreaterThan(0);
    const hasDolo = results.some(p => p.name.toUpperCase().includes('DOLO'));
    const hasParacip = results.some(p => p.name.toUpperCase().includes('PARACIP') || p.name.toUpperCase().includes('LEEMOL'));
    expect(hasDolo).toBe(true);
    expect(hasParacip).toBe(true);
  });

  test('supports case-insensitive search and whitespace normalization', () => {
    const lowerResults = searchProducts('dolo', undefined, allProducts);
    const upperResults = searchProducts('   DOLO   ', undefined, allProducts);
    expect(lowerResults.length).toBe(upperResults.length);
  });

  test('finds products by SKU identifier', () => {
    const targetSku = allProducts[0].sku;
    const results = searchProducts(targetSku, undefined, allProducts);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].sku).toBe(targetSku);
  });

  test('respects prescription filter', () => {
    const rxOnly = searchProducts('', { prescriptionRequired: true }, allProducts);
    expect(rxOnly.length).toBeGreaterThan(0);
    rxOnly.forEach(p => {
      expect(p.prescriptionRequired).toBe(true);
    });

    const otcOnly = searchProducts('', { prescriptionRequired: false }, allProducts);
    expect(otcOnly.length).toBeGreaterThan(0);
    otcOnly.forEach(p => {
      expect(p.prescriptionRequired).toBe(false);
    });
  });

  test('handles empty or blank search string gracefully by returning all products', () => {
    const emptyResults = searchProducts('   ', undefined, allProducts);
    expect(emptyResults.length).toBe(allProducts.length);
  });

  test('sorts products by price ascending and descending correctly', () => {
    const asc = sortProducts(allProducts, 'price_asc');
    for (let i = 0; i < asc.length - 1; i++) {
      expect(asc[i].price).toBeLessThanOrEqual(asc[i + 1].price);
    }

    const desc = sortProducts(allProducts, 'price_desc');
    for (let i = 0; i < desc.length - 1; i++) {
      expect(desc[i].price).toBeGreaterThanOrEqual(desc[i + 1].price);
    }
  });
});
