import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories, getFeaturedProducts, getProductsByCategory } from '@/lib/catalog';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Clock,
  HeartPulse,
  Pill,
  FileText,
  Activity,
  ShieldPlus,
  Sparkles,
  Truck,
  PhoneCall,
} from 'lucide-react';

export default function HomePage() {
  const categories = getAllCategories();
  const featuredProducts = getFeaturedProducts(8);
  const antibioticProducts = getProductsByCategory('anti-infectives-antibiotics').slice(0, 4);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="text-amber-600" size={24} />;
      case 'Pill':
        return <Pill className="text-brand-600" size={24} />;
      case 'HeartPulse':
        return <HeartPulse className="text-rose-600" size={24} />;
      case 'Activity':
        return <Activity className="text-blue-600" size={24} />;
      case 'ShieldPlus':
        return <ShieldPlus className="text-emerald-600" size={24} />;
      case 'Sparkles':
        return <Sparkles className="text-purple-600" size={24} />;
      default:
        return <Pill className="text-brand-600" size={24} />;
    }
  };

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16">
      
      {/* SECTION A: Hero Area */}
      <section className="bg-gradient-to-b from-brand-50/80 via-surface-muted to-surface-muted pt-8 sm:pt-14 pb-8 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/90 text-brand-800 text-xs font-semibold w-fit border border-brand-200">
                <Sparkles size={14} className="text-brand-600" />
                <span>Verified Online Medicine & Healthcare</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-main tracking-tight leading-[1.15]">
                Your healthcare essentials,{' '}
                <span className="text-brand-600">made easier.</span>
              </h1>

              <p className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed">
                Order genuine prescription medicines, OTC daily remedies, vitamins, and clinical health monitors with transparent pricing and licensed pharmacist review.
              </p>

              {/* In-Hero Search Form */}
              <form action="/products" method="GET" className="mt-2 max-w-lg relative flex items-center shadow-md rounded-2xl bg-white border border-brand-200/80 p-1.5 focus-within:ring-2 focus-within:ring-brand-500 transition-all">
                <Search size={20} className="ml-3 text-text-muted shrink-0" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search Dolo 650, Augmentin, BP Monitor, Cetirizine..."
                  className="w-full px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none bg-transparent"
                />
                <Button type="submit" variant="primary" size="md" className="shrink-0 rounded-xl">
                  <span>Search</span>
                </Button>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/products">
                  <Button variant="primary" size="lg" className="rounded-xl shadow-md">
                    <span>Explore Products</span>
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link href="/#categories">
                  <Button variant="outline" size="lg" className="rounded-xl">
                    <span>Browse Categories</span>
                  </Button>
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/80 text-xs text-text-muted">
                <div>
                  <span className="font-bold text-text-main block text-sm sm:text-base">100% Genuine</span>
                  <span>Direct from verified mfrs</span>
                </div>
                <div>
                  <span className="font-bold text-text-main block text-sm sm:text-base">Licensed Rx</span>
                  <span>Schedule H compliance</span>
                </div>
                <div>
                  <span className="font-bold text-text-main block text-sm sm:text-base">Free Delivery</span>
                  <span>On orders over ₹500</span>
                </div>
              </div>
            </div>

            {/* Right Healthcare Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-3xl bg-gradient-to-tr from-brand-100 to-emerald-50 p-6 border border-brand-200/60 shadow-xl overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-border shadow-xs">
                    <HeartPulse size={18} className="text-brand-600" />
                    <span className="text-xs font-bold text-text-main">EasyMeds Clinical Care</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-500 text-white px-2.5 py-1 rounded-lg">
                    Authentic
                  </span>
                </div>

                <div className="space-y-2.5 py-4">
                  <div className="bg-white/95 rounded-2xl p-3.5 shadow-sm border border-border/60 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-text-main truncate">Schedule H Prescription Check</p>
                      <p className="text-[11px] text-text-muted">Pharmacist review before every dispatch</p>
                    </div>
                  </div>

                  <div className="bg-white/95 rounded-2xl p-3.5 shadow-sm border border-border/60 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-text-main truncate">Transparent Pricing</p>
                      <p className="text-[11px] text-text-muted">Strictly catalog-verified MRP & discounts</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-text-muted bg-white/80 p-2.5 rounded-xl">
                  <span>Fast shipping across major PIN codes</span>
                  <Link href="/products" className="text-brand-700 font-semibold hover:underline">
                    Shop Now →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION B: Category Shortcuts */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Browse by Department
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-main mt-0.5">
              Healthcare Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group bg-white rounded-2xl border border-border hover:border-brand-400 p-4 sm:p-5 flex flex-col items-start gap-3 hover:shadow-md transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                {getCategoryIcon(cat.iconName)}
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-text-main group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-text-muted mt-1 line-clamp-1">
                  {cat.itemCount ? `${cat.itemCount} items available` : 'Browse collection'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION C: Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Verified Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-main mt-0.5">
              Featured Medicines & Wellness
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>Explore All</span>
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION D: Trust & Service Information */}
      <section className="bg-white border-y border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-text-main">
              Safe & Trusted Online Medicine Ordering
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-2">
              Built with patient safety, verified product authenticity, and strict pharmacy compliance at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-surface-muted border border-border flex flex-col gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-semibold text-text-main text-sm">Authentic Sourcing</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Products are sourced strictly through authorized pharmaceutical channels with uncompromised batch records.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-muted border border-border flex flex-col gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <FileText size={22} />
              </div>
              <h3 className="font-semibold text-text-main text-sm">Prescription-Aware Flow</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Schedule H medications cannot bypass clinical verification. Every prescription is checked by a registered pharmacist.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-muted border border-border flex flex-col gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <Truck size={22} />
              </div>
              <h3 className="font-semibold text-text-main text-sm">Temperature-Safe Transit</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Sensitive healthcare products and diagnostics are packed carefully to withstand transport across India.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-muted border border-border flex flex-col gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <PhoneCall size={22} />
              </div>
              <h3 className="font-semibold text-text-main text-sm">Order Assistance</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Need help uploading your prescription or finding generic substitutes? Our support desk is ready to assist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: Additional Discovery - Anti-Infectives & Antibiotics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Targeted Therapeutics
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-main mt-0.5">
              Anti-Infectives & Antibiotics
            </h2>
          </div>
          <Link
            href="/categories/anti-infectives-antibiotics"
            className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View All Anti-Infectives</span>
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {antibioticProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* OTC Daily Remedies Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-brand-900 text-white rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-lg">
            <span className="text-brand-300 text-xs font-bold uppercase tracking-wider">
              No Prescription Needed
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Daily OTC Health & Wellness Essentials
            </h3>
            <p className="text-brand-100/80 text-xs sm:text-sm mt-2 leading-relaxed">
              Stock your medicine cabinet with trusted remedies for fever, pain relief, and daily wellness without waiting for a prescription.
            </p>
          </div>
          <Link href="/categories/over-the-counter-otc">
            <Button variant="secondary" size="lg" className="rounded-xl whitespace-nowrap font-semibold">
              <span>Shop OTC Remedies</span>
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
