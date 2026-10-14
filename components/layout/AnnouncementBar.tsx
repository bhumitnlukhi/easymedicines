'use client';

import React, { useState } from 'react';
import { ShieldCheck, Truck, X } from 'lucide-react';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-brand-900 text-brand-100 text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto py-0.5 no-scrollbar mx-auto sm:mx-0">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Truck size={14} className="text-brand-300" />
            <span>Free delivery on orders over ₹500</span>
          </span>
          <span className="hidden md:inline text-brand-500">•</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <ShieldCheck size={14} className="text-brand-300" />
            <span>Schedule H prescription medicines reviewed by licensed pharmacists</span>
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-brand-300 hover:text-white p-0.5 ml-2 transition-colors shrink-0"
          aria-label="Dismiss announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
