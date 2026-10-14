'use client';

import React from 'react';
import Link from 'next/link';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CheckoutFormData } from '@/lib/checkout-validation';
import { CartItem } from '@/types/order';
import { formatCurrency } from '@/lib/utils';
import { Button } from '../ui/Button';
import { CheckSquare, ShieldCheck, Mail, ArrowRight, Truck } from 'lucide-react';

interface OrderReviewProps {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  finalTotal: number;
  hasPrescriptionItems: boolean;
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  isSubmitting: boolean;
  onMailtoInquiry?: () => void;
}

export function OrderReview({
  items,
  subtotal,
  deliveryCharge,
  finalTotal,
  hasPrescriptionItems,
  register,
  errors,
  isSubmitting,
  onMailtoInquiry,
}: OrderReviewProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-6 shadow-sm sticky top-24">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="font-semibold text-text-main text-base">Order Review</h3>
        <span className="text-xs text-text-muted">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
      </div>

      {/* Mini Items List */}
      <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-border/50">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="font-medium text-text-main truncate">{item.product.name}</span>
              <span className="text-[11px] text-text-muted">
                Qty: {item.quantity} × {item.product.isPriceOnRequest ? 'Price on Request' : formatCurrency(item.unitPrice)}
              </span>
            </div>
            <span className="font-semibold text-text-main shrink-0">
              {item.product.isPriceOnRequest ? 'On Request' : formatCurrency(item.subtotal)}
            </span>
          </div>
        ))}
      </div>

      {/* Delivery Method */}
      <div className="bg-surface-muted p-3.5 rounded-xl border border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-brand-600" />
          <div>
            <span className="font-semibold text-text-main block">Standard Verified Shipping</span>
            <span className="text-[11px] text-text-muted">Estimated 24-48 business hours</span>
          </div>
        </div>
        <span className="font-semibold text-text-main">
          {deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}
        </span>
      </div>

      {/* Price Totals */}
      <div className="flex flex-col gap-2 text-sm border-t border-border pt-3">
        <div className="flex justify-between text-text-muted text-xs">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-text-muted text-xs">
          <span>Shipping Fee</span>
          <span>{deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}</span>
        </div>
        <div className="flex justify-between items-baseline font-bold text-base text-text-main pt-2 border-t border-border">
          <span>Final Total</span>
          <span className="text-xl text-brand-600">{formatCurrency(finalTotal)}</span>
        </div>
      </div>

      {/* Terms and Consent Checkbox */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
          <input
            type="checkbox"
            {...register('termsAccepted')}
            className="mt-0.5 rounded border-border text-brand-500 accent-brand-500 shrink-0"
          />
          <span className="text-text-muted text-[11px] leading-relaxed">
            I confirm that all details provided are accurate and I agree to the EasyMeds{' '}
            <Link href="/policies#prescription-policy" target="_blank" className="text-brand-600 underline">
              Prescription Policy
            </Link>
            ,{' '}
            <Link href="/policies#terms" target="_blank" className="text-brand-600 underline">
              Terms & Conditions
            </Link>
            , and acknowledge that prescription items require licensed verification.
          </span>
        </label>
        {errors.termsAccepted && (
          <span className="text-xs text-red-600 font-medium">
            {errors.termsAccepted.message}
          </span>
        )}
      </div>

      {/* Primary Submit Button */}
      <div className="flex flex-col gap-2.5">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full text-base font-semibold shadow-md"
        >
          <span>Submit Order Request</span>
          <ArrowRight size={18} />
        </Button>

        {/* Client Mailto Inquiry Option */}
        {onMailtoInquiry && (
          <button
            type="button"
            onClick={onMailtoInquiry}
            className="w-full text-center text-xs text-brand-700 hover:text-brand-800 font-medium py-1.5 hover:underline flex items-center justify-center gap-1.5"
          >
            <Mail size={13} />
            <span>Open Email Order Draft in Mail Client</span>
          </button>
        )}
      </div>

      {/* Truthful Demo Notice */}
      <div className="bg-surface-subtle p-3 rounded-xl border border-border text-[11px] text-text-muted text-center leading-normal">
        <strong>Demo Order Flow:</strong> Submitting will record this order request in your browser session and display a truthful confirmation report with auditing reference.
      </div>
    </div>
  );
}
