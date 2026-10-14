'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../cart/CartProvider';
import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  X,
  Pill,
  ChevronDown,
  Shield,
  FileText,
  User,
  HeartPulse,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function Header() {
  const router = useRouter();
  const { summary } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinCode, setPinCode] = useState('400001');
  const [pinInput, setPinInput] = useState('400001');
  const [locationName, setLocationName] = useState('Mumbai, Maharashtra');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^[1-9]\d{5}$/.test(pinInput)) {
      setPinCode(pinInput);
      setLocationName(pinInput.startsWith('11') ? 'New Delhi' : pinInput.startsWith('56') ? 'Bengaluru' : 'Delivery Area');
      setIsPinModalOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-md group-hover:bg-brand-600 transition-colors">
                <HeartPulse size={24} className="stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-brand-600 flex items-center gap-1">
                  Easy<span className="text-text-main">Meds</span>
                </span>
                <span className="text-[10px] text-text-muted font-medium tracking-wider uppercase -mt-1">
                  Genuine Pharmacy
                </span>
              </div>
            </Link>

            {/* Delivery Location Selector (Desktop) */}
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-brand-400 bg-surface-muted hover:bg-surface-subtle transition-colors text-left"
              title="Change Delivery Location"
            >
              <MapPin size={16} className="text-brand-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider">
                  Deliver to
                </span>
                <span className="text-xs font-semibold text-text-main flex items-center gap-1">
                  {pinCode} • {locationName}
                  <ChevronDown size={12} className="text-text-muted" />
                </span>
              </div>
            </button>
          </div>

          {/* Prominent Search Bar (Desktop & Tablet) */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search medicines, active salts, wellness essentials..."
                className="w-full pl-11 pr-24 py-2.5 rounded-xl border border-border bg-surface-muted text-sm text-text-main placeholder:text-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />
              <Search
                size={18}
                className="absolute left-3.5 text-text-muted pointer-events-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* User & Cart Actions */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Prescription Order Shortcut */}
            <Link
              href="/checkout?rx=upload"
              className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-700 bg-brand-100/70 hover:bg-brand-100 transition-colors"
            >
              <FileText size={15} className="text-brand-600" />
              <span>Order with Rx</span>
            </Link>

            {/* Cart Icon with Live Badge */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 p-2.5 rounded-xl text-text-main hover:bg-surface-subtle transition-colors group"
              aria-label={`Cart with ${summary.totalQuantity} items`}
            >
              <div className="relative">
                <ShoppingCart size={22} className="text-text-main group-hover:text-brand-600 transition-colors" />
                {summary.totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {summary.totalQuantity}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-text-main group-hover:text-brand-600">
                Cart
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-text-main hover:bg-surface-subtle rounded-xl"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Directly below main bar on phones) */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search medicines, generic salt, products..."
              className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-border bg-surface-muted text-sm text-text-main placeholder:text-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search size={16} className="absolute left-3.5 text-text-muted pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 bg-brand-500 text-white text-xs font-medium rounded-lg"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Category Bar (Desktop) */}
      <nav className="hidden md:block bg-surface-muted/60 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ul className="flex items-center gap-7 text-xs font-semibold text-text-main py-2.5 overflow-x-auto no-scrollbar">
            <li>
              <Link href="/products" className="hover:text-brand-600 transition-colors whitespace-nowrap">
                All Products (352)
              </Link>
            </li>
            <li>
              <Link href="/categories/prescription-medicines" className="hover:text-brand-600 transition-colors whitespace-nowrap flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Prescription Medicines
              </Link>
            </li>
            <li>
              <Link href="/categories/mens-health-vitality" className="hover:text-brand-600 transition-colors whitespace-nowrap">
                {"Men's Health & Vitality"}
              </Link>
            </li>
            <li>
              <Link href="/categories/anti-infectives-antibiotics" className="hover:text-brand-600 transition-colors whitespace-nowrap">
                Anti-Infectives & Antibiotics
              </Link>
            </li>
            <li>
              <Link href="/categories/womens-health-fertility" className="hover:text-brand-600 transition-colors whitespace-nowrap">
                {"Women's Health"}
              </Link>
            </li>
            <li>
              <Link href="/categories/dermatology-skin-care" className="hover:text-brand-600 transition-colors whitespace-nowrap">
                Dermatology & Skin Care
              </Link>
            </li>
            <li>
              <Link href="/categories/respiratory-inhalers" className="hover:text-brand-600 transition-colors whitespace-nowrap">
                Respiratory & Inhalers
              </Link>
            </li>
            <li>
              <Link href="/categories/over-the-counter-otc" className="hover:text-brand-600 transition-colors whitespace-nowrap">
                Over the Counter (OTC)
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 flex flex-col gap-4 animate-slide-down">
          {/* Location Button on Mobile */}
          <button
            onClick={() => {
              setIsPinModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-border text-left"
          >
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-brand-500" />
              <div>
                <p className="text-xs text-text-muted">Delivery Location</p>
                <p className="text-sm font-semibold text-text-main">{pinCode} ({locationName})</p>
              </div>
            </div>
            <span className="text-xs text-brand-600 font-semibold">Change</span>
          </button>

          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider px-2">Catalog Categories</p>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-text-main hover:bg-surface-subtle"
            >
              All Products (352)
            </Link>
            <Link
              href="/categories/prescription-medicines"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-text-main hover:bg-surface-subtle flex items-center justify-between"
            >
              <span>Prescription Medicines</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Rx</span>
            </Link>
            <Link
              href="/categories/mens-health-vitality"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-text-main hover:bg-surface-subtle"
            >
              Men&apos;s Health & Vitality
            </Link>
            <Link
              href="/categories/anti-infectives-antibiotics"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-text-main hover:bg-surface-subtle"
            >
              Anti-Infectives & Antibiotics
            </Link>
            <Link
              href="/categories/womens-health-fertility"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-text-main hover:bg-surface-subtle"
            >
              Women&apos;s Health & Fertility
            </Link>
            <Link
              href="/categories/dermatology-skin-care"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-text-main hover:bg-surface-subtle"
            >
              Dermatology & Skin Care
            </Link>
            <Link
              href="/categories/respiratory-inhalers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-text-main hover:bg-surface-subtle"
            >
              Respiratory & Inhalers
            </Link>
            <Link
              href="/categories/over-the-counter-otc"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-text-main hover:bg-surface-subtle"
            >
              Over the Counter (OTC)
            </Link>
          </div>

          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-1.5 text-xs text-text-muted hover:text-text-main"
            >
              About EasyMeds
            </Link>
            <Link
              href="/policies"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-1.5 text-xs text-text-muted hover:text-text-main"
            >
              Prescription & Dispensing Policies
            </Link>
          </div>
        </div>
      )}

      {/* Pin Code Selector Modal */}
      <Modal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        title="Select Delivery Location"
        maxWidth="sm"
      >
        <form onSubmit={handleSavePin} className="flex flex-col gap-4">
          <p className="text-xs text-text-muted">
            Enter your 6-digit Indian postal PIN code to check delivery availability and estimated shipping transit.
          </p>
          <div>
            <label className="text-xs font-medium text-text-main mb-1.5 block">
              Indian PIN Code (6 Digits)
            </label>
            <input
              type="text"
              maxLength={6}
              value={pinInput}
              onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 400001, 110001, 560001"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm font-mono tracking-widest text-text-main focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPinModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!/^[1-9]\d{5}$/.test(pinInput)}
            >
              Set Location
            </Button>
          </div>
        </form>
      </Modal>
    </header>
  );
}
