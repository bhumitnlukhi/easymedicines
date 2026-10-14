'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/order';
import { useCart } from './CartProvider';
import { formatCurrency } from '@/lib/utils';
import { Minus, Plus, Trash2, FileText, Pill } from 'lucide-react';
import { MAX_QUANTITY_PER_ITEM } from '@/lib/cart';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const [imageError, setImageError] = useState(false);
  const { product, quantity, unitPrice, subtotal } = item;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-2xl border border-border gap-4 hover:border-brand-300 transition-colors">
      {/* Product Image & Info */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <Link
          href={`/products/${product.slug}`}
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-surface-subtle p-2 shrink-0 border border-border/60 overflow-hidden flex items-center justify-center"
        >
          {!imageError ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="80px"
              className="object-contain p-1"
              onError={() => setImageError(true)}
            />
          ) : (
            <Pill size={24} className="text-brand-300" />
          )}
        </Link>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[11px] font-medium text-text-muted">{product.brand}</span>
            {product.prescriptionRequired && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.2 rounded text-[10px] font-bold">
                <FileText size={10} className="text-amber-700" />
                <span>Rx</span>
              </span>
            )}
          </div>

          <Link href={`/products/${product.slug}`} className="hover:text-brand-600 transition-colors">
            <h4 className="font-semibold text-text-main text-sm line-clamp-1">
              {product.name}
            </h4>
          </Link>

          {product.packSize && (
            <span className="text-xs text-text-muted mt-0.5">{product.packSize}</span>
          )}

          <div className="flex items-center gap-2 mt-1 sm:hidden">
            <span className="text-sm font-bold text-text-main">
              {product.isPriceOnRequest ? 'Price on Request' : formatCurrency(unitPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Quantity & Price Controls */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-border rounded-xl bg-surface-muted overflow-hidden">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            disabled={quantity <= 1}
            className="p-1.5 sm:p-2 text-text-muted hover:text-text-main hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={`Decrease quantity of ${product.name}`}
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-xs sm:text-sm font-semibold text-text-main">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            disabled={quantity >= MAX_QUANTITY_PER_ITEM}
            className="p-1.5 sm:p-2 text-text-muted hover:text-text-main hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={`Increase quantity of ${product.name}`}
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Line Subtotal */}
        <div className="text-right min-w-[80px]">
          <span className="block text-sm sm:text-base font-bold text-text-main">
            {product.isPriceOnRequest ? 'Price on Request' : formatCurrency(subtotal)}
          </span>
          <span className="hidden sm:block text-[11px] text-text-muted">
            {product.isPriceOnRequest ? 'Quote on confirmation' : `${formatCurrency(unitPrice)} each`}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeItem(product.id)}
          className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          aria-label={`Remove ${product.name} from cart`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
