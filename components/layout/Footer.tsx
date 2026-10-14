import React from 'react';
import Link from 'next/link';
import { HeartPulse, ShieldAlert, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface-muted border-t border-border mt-16 text-text-main">
      {/* Trust & Safety Banner */}
      <div className="border-b border-border bg-brand-50/50 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-text-main">100% Genuine Healthcare</h4>
              <p className="text-xs text-text-muted mt-0.5">
                All medicines are sourced from verified pharmaceutical manufacturers and licensed Indian distributors.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-text-main">Prescription Verification</h4>
              <p className="text-xs text-text-muted mt-0.5">
                Schedule H & H1 medications require review by registered pharmacists before fulfillment in compliance with Drugs and Cosmetics Act.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-text-main">Medical Information Notice</h4>
              <p className="text-xs text-text-muted mt-0.5">
                Product details and indications are educational and do not replace personalized consultation with a qualified medical practitioner.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center">
                <HeartPulse size={18} />
              </div>
              <span className="text-lg font-bold text-brand-600">
                Easy<span className="text-text-main">Meds</span>
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              EasyMeds is a modern online pharmacy and healthcare discovery platform designed for safe, transparent, and convenient access to medicines across India.
            </p>
            <div className="mt-2 text-xs text-text-muted flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-brand-600 shrink-0" />
                <span>Customer Care: +91 (Configurable Helpline)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-brand-600 shrink-0" />
                <span>Support: support@easymeds-demo.in</span>
              </div>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
              Explore Catalog
            </h5>
            <ul className="flex flex-col gap-2 text-xs text-text-muted">
              <li>
                <Link href="/products" className="hover:text-brand-600 transition-colors">
                  All Medicines & Devices
                </Link>
              </li>
              <li>
                <Link href="/categories/prescription-medicines" className="hover:text-brand-600 transition-colors">
                  Prescription Medicines (Rx)
                </Link>
              </li>
              <li>
                <Link href="/categories/otc-medicines" className="hover:text-brand-600 transition-colors">
                  Over the Counter (OTC)
                </Link>
              </li>
              <li>
                <Link href="/categories/vitamins-supplements" className="hover:text-brand-600 transition-colors">
                  Vitamins & Supplements
                </Link>
              </li>
              <li>
                <Link href="/categories/healthcare-devices" className="hover:text-brand-600 transition-colors">
                  Healthcare Monitors & Devices
                </Link>
              </li>
              <li>
                <Link href="/categories/first-aid-personal-care" className="hover:text-brand-600 transition-colors">
                  First Aid & Wound Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Compliance */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
              Policies & Safety
            </h5>
            <ul className="flex flex-col gap-2 text-xs text-text-muted">
              <li>
                <Link href="/policies#prescription-policy" className="hover:text-brand-600 transition-colors">
                  Prescription Drug Policy
                </Link>
              </li>
              <li>
                <Link href="/policies#shipping-policy" className="hover:text-brand-600 transition-colors">
                  Shipping & PIN Code Delivery
                </Link>
              </li>
              <li>
                <Link href="/policies#returns-cancellation" className="hover:text-brand-600 transition-colors">
                  Returns & Cancellations
                </Link>
              </li>
              <li>
                <Link href="/policies#privacy-policy" className="hover:text-brand-600 transition-colors">
                  Privacy & Data Retention
                </Link>
              </li>
              <li>
                <Link href="/policies#terms" className="hover:text-brand-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies#medical-disclaimer" className="hover:text-brand-600 transition-colors">
                  Medical & CDSCO Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Help */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
              Help & Resources
            </h5>
            <ul className="flex flex-col gap-2 text-xs text-text-muted">
              <li>
                <Link href="/about" className="hover:text-brand-600 transition-colors">
                  About EasyMeds Platform
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-600 transition-colors">
                  Pharmacy Inquiries & Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-brand-600 transition-colors">
                  Review Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-brand-600 transition-colors">
                  Order Request Process
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory & Safety Disclaimer */}
        <div className="mt-10 pt-6 border-t border-border text-[11px] text-text-muted leading-relaxed flex flex-col gap-2">
          <p>
            <strong>Important Healthcare Disclaimer:</strong> EasyMeds is an online technology demonstration and healthcare catalog. Product descriptions, active salt compositions, and therapeutic indications are compiled for informative reference and must not be construed as medical diagnosis, prescription advice, or a guarantee of treatment outcome. In case of medical emergencies, please immediately visit the nearest hospital or consult a licensed physician.
          </p>
          <p>
            Prescription medicines (Schedule H/H1 drugs under the Drugs and Cosmetics Act & Rules, 1945) cannot be dispensed without a valid prescription issued by a registered medical practitioner (RMP). EasyMeds does not substitute or promote self-medication.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-text-subtle gap-2">
          <span>© {new Date().getFullYear()} EasyMeds Healthcare. All rights reserved.</span>
          <span>Designed with high-performance Next.js & TypeScript</span>
        </div>
      </div>
    </footer>
  );
}
