import React from 'react';
import { ProductSortOption } from '@/types/product';
import { ArrowUpDown } from 'lucide-react';

interface ProductSortProps {
  currentSort: ProductSortOption;
  onSortChange: (sort: ProductSortOption) => void;
  totalCount: number;
}

export function ProductSort({ currentSort, onSortChange, totalCount }: ProductSortProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-border">
      <p className="text-xs sm:text-sm text-text-muted">
        Showing <span className="font-semibold text-text-main">{totalCount}</span> {totalCount === 1 ? 'medicine' : 'products'}
      </p>

      <div className="flex items-center gap-2">
        <label htmlFor="product-sort" className="text-xs text-text-muted flex items-center gap-1 shrink-0">
          <ArrowUpDown size={14} />
          <span>Sort by:</span>
        </label>
        <select
          id="product-sort"
          value={currentSort}
          onChange={e => onSortChange(e.target.value as ProductSortOption)}
          className="text-xs font-medium text-text-main bg-white border border-border rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer"
        >
          <option value="relevance">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>
      </div>
    </div>
  );
}
