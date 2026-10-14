import React from 'react';
import Link from 'next/link';
import { HeartPulse, ShieldCheck, FileText, Truck, Users, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-12">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-2">
          <HeartPulse size={28} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main">
          About EasyMeds
        </h1>
        <p className="text-sm sm:text-base text-text-muted leading-relaxed">
          EasyMeds is an innovative digital pharmacy and healthcare platform built to provide transparent, safe, and reliable access to essential medicines and diagnostics across India.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-border p-6 flex flex-col gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>
          <h3 className="font-bold text-text-main text-base">Uncompromised Authenticity</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Every product in our catalog is mapped directly to certified manufacturers and licensed distributors. We reject counterfeit risks through strict supply chain traceability.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border p-6 flex flex-col gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <FileText size={22} />
          </div>
          <h3 className="font-bold text-text-main text-base">Clinical Responsibility</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            We adhere strictly to Indian regulatory mandates (CDSCO and the Drugs & Cosmetics Act). Schedule H and H1 medications are never dispensed without registered pharmacist verification.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border p-6 flex flex-col gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Truck size={22} />
          </div>
          <h3 className="font-bold text-text-main text-base">Accessible & Transparent</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Clear, honest pricing with real MRP validations. We believe patients deserve upfront clarity without hidden surcharges or fabricated discounts.
          </p>
        </div>
      </div>

      {/* Mission & Background Story */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-10 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-text-main">Our Mission</h2>
        <div className="text-xs sm:text-sm text-text-muted leading-relaxed space-y-4">
          <p>
            In a fast-growing digital healthcare ecosystem, Indian consumers frequently encounter ambiguous pricing, unreliable medicine availability, or platforms that treat regulated healthcare products like ordinary fast-moving commodities.
          </p>
          <p>
            EasyMeds was created with a different philosophy: combining modern, fast web technology with the professional diligence of a licensed community pharmacy. From active salt transparency to clear warnings and dosage forms, we empower individuals and families to manage their health safely.
          </p>
        </div>

        <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-text-main text-sm">Have questions about our catalog or standards?</h4>
            <p className="text-xs text-text-muted">Explore our full policies or contact our support team.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/policies">
              <Button variant="outline" size="sm">Review Policies</Button>
            </Link>
            <Link href="/products">
              <Button variant="primary" size="sm">Explore Products</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
