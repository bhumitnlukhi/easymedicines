import { Product, ProductCategory } from '@/types/product';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';

const products: Product[] = productsData as Product[];
const categories: ProductCategory[] = categoriesData as ProductCategory[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id || p.sku.toLowerCase() === id.toLowerCase());
}

export function getFeaturedProducts(limit = 8): Product[] {
  // Return top products prioritizing variety across categories
  return products.slice(0, limit);
}

export function getProductsByCategory(categoryIdentifier: string): Product[] {
  const norm = categoryIdentifier.toLowerCase().replace(/[^a-z0-9]/g, '');
  return products.filter(p => {
    const catNorm = p.category.toLowerCase().replace(/[^a-z0-9]/g, '');
    return catNorm.includes(norm) || norm.includes(catNorm);
  });
}

export function getAllCategories(): ProductCategory[] {
  // Update item counts dynamically based on actual catalog
  return categories.map(cat => {
    const count = getProductsByCategory(cat.slug).length;
    return {
      ...cat,
      itemCount: count,
    };
  });
}

export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  return categories.find(c => c.slug === slug);
}

export function getAllBrands(): string[] {
  const brands = new Set<string>();
  products.forEach(p => {
    if (p.brand) brands.add(p.brand);
  });
  return Array.from(brands).sort();
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const current = getProductById(productId);
  if (!current) return products.slice(0, limit);

  return products
    .filter(p => p.id !== current.id && (p.category === current.category || p.brand === current.brand))
    .slice(0, limit);
}
