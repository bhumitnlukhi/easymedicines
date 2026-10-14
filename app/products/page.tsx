'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllProducts, getAllCategories, getAllBrands } from '@/lib/catalog';
import { searchProducts } from '@/lib/search';
import { ProductFilterState, ProductSortOption } from '@/types/product';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductSort } from '@/components/products/ProductSort';
import { Button } from '@/components/ui/Button';
import { Filter, Search, X } from 'lucide-react';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlQuery = searchParams.get('q') || '';
  const urlCategory = searchParams.get('category') || undefined;

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [filterState, setFilterState] = useState<ProductFilterState>({
    category: urlCategory,
    sortBy: 'relevance',
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state if URL query changes
  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    if (urlCategory) {
      setFilterState(prev => ({ ...prev, category: urlCategory }));
    }
  }, [urlCategory]);

  const allProducts = useMemo(() => getAllProducts(), []);
  const allCategories = useMemo(() => getAllCategories(), []);
  const allBrands = useMemo(() => getAllBrands(), []);

  const filteredProducts = useMemo(() => {
    return searchProducts(searchQuery, filterState, allProducts);
  }, [searchQuery, filterState, allProducts]);

  const handleFilterChange = (updates: Partial<ProductFilterState>) => {
    setFilterState(prev => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterState({ sortBy: 'relevance' });
    router.push('/products');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/products?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
          {searchQuery ? (
            <>
              Search Results for <span className="text-brand-600">&ldquo;{searchQuery}&rdquo;</span>
            </>
          ) : filterState.category ? (
            <span className="capitalize">{filterState.category.replace(/-/g, ' ')}</span>
          ) : (
            'All Medicines & Healthcare Products'
          )}
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          Showing authentic medications and wellness items from certified Indian manufacturers.
        </p>
      </div>

      {/* Mobile Search & Filter Action Bar */}
      <div className="lg:hidden flex items-center gap-3 mb-6">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search catalog..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-border bg-white text-xs text-text-main focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Search size={14} className="absolute left-3 top-3 text-text-muted" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                router.push('/products');
              }}
              className="absolute right-2.5 top-2.5 text-text-muted hover:text-text-main"
            >
              <X size={14} />
            </button>
          )}
        </form>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileFilterOpen(true)}
          className="shrink-0 flex items-center gap-1.5"
        >
          <Filter size={14} />
          <span>Filters</span>
        </Button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <ProductFilters
            categories={allCategories}
            brands={allBrands}
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Grid & Sort Section */}
        <div className="lg:col-span-3">
          <ProductSort
            currentSort={filterState.sortBy || 'relevance'}
            onSortChange={sortBy => handleFilterChange({ sortBy })}
            totalCount={filteredProducts.length}
          />

          <ProductGrid
            products={filteredProducts}
            emptyTitle={
              searchQuery
                ? `No medicines found matching "${searchQuery}"`
                : 'No products in this filter selection'
            }
            emptyDescription="Try searching for generic salt names (e.g. Paracetamol, Amoxicillin), checking spelling, or clearing filters."
            onClearFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-5 shadow-2xl flex flex-col gap-4 overflow-y-auto z-10 animate-slide-left">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-text-main text-base">Filter Catalog</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-main"
              >
                <X size={20} />
              </button>
            </div>

            <ProductFilters
              categories={allCategories}
              brands={allBrands}
              filterState={filterState}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            <Button
              variant="primary"
              size="md"
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full mt-auto"
            >
              Apply Filters ({filteredProducts.length} items)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-sm text-text-muted">Loading medicines catalog...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
