import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, Truck, RotateCcw, Lock, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function PoliciesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 w-fit"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main">
          Policies & Compliance Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          Our operational commitments to patient safety, Indian pharmacy regulations, and data privacy.
        </p>
      </div>

      {/* Navigation Shortcuts */}
      <div className="flex flex-wrap gap-2 text-xs font-medium">
        <a href="#prescription-policy" className="px-3 py-1.5 rounded-xl bg-white border border-border hover:border-brand-500">
          Prescription Policy
        </a>
        <a href="#shipping-policy" className="px-3 py-1.5 rounded-xl bg-white border border-border hover:border-brand-500">
          Shipping & Delivery
        </a>
        <a href="#returns-cancellation" className="px-3 py-1.5 rounded-xl bg-white border border-border hover:border-brand-500">
          Returns & Cancellations
        </a>
        <a href="#privacy-policy" className="px-3 py-1.5 rounded-xl bg-white border border-border hover:border-brand-500">
          Privacy & Data
        </a>
        <a href="#medical-disclaimer" className="px-3 py-1.5 rounded-xl bg-white border border-border hover:border-brand-500">
          CDSCO Medical Disclaimer
        </a>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Prescription Drug Policy */}
        <section id="prescription-policy" className="bg-white rounded-3xl border border-border p-6 sm:p-8 flex flex-col gap-4 scroll-mt-20">
          <div className="flex items-center gap-2.5 text-brand-700">
            <FileText size={22} />
            <h2 className="text-xl font-bold text-text-main">1. Prescription Drug Policy (Schedule H & H1)</h2>
          </div>
          <div className="text-xs sm:text-sm text-text-muted leading-relaxed space-y-3">
            <p>
              In strict adherence to the <strong>Drugs and Cosmetics Act & Rules, 1945</strong> (including Schedule H, H1, and X regulations) and the Pharmacy Act of India, prescription medications can only be dispensed against a valid prescription issued by a Registered Medical Practitioner (RMP).
            </p>
            <p>
              <strong>Mandatory Prescription Requirements:</strong> A valid prescription must clearly indicate:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Doctor&apos;s full name, medical registration number, qualification, and clinic address.</li>
              <li>Patient&apos;s name and age/gender.</li>
              <li>Date of consultation (prescriptions must be within valid operational validity).</li>
              <li>Generic medicine name or brand, exact dosage, frequency, and duration of course.</li>
              <li>Doctor&apos;s physical or verified digital signature.</li>
            </ul>
            <p>
              Orders containing Schedule H medications will remain in <em>&ldquo;Pending Pharmacist Review&rdquo;</em> status until verified by our licensed pharmacy personnel. If a prescription cannot be verified or is illegible, the order will be placed on hold and our pharmacist will contact the patient.
            </p>
          </div>
        </section>

        {/* Shipping & Delivery Policy */}
        <section id="shipping-policy" className="bg-white rounded-3xl border border-border p-6 sm:p-8 flex flex-col gap-4 scroll-mt-20">
          <div className="flex items-center gap-2.5 text-brand-700">
            <Truck size={22} />
            <h2 className="text-xl font-bold text-text-main">2. Shipping & PIN Code Delivery Policy</h2>
          </div>
          <div className="text-xs sm:text-sm text-text-muted leading-relaxed space-y-3">
            <p>
              EasyMeds delivers to serviceable postal PIN codes across India via certified logistics partners.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Free Standard Delivery:</strong> Applicable on all orders where the item subtotal exceeds ₹500.00.</li>
              <li><strong>Standard Delivery Charge:</strong> A flat ₹40.00 shipping fee applies on orders below ₹500.00.</li>
              <li><strong>Transit Times:</strong> Standard orders are typically delivered within 24 to 48 business hours in Tier-1 metropolitan areas (Mumbai, Delhi-NCR, Bengaluru, Chennai, Hyderabad, Kolkata) and 2 to 4 business days for other regional areas.</li>
              <li><strong>Packaging Integrity:</strong> All items are packaged in tamper-evident, temperature-safe packaging to preserve product quality during transit.</li>
            </ul>
          </div>
        </section>

        {/* Returns & Cancellations */}
        <section id="returns-cancellation" className="bg-white rounded-3xl border border-border p-6 sm:p-8 flex flex-col gap-4 scroll-mt-20">
          <div className="flex items-center gap-2.5 text-brand-700">
            <RotateCcw size={22} />
            <h2 className="text-xl font-bold text-text-main">3. Returns & Cancellation Policy</h2>
          </div>
          <div className="text-xs sm:text-sm text-text-muted leading-relaxed space-y-3">
            <p>
              Due to regulatory safety standards and hygienic handling requirements for ingestible pharmaceutical products:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Eligible Returns:</strong> Items may be returned within 48 hours of delivery only if they are damaged in transit, defective, or if an incorrect batch/item was delivered.</li>
              <li><strong>Non-Returnable Items:</strong> Opened bottles, broken seal blister packs, diagnostic test strips, and temperature-sensitive biologics cannot be returned once delivered.</li>
              <li><strong>Order Cancellations:</strong> Orders may be cancelled anytime prior to pharmacist dispatch without fee. Once handed to the logistics courier, delivery must proceed.</li>
            </ul>
          </div>
        </section>

        {/* Privacy & Health Data Policy */}
        <section id="privacy-policy" className="bg-white rounded-3xl border border-border p-6 sm:p-8 flex flex-col gap-4 scroll-mt-20">
          <div className="flex items-center gap-2.5 text-brand-700">
            <Lock size={22} />
            <h2 className="text-xl font-bold text-text-main">4. Privacy & Sensitive Health Data</h2>
          </div>
          <div className="text-xs sm:text-sm text-text-muted leading-relaxed space-y-3">
            <p>
              We treat patient privacy and confidentiality with the highest standards:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>We collect only the minimum required information necessary to fulfill medicine orders and verify prescriptions.</li>
              <li>We do not store payment card details on our servers or client storage.</li>
              <li>Uploaded prescription documents are accessible exclusively to authorized pharmacy personnel for clinical evaluation and are never shared with marketing partners.</li>
              <li>In static demonstration environments, order requests are contained locally within your browser session and not exposed publicly.</li>
            </ul>
          </div>
        </section>

        {/* CDSCO Medical Disclaimer */}
        <section id="medical-disclaimer" className="bg-white rounded-3xl border border-border p-6 sm:p-8 flex flex-col gap-4 scroll-mt-20">
          <div className="flex items-center gap-2.5 text-amber-700">
            <AlertTriangle size={22} />
            <h2 className="text-xl font-bold text-text-main">5. Medical & Regulatory Disclaimer (CDSCO)</h2>
          </div>
          <div className="text-xs sm:text-sm text-text-muted leading-relaxed space-y-3">
            <p>
              The product descriptions, therapeutic salt indications, and dosage guidelines presented on EasyMeds are provided strictly for educational and informational reference.
            </p>
            <p>
              <strong>Not Medical Advice:</strong> Information on this website must never be used as a substitute for professional diagnosis, medical treatment, or personalized clinical advice from a registered medical practitioner. EasyMeds does not recommend self-medication, nor do we promote unregulated medicine substitutions.
            </p>
            <p>
              In case of severe acute symptoms, adverse drug reactions, or clinical emergencies, immediately contact your physician or visit the emergency department of a recognized hospital.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
