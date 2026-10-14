import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts, getProductBySlug, getRelatedProducts } from '@/lib/catalog';
import { formatCurrency } from '@/lib/utils';
import { calculateDiscount } from '@/lib/pricing';
import { ProductCard } from '@/components/products/ProductCard';
import { PrescriptionNotice } from '@/components/products/PrescriptionNotice';
import { ProductDetailActions } from './ProductDetailActions';
import {
  ShieldCheck,
  FileText,
  AlertCircle,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Info,
  Pill,
  Building2,
  Package,
} from 'lucide-react';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map(product => ({
    slug: product.slug,
  }));
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const discount = calculateDiscount(product.price, product.mrp);
  const related = getRelatedProducts(product.id, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-10">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-muted">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-brand-600 transition-colors">
          Medicines
        </Link>
        <ChevronRight size={12} />
        <span className="text-text-main font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start bg-white rounded-3xl border border-border p-6 sm:p-8">
        
        {/* Left: Product Image Container */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative w-full aspect-square bg-surface-subtle rounded-2xl border border-border/80 p-6 flex items-center justify-center overflow-hidden">
            {product.prescriptionRequired && (
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase shadow-xs">
                  <FileText size={13} className="text-amber-700" />
                  <span>Rx Required</span>
                </span>
              </div>
            )}

            {discount.hasDiscount && (
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-md shadow-xs">
                  {discount.percentage}% OFF
                </span>
              </div>
            )}

            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain p-4"
              />
            </div>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-muted border border-border text-xs text-text-muted">
            <ShieldCheck size={16} className="text-brand-600 shrink-0" />
            <span>
              100% Genuine product sourced from authorized distributor of {product.manufacturer || product.brand}.
            </span>
          </div>
        </div>

        {/* Right: Product Details & Buying Actions */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 mb-1">
              <span>{product.brand}</span>
              {product.category && (
                <>
                  <span className="text-text-subtle">•</span>
                  <span className="text-text-muted">{product.category}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-text-main leading-tight">
              {product.name}
            </h1>

            {/* Salt & Active Ingredients */}
            {product.genericName && (
              <p className="text-xs sm:text-sm text-text-muted italic mt-1">
                Salt Composition: <span className="text-text-main font-medium">{product.genericName}</span>
              </p>
            )}
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-y border-border text-xs">
            {product.strength && (
              <div className="flex flex-col">
                <span className="text-text-muted">Strength</span>
                <span className="font-semibold text-text-main">{product.strength}</span>
              </div>
            )}
            {product.dosageForm && (
              <div className="flex flex-col">
                <span className="text-text-muted">Dosage Form</span>
                <span className="font-semibold text-text-main">{product.dosageForm}</span>
              </div>
            )}
            {product.packSize && (
              <div className="flex flex-col">
                <span className="text-text-muted">Pack Packaging</span>
                <span className="font-semibold text-text-main">{product.packSize}</span>
              </div>
            )}
            {product.sku && (
              <div className="flex flex-col">
                <span className="text-text-muted">SKU Code</span>
                <span className="font-mono text-text-main font-medium">{product.sku}</span>
              </div>
            )}
          </div>

          {/* Pricing Box */}
          <div className="flex flex-col gap-1 bg-surface-muted p-4 rounded-2xl border border-border">
            {product.isPriceOnRequest ? (
              <div className="flex flex-col gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-brand-700">
                  Price on Request
                </span>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Original spreadsheet price was not listed or requires customized batch quoting. Add to your order inquiry to receive the current distributor rate.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-text-main">
                    {formatCurrency(product.price)}
                  </span>
                  {discount.hasDiscount && product.mrp && (
                    <span className="text-sm text-text-subtle line-through">
                      MRP {formatCurrency(product.mrp)}
                    </span>
                  )}
                </div>
                {discount.hasDiscount && (
                  <span className="text-xs text-emerald-700 font-semibold">
                    You save {discount.formattedSavings} ({discount.percentage}% discount)
                  </span>
                )}
                <span className="text-[11px] text-text-muted mt-1">
                  Inclusive of all applicable GST taxes.
                </span>
              </>
            )}
          </div>

          {/* Prescription Alert if Required */}
          {product.prescriptionRequired && (
            <PrescriptionNotice productName={product.name} />
          )}

          {/* Client-side Add to Cart with Quantity Stepper */}
          <ProductDetailActions product={product} />

          {/* Shipping & Returns Quick Reassurance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-brand-600 shrink-0" />
              <span>Standard transit 24-48 hrs across PIN codes</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={16} className="text-brand-600 shrink-0" />
              <span>Easy replacement on damaged seal</span>
            </div>
          </div>

        </div>

      </div>

      {/* Clinical Product Information & Uses Tabs */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main pb-3 border-b border-border">
          Product Information & Clinical Guidelines
        </h2>

        {/* General Description */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-2">
            Description
          </h3>
          <p className="text-sm text-text-main leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Key Info Sections */}
        {product.keyInformation && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
            {product.keyInformation.uses && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-2">
                  Therapeutic Uses
                </h4>
                <ul className="list-disc list-inside text-xs sm:text-sm text-text-muted space-y-1">
                  {product.keyInformation.uses.map((use, i) => (
                    <li key={i}>{use}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.keyInformation.precautions && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                  Key Precautions
                </h4>
                <ul className="list-disc list-inside text-xs sm:text-sm text-text-muted space-y-1">
                  {product.keyInformation.precautions.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.keyInformation.storage && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                  Storage Conditions
                </h4>
                <p className="text-xs sm:text-sm text-text-muted">
                  {product.keyInformation.storage}
                </p>
              </div>
            )}

            {product.keyInformation.dosageGuidelines && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                  Dosage Guidelines
                </h4>
                <p className="text-xs sm:text-sm text-text-muted">
                  {product.keyInformation.dosageGuidelines}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Catalog Traceability and Verification Notice */}
        <div className="mt-4 p-4 rounded-2xl bg-surface-muted border border-border text-xs text-text-muted flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-text-main">
            <Info size={14} className="text-brand-600 shrink-0" />
            <span>Catalog Auditing & Verification Traceability</span>
          </div>
          <p>
            Manufacturer: <strong>{product.manufacturer || product.brand}</strong> • Verification Status:{' '}
            <strong className="capitalize">{product.verificationStatus}</strong> • Match Confidence:{' '}
            <strong className="capitalize">{product.matchConfidence}</strong>
            {product.sourceSpreadsheetRow && ` • Spreadsheet Row: ${product.sourceSpreadsheetRow}`}
          </p>
          <p className="text-[11px] text-text-subtle">
            All prices and medicine identities are preserved exactly as configured in the catalog. Medical claims are reviewed for compliance with CDSCO guidelines.
          </p>
        </div>
      </div>

      {/* Related Products Recommendations */}
      {related.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-xl sm:text-2xl font-bold text-text-main">
            Related Healthcare Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
