'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { formatCurrency } from '@/lib/utils';
import { Button } from '../ui/Button';
import { ShieldAlert, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export function CartSummary() {
  const { summary } = useCart();
  const { subtotal, deliveryCharge, finalTotal, hasPrescriptionItems, items } = summary;

  return (
    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-5 sticky top-24 shadow-sm">
      <h3 className="font-semibold text-text-main text-base border-b border-border pb-3">
        Order Summary
      </h3>

      {/* Bill Breakdown */}
      <div className="flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between text-text-muted">
          <span>Items Subtotal</span>
          <span className="font-medium text-text-main">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-text-muted items-center">
          <span className="flex items-center gap-1.5">
            <Truck size={14} className="text-brand-500" />
            <span>Delivery Fee</span>
          </span>
          {deliveryCharge === 0 ? (
            <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded">
              FREE
            </span>
          ) : (
            <span className="font-medium text-text-main">{formatCurrency(deliveryCharge)}</span>
          )}
        </div>

        {deliveryCharge > 0 && (
          <p className="text-[11px] text-text-muted bg-surface-muted p-2 rounded-lg">
            Add <span className="font-semibold text-brand-600">{formatCurrency(500 - subtotal)}</span> more for FREE delivery.
          </p>
        )}

        <div className="pt-3 border-t border-border flex justify-between items-baseline">
          <span className="font-bold text-base text-text-main">Estimated Total</span>
          <span className="font-bold text-xl text-brand-600">{formatCurrency(finalTotal)}</span>
        </div>
      </div>

      {/* Prescription Notice if applicable */}
      {hasPrescriptionItems && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex flex-col gap-1.5 text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-semibold">
            <ShieldAlert size={14} className="text-amber-700 shrink-0" />
            <span>Prescription Required</span>
          </div>
          <p className="text-[11px] text-amber-950/80 leading-relaxed">
            Your cart contains Schedule H medicines. You will be prompted to attach or review doctor prescription details during checkout.
          </p>
        </div>
      )}

      {/* Checkout CTA */}
      <Link href="/checkout" className="w-full">
        <Button
          variant="primary"
          size="lg"
          className="w-full text-base font-semibold shadow-md"
          disabled={items.length === 0}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight size={18} />
        </Button>
      </Link>

      {/* Trust reassurance */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-text-muted border-t border-border pt-4">
        <ShieldCheck size={14} className="text-brand-500 shrink-0" />
        <span>Safe & encrypted checkout process</span>
      </div>
    </div>
  );
}
