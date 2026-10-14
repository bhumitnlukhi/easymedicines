'use client';

import React from 'react';
import { ProductFilterState, ProductCategory } from '@/types/product';
import { Check, Filter, RotateCcw } from 'lucide-react';

interface ProductFiltersProps {
  categories: ProductCategory[];
  brands: string[];
  filterState: ProductFilterState;
  onFilterChange: (filters: Partial<ProductFilterState>) => void;
  onReset: () => void;
  className?: string;
}

export function ProductFilters({
  categories,
  brands,
  filterState,
  onFilterChange,
  onReset,
  className,
}: ProductFiltersProps) {
  const handleBrandToggle = (brand: string) => {
    const current = filterState.brand || [];
    const exists = current.includes(brand);
    const updated = exists ? current.filter(b => b !== brand) : [...current, brand];
    onFilterChange({ brand: updated });
  };

  const hasActiveFilters =
    Boolean(filterState.category) ||
    Boolean(filterState.brand && filterState.brand.length > 0) ||
    filterState.prescriptionRequired !== undefined ||
    filterState.inStockOnly;

  return (
    <aside className={`bg-white rounded-2xl border border-border p-5 flex flex-col gap-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-brand-600" />
          <h3 className="font-semibold text-text-main text-sm">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Prescription Requirement */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
          Prescription Type
        </h4>
        <div className="flex flex-col gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="prescription"
              checked={filterState.prescriptionRequired === undefined}
              onChange={() => onFilterChange({ prescriptionRequired: undefined })}
              className="accent-brand-500"
            />
            <span className="text-text-main">All Medicines</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="prescription"
              checked={filterState.prescriptionRequired === false}
              onChange={() => onFilterChange({ prescriptionRequired: false })}
              className="accent-brand-500"
            />
            <span className="text-text-main">Over the Counter (OTC)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="prescription"
              checked={filterState.prescriptionRequired === true}
              onChange={() => onFilterChange({ prescriptionRequired: true })}
              className="accent-brand-500"
            />
            <span className="text-text-main flex items-center gap-1">
              <span>Prescription Required</span>
              <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded font-bold">Rx</span>
            </span>
          </label>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
          Categories
        </h4>
        <div className="flex flex-col gap-1.5 text-xs">
          <button
            onClick={() => onFilterChange({ category: undefined })}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
              !filterState.category
                ? 'bg-brand-50 text-brand-700 font-semibold'
                : 'text-text-main hover:bg-surface-subtle'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map(cat => {
            const isSelected = filterState.category === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ category: isSelected ? undefined : cat.slug })}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-text-main hover:bg-surface-subtle'
                }`}
              >
                <span className="truncate pr-2">{cat.name}</span>
                {cat.itemCount !== undefined && (
                  <span className="text-[10px] text-text-subtle font-normal bg-surface-subtle px-1.5 py-0.5 rounded">
                    {cat.itemCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands Filter */}
      {brands.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
            Brands & Manufacturers
          </h4>
          <div className="flex flex-col gap-1.5 text-xs max-h-48 overflow-y-auto pr-1">
            {brands.map(brand => {
              const isChecked = (filterState.brand || []).includes(brand);
              return (
                <label key={brand} className="flex items-center gap-2 cursor-pointer select-none py-0.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded border-border text-brand-500 focus:ring-brand-500 accent-brand-500"
                  />
                  <span className="text-text-main truncate">{brand}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Availability Filter */}
      <div className="pt-2 border-t border-border">
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
          <input
            type="checkbox"
            checked={Boolean(filterState.inStockOnly)}
            onChange={e => onFilterChange({ inStockOnly: e.target.checked || undefined })}
            className="rounded border-border text-brand-500 accent-brand-500"
          />
          <span className="text-text-main font-medium">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
}
