'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, ArrowLeft, Trash2, ShieldCheck, FileText } from 'lucide-react';

export default function CartPage() {
  const { items, clearCart, isLoaded, summary } = useCart();

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center text-sm text-text-muted">
        Loading your shopping cart...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <EmptyState
          title="Your EasyMeds Cart is Empty"
          description="You haven't added any medicines or healthcare essentials to your cart yet. Explore our catalog to find genuine products."
          icon={<ShoppingCart size={36} />}
          actionText="Browse Medicines & Health Products"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Review your selected medicines and health items before proceeding to checkout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1">
              <ArrowLeft size={14} />
              <span>Continue Shopping</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCart}
            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border-border gap-1"
          >
            <Trash2 size={14} />
            <span>Clear Cart</span>
          </Button>
        </div>
      </div>

      {/* Prescription Banner if applicable */}
      {summary.hasPrescriptionItems && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-950">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <FileText size={18} />
          </div>
          <div className="flex-1 text-xs">
            <h3 className="font-bold text-sm text-amber-900">
              Prescription Items in Cart
            </h3>
            <p className="mt-1 leading-relaxed text-amber-950/80">
              Your cart includes medications governed under Schedule H of the Indian Drugs and Cosmetics Act. You will need to attach your prescription during checkout or request a pharmacist verification call. No medicines will be shipped prior to review.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Items List + Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          {items.map(item => (
            <CartItem key={item.id} item={item} />
          ))}

          {/* Sourcing guarantee */}
          <div className="mt-4 p-4 rounded-2xl bg-white border border-border flex items-center gap-3 text-xs text-text-muted">
            <ShieldCheck size={20} className="text-brand-500 shrink-0" />
            <span>
              All products in your cart are guaranteed 100% genuine with valid batch numbers and tamper-evident packaging.
            </span>
          </div>
        </div>

        {/* Right: Cart Summary */}
        <div className="lg:col-span-4">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
