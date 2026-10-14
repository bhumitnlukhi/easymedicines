import { Product, ProductFilterState, ProductSortOption } from '@/types/product';
import { getAllProducts } from './catalog';

export interface SearchScoreResult {
  product: Product;
  score: number;
}

export function searchProducts(
  query: string,
  filterState?: ProductFilterState,
  productList?: Product[]
): Product[] {
  const source = productList || getAllProducts();
  const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, ' ');

  let scored: SearchScoreResult[] = [];

  if (!normalizedQuery) {
    scored = source.map(p => ({ product: p, score: 1 }));
  } else {
    source.forEach(product => {
      let score = 0;
      const name = product.name.toLowerCase();
      const sku = product.sku.toLowerCase();
      const brand = product.brand.toLowerCase();
      const generic = product.genericName?.toLowerCase() || '';
      const ingredients = (product.activeIngredients || []).map(i => i.toLowerCase()).join(' ');
      const category = product.category.toLowerCase();

      // Exact match gets highest priority
      if (name === normalizedQuery || sku === normalizedQuery) {
        score += 100;
      } else if (name.startsWith(normalizedQuery)) {
        score += 60;
      } else if (name.includes(normalizedQuery)) {
        score += 40;
      }

      if (brand === normalizedQuery) {
        score += 35;
      } else if (brand.includes(normalizedQuery)) {
        score += 20;
      }

      if (generic === normalizedQuery) {
        score += 30;
      } else if (generic.includes(normalizedQuery)) {
        score += 18;
      }

      if (ingredients.includes(normalizedQuery)) {
        score += 15;
      }

      if (category.includes(normalizedQuery)) {
        score += 10;
      }

      // Token match
      const tokens = normalizedQuery.split(' ').filter(Boolean);
      let matchedTokens = 0;
      for (const token of tokens) {
        if (
          name.includes(token) ||
          sku.includes(token) ||
          brand.includes(token) ||
          generic.includes(token) ||
          ingredients.includes(token)
        ) {
          matchedTokens++;
        }
      }
      if (tokens.length > 1 && matchedTokens === tokens.length) {
        score += 25;
      }

      if (score > 0) {
        scored.push({ product, score });
      }
    });

    // Sort by relevance score desc initially
    scored.sort((a, b) => b.score - a.score);
  }

  let results = scored.map(s => s.product);

  // Apply filters
  if (filterState) {
    if (filterState.category) {
      const catNorm = filterState.category.toLowerCase().replace(/[^a-z0-9]/g, '');
      results = results.filter(p => {
        const pCat = p.category.toLowerCase().replace(/[^a-z0-9]/g, '');
        return pCat.includes(catNorm) || catNorm.includes(pCat);
      });
    }

    if (filterState.brand && filterState.brand.length > 0) {
      const selectedBrands = filterState.brand.map(b => b.toLowerCase());
      results = results.filter(p => selectedBrands.includes(p.brand.toLowerCase()));
    }

    if (filterState.prescriptionRequired !== undefined) {
      results = results.filter(p => p.prescriptionRequired === filterState.prescriptionRequired);
    }

    if (filterState.minPrice !== undefined) {
      results = results.filter(p => p.price >= (filterState.minPrice ?? 0));
    }

    if (filterState.maxPrice !== undefined) {
      results = results.filter(p => p.price <= (filterState.maxPrice ?? Infinity));
    }

    if (filterState.inStockOnly) {
      results = results.filter(p => p.availabilityStatus === 'in_stock');
    }

    // Apply Sorting
    if (filterState.sortBy && filterState.sortBy !== 'relevance') {
      results = sortProducts(results, filterState.sortBy);
    }
  }

  return results;
}

export function sortProducts(products: Product[], sortBy: ProductSortOption): Product[] {
  const sorted = [...products];
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name_asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'relevance':
    default:
      return sorted;
  }
}
