'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import { useCart } from '@/components/cart/CartProvider';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { MAX_QUANTITY_PER_ITEM } from '@/lib/cart';

interface ProductDetailActionsProps {
  product: Product;
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const cartItem = items.find(i => i.product.id === product.id);

  const handleAdd = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
      {/* Quantity Stepper */}
      <div className="flex items-center justify-between border border-border rounded-xl bg-surface-muted px-2 py-1.5 w-full sm:w-36">
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="p-1.5 text-text-muted hover:text-text-main hover:bg-white rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="font-semibold text-text-main text-sm">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity(Math.min(MAX_QUANTITY_PER_ITEM, quantity + 1))}
          disabled={quantity >= MAX_QUANTITY_PER_ITEM}
          className="p-1.5 text-text-muted hover:text-text-main hover:bg-white rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Add To Cart Button */}
      <Button
        variant={isAdded ? 'secondary' : 'primary'}
        size="lg"
        onClick={handleAdd}
        className="flex-1 font-semibold text-base rounded-xl shadow-md"
      >
        {isAdded ? (
          <>
            <Check size={20} className="text-brand-700" />
            <span>{product.isPriceOnRequest ? 'Added to Inquiry!' : 'Added to Cart!'}</span>
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            <span>
              {cartItem
                ? `Add More (${cartItem.quantity} in cart)`
                : (product.isPriceOnRequest ? 'Add to Order Inquiry' : 'Add to Cart')}
            </span>
          </>
        )}
      </Button>
    </div>
  );
}
