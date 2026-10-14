'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CheckoutFormData } from '@/lib/checkout-validation';
import { Input } from '../ui/Input';
import { User, Mail, Phone, MapPin, Building, AlertCircle } from 'lucide-react';

interface CustomerFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

export function CustomerForm({ register, errors }: CustomerFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-5">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
          <User size={16} />
        </div>
        <h3 className="font-semibold text-text-main text-base">
          Customer & Delivery Information
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <Input
            label="Full Name *"
            placeholder="e.g. Rahul Sharma"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
        </div>

        {/* Email */}
        <div>
          <Input
            label="Email Address *"
            type="email"
            placeholder="e.g. rahul.sharma@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        {/* Mobile Number */}
        <div>
          <Input
            label="10-Digit Mobile Number *"
            type="tel"
            placeholder="e.g. 9876543210"
            helperText="Required for order delivery and pharmacist verification call"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        {/* Address Line 1 */}
        <div className="sm:col-span-2">
          <Input
            label="Delivery Street Address *"
            placeholder="Flat/House No., Street Name, Colony"
            error={errors.addressLine1?.message}
            {...register('addressLine1')}
          />
        </div>

        {/* Address Line 2 */}
        <div className="sm:col-span-2">
          <Input
            label="Apartment, Building, or Landmark (Optional)"
            placeholder="Near Apollo Hospital / Opposite Metro Station"
            error={errors.addressLine2?.message}
            {...register('addressLine2')}
          />
        </div>

        {/* City */}
        <div>
          <Input
            label="City *"
            placeholder="e.g. Mumbai"
            error={errors.city?.message}
            {...register('city')}
          />
        </div>

        {/* State */}
        <div>
          <Input
            label="State *"
            placeholder="e.g. Maharashtra"
            error={errors.state?.message}
            {...register('state')}
          />
        </div>

        {/* Postal Code */}
        <div>
          <Input
            label="Postal PIN Code (6 Digits) *"
            maxLength={6}
            placeholder="e.g. 400001"
            error={errors.postalCode?.message}
            {...register('postalCode')}
          />
        </div>

        {/* Order Note */}
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label htmlFor="orderNotes" className="text-sm font-medium text-text-main">
            Delivery Instructions / Order Notes (Optional)
          </label>
          <textarea
            id="orderNotes"
            rows={2}
            placeholder="e.g. Please ring bell twice or leave at building security desk."
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-text-main text-sm placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand-500"
            {...register('orderNotes')}
          />
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted mt-0.5">
            <AlertCircle size={12} className="text-amber-600 shrink-0" />
            <span>Do not include sensitive medical diagnoses, blood test reports, or unneeded private health data here.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
