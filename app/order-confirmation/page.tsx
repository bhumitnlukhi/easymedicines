'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { OrderConfirmationResult } from '@/types/order';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  FileText,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
  PackageCheck,
  Home,
  ArrowRight,
} from 'lucide-react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get('ref');
  const [order, setOrder] = useState<OrderConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('easymeds_latest_order');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as OrderConfirmationResult;
          if (!orderRef || parsed.orderReference === orderRef) {
            setOrder(parsed);
          }
        } catch (e) {
          console.error('Failed to parse order from session:', e);
        }
      }
      setIsLoading(false);
    }
  }, [orderRef]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-sm text-text-muted">
        Loading order confirmation...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center flex flex-col items-center gap-4 bg-white rounded-3xl border border-border mt-8 p-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-text-main">No Active Order Found</h2>
        <p className="text-xs text-text-muted">
          We could not locate an active order request for this session. If you recently refreshed or navigated directly, your cart may still have your items.
        </p>
        <Link href="/products">
          <Button variant="primary">Explore Medicine Catalog</Button>
        </Link>
      </div>
    );
  }

  const isPrescriptionPending = order.status === 'prescription_verification_required';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
      {/* Status Hero Card */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isPrescriptionPending
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {isPrescriptionPending ? <Clock size={28} /> : <CheckCircle2 size={28} />}
          </div>
          <div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                isPrescriptionPending
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-emerald-100 text-emerald-900'
              }`}
            >
              {isPrescriptionPending ? 'Pending Pharmacist Review' : 'Order Request Received'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main mt-1">
              {isPrescriptionPending
                ? 'Prescription Verification in Progress'
                : 'Order Request Confirmed'}
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Order Reference:{' '}
              <span className="font-mono font-bold text-text-main">{order.orderReference}</span> •{' '}
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <Link href="/products">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <span>Continue Shopping</span>
          </Button>
        </Link>
      </div>

      {/* Truthful Demo Notice Banner */}
      <div className="bg-brand-50/70 border border-brand-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-brand-950 text-xs">
        <ShieldCheck size={20} className="text-brand-600 shrink-0 mt-0.5" />
        <div className="flex-1 leading-relaxed">
          <p className="font-semibold text-brand-900">Demonstration Platform Mode</p>
          <p className="text-brand-950/80 mt-0.5">{order.isDemoNotice}</p>
        </div>
      </div>

      {/* Next Steps Accordion / Card */}
      <div className="bg-white rounded-3xl border border-border p-6 flex flex-col gap-4">
        <h3 className="font-bold text-text-main text-base flex items-center gap-2">
          <PackageCheck size={20} className="text-brand-600" />
          <span>What Happens Next?</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {order.nextSteps.map((step, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-surface-muted border border-border text-xs flex flex-col gap-1.5">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-[11px]">
                {idx + 1}
              </span>
              <p className="font-semibold text-text-main mt-1">{step.split(':')[0]}</p>
              <p className="text-text-muted leading-relaxed">{step.split(':')[1] || step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Summary: Customer Details & Ordered Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Delivery Summary */}
        <div className="bg-white rounded-3xl border border-border p-6 flex flex-col gap-4">
          <h3 className="font-bold text-text-main text-base border-b border-border pb-3">
            Delivery & Contact Details
          </h3>
          <div className="flex flex-col gap-3 text-xs text-text-muted">
            <div className="flex items-center gap-2 text-text-main font-semibold">
              <span>{order.customer.fullName}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={15} className="text-brand-500 shrink-0 mt-0.5" />
              <span>
                {order.customer.addressLine1}
                {order.customer.addressLine2 ? `, ${order.customer.addressLine2}` : ''}
                <br />
                {order.customer.city}, {order.customer.state} - {order.customer.postalCode}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-brand-500 shrink-0" />
              <span>{order.customer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-brand-500 shrink-0" />
              <span>{order.customer.email}</span>
            </div>
            {order.customer.orderNotes && (
              <div className="mt-2 p-2.5 rounded-xl bg-surface-muted border border-border text-[11px]">
                <strong>Notes:</strong> {order.customer.orderNotes}
              </div>
            )}
          </div>
        </div>

        {/* Ordered Items Summary */}
        <div className="bg-white rounded-3xl border border-border p-6 flex flex-col gap-4">
          <h3 className="font-bold text-text-main text-base border-b border-border pb-3">
            Order Items ({order.items.length})
          </h3>
          <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1 text-xs">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center py-1 border-b border-border/50">
                <div className="flex flex-col pr-2">
                  <span className="font-semibold text-text-main">{item.product.name}</span>
                  <span className="text-[11px] text-text-muted">
                    Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                  </span>
                </div>
                <span className="font-bold text-text-main shrink-0">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between text-text-muted">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Delivery Charge</span>
              <span>{order.deliveryCharge === 0 ? 'FREE' : formatCurrency(order.deliveryCharge)}</span>
            </div>
            <div className="flex justify-between items-baseline font-bold text-base text-text-main pt-2 border-t border-border">
              <span>Total Amount</span>
              <span className="text-lg text-brand-600">{formatCurrency(order.finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Return Home CTA */}
      <div className="flex justify-center pt-4">
        <Link href="/">
          <Button variant="primary" size="lg" className="rounded-xl shadow-md gap-2">
            <Home size={18} />
            <span>Return to Homepage</span>
          </Button>
        </Link>
      </div>

    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-16 text-center text-sm text-text-muted">Loading order confirmation...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
