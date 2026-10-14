import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllCategories, getCategoryBySlug, getProductsByCategory } from '@/lib/catalog';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map(cat => ({
    slug: cat.slug,
  }));
}

export default function CategoryDetailPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(category.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-muted">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-brand-600 transition-colors">
          Categories
        </Link>
        <ChevronRight size={12} />
        <span className="text-text-main font-medium">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="max-w-2xl">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 mb-2"
          >
            <ArrowLeft size={14} />
            <span>All Catalog Products</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
            {category.description}
          </p>
        </div>

        <div className="bg-brand-50 text-brand-700 px-4 py-3 rounded-2xl border border-brand-200/80 text-center shrink-0">
          <span className="block text-2xl font-bold">{products.length}</span>
          <span className="text-xs font-medium">Verified Products</span>
        </div>
      </div>

      {/* Category Products Grid */}
      <ProductGrid
        products={products}
        emptyTitle={`No products currently available in ${category.name}`}
        emptyDescription="Please check back shortly or browse our full medicines catalog."
      />
    </div>
  );
}
