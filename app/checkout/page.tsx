'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutFormSchema, CheckoutFormData } from '@/lib/checkout-validation';
import { useCart } from '@/components/cart/CartProvider';
import { CustomerForm } from '@/components/checkout/CustomerForm';
import { PrescriptionSection } from '@/components/checkout/PrescriptionSection';
import { OrderReview } from '@/components/checkout/OrderReview';
import { generateOrderMailtoLink, generateOrderReference, processDemoOrderSubmission } from '@/lib/email';
import { OrderSubmissionData } from '@/types/order';
import { ArrowLeft, ShoppingCart, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, summary, clearCart, isLoaded } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [prescriptionFileName, setPrescriptionFileName] = useState<string | undefined>();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      termsAccepted: false,
    },
  });

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-sm text-text-muted">
        Loading checkout...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <ShoppingCart size={32} />
        </div>
        <h2 className="text-xl font-bold text-text-main">Your Cart is Empty</h2>
        <p className="text-sm text-text-muted">
          You cannot checkout without items. Please add medicines or healthcare products to proceed.
        </p>
        <Link href="/products">
          <Button variant="primary">Browse Catalog</Button>
        </Link>
      </div>
    );
  }

  const buildSubmissionPayload = (formData: CheckoutFormData, submissionType: 'demo_submission' | 'mailto_inquiry'): OrderSubmissionData => {
    return {
      customer: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        orderNotes: formData.orderNotes,
      },
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        prescriptionRequired: item.product.prescriptionRequired,
      })),
      subtotal: summary.subtotal,
      deliveryCharge: summary.deliveryCharge,
      finalTotal: summary.finalTotal,
      hasPrescriptionItems: summary.hasPrescriptionItems,
      prescriptionDetails: summary.hasPrescriptionItems
        ? {
            uploadedFileName: prescriptionFileName,
            consultationRequested: !prescriptionUploaded,
          }
        : undefined,
      deliveryMethod: 'Standard Verified Shipping (24-48 hrs)',
      termsAccepted: formData.termsAccepted,
      submissionType,
    };
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmissionError(null);
    setIsSubmitting(true);

    try {
      // Simulate realistic network delay for validation
      await new Promise(resolve => setTimeout(resolve, 800));

      const payload = buildSubmissionPayload(data, 'demo_submission');
      const confirmationResult = processDemoOrderSubmission(payload);

      // Clear the cart on successful demo order placement
      clearCart();

      // Redirect to truthful confirmation page
      router.push(`/order-confirmation?ref=${confirmationResult.orderReference}`);
    } catch (err: any) {
      setSubmissionError(err.message || 'An error occurred during submission. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleMailtoInquiry = () => {
    const values = getValues();
    if (!values.fullName || !values.email || !values.phone) {
      alert('Please fill in your name, email, and phone number first so we can format your order inquiry.');
      return;
    }
    const payload = buildSubmissionPayload(values as CheckoutFormData, 'mailto_inquiry');
    const orderRef = generateOrderReference();
    const mailtoUrl = generateOrderMailtoLink(payload, orderRef);
    window.location.href = mailtoUrl;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Page Title & Back to Cart */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main">
            Checkout & Order Request
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Provide your delivery details and prescription information to complete your order request.
          </p>
        </div>
        <Link href="/cart">
          <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1">
            <ArrowLeft size={14} />
            <span>Return to Cart</span>
          </Button>
        </Link>
      </div>

      {submissionError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <ShieldAlert size={18} />
          <span>{submissionError}</span>
        </div>
      )}

      {/* Main Checkout Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Customer Form & Prescription Section */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Step 2: Customer Details Form */}
            <CustomerForm register={register} errors={errors} />

            {/* Step 3: Prescription Section (If cart has prescription products) */}
            {summary.hasPrescriptionItems && (
              <PrescriptionSection
                prescriptionItems={summary.prescriptionItemNames}
                onUploadStateChange={(hasFile, fileName) => {
                  setPrescriptionUploaded(hasFile);
                  setPrescriptionFileName(fileName);
                }}
              />
            )}
          </div>

          {/* Right Column: Order Review & Submission */}
          <div className="lg:col-span-5">
            <OrderReview
              items={items}
              subtotal={summary.subtotal}
              deliveryCharge={summary.deliveryCharge}
              finalTotal={summary.finalTotal}
              hasPrescriptionItems={summary.hasPrescriptionItems}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              onMailtoInquiry={handleMailtoInquiry}
            />
          </div>

        </div>
      </form>
    </div>
  );
}
