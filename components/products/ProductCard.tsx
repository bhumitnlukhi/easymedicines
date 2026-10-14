'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useCart } from '../cart/CartProvider';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { calculateDiscount } from '@/lib/pricing';
import { formatCurrency } from '@/lib/utils';
import { Plus, Check, FileText, Pill } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = items.find(i => i.product.id === product.id);
  const discount = calculateDiscount(product.price, product.mrp);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-border hover:border-brand-400 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden h-full">
      {/* Product Image Area */}
      <Link href={`/products/${product.slug}`} className="relative block w-full aspect-square bg-surface-subtle p-4 overflow-hidden">
        {/* Prescription Tag */}
        {product.prescriptionRequired && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center gap-1 bg-amber-50/95 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-xs">
              <FileText size={11} className="text-amber-700" />
              <span>Rx Required</span>
            </span>
          </div>
        )}

        {/* Discount Badge (Strictly only when MRP is verified and valid) */}
        {discount.hasDiscount && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
              {discount.percentage}% OFF
            </span>
          </div>
        )}

        {/* Product Image with Fallback */}
        <div className="w-full h-full relative flex items-center justify-center">
          {!imageError ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-text-subtle p-4 text-center">
              <Pill size={36} className="text-brand-300 mb-1" />
              <span className="text-[11px] font-medium">{product.dosageForm || 'Medicine'}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Brand */}
        <div className="flex items-center justify-between text-[11px] text-text-muted mb-1">
          <span className="truncate max-w-[120px] font-medium">{product.brand}</span>
          {product.packSize && <span className="text-[10px] text-text-subtle">{product.packSize}</span>}
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="group-hover:text-brand-600 transition-colors">
          <h3 className="font-semibold text-text-main text-sm line-clamp-2 leading-snug mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Generic Salt / Active Ingredients (When verified) */}
        {product.genericName && (
          <p className="text-[11px] text-text-muted italic line-clamp-1 mb-2">
            {product.genericName}
          </p>
        )}

        {/* Pricing and Cart Action Footer */}
        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-2">
          {product.isPriceOnRequest ? (
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-brand-700">
                Price on Request
              </span>
              <span className="text-[10px] text-text-subtle">
                Batch quote inquiry
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-text-main">
                  {formatCurrency(product.price)}
                </span>
                {discount.hasDiscount && product.mrp && (
                  <span className="text-xs text-text-subtle line-through">
                    {formatCurrency(product.mrp)}
                  </span>
                )}
              </div>
              {discount.hasDiscount && (
                <span className="text-[10px] text-emerald-700 font-medium">
                  Save {discount.formattedSavings}
                </span>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            size="sm"
            variant={justAdded ? 'secondary' : 'primary'}
            onClick={handleAddToCart}
            className="shrink-0 h-9 px-3 rounded-xl"
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <>
                <Check size={14} className="text-brand-700" />
                <span className="text-xs font-semibold">Added</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span className="text-xs font-semibold">
                  {cartItem ? `Add (${cartItem.quantity})` : (product.isPriceOnRequest ? 'Enquire' : 'Add')}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
