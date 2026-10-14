import React from 'react';
import { FileText, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface PrescriptionNoticeProps {
  productName?: string;
  compact?: boolean;
}

export function PrescriptionNotice({ productName, compact = false }: PrescriptionNoticeProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
        <FileText size={16} className="text-amber-700 shrink-0" />
        <span>
          <strong>Prescription Required:</strong> A valid doctor&apos;s prescription is required to dispense this medicine.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/60 rounded-2xl border border-amber-200/90 p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2.5 text-amber-900 font-semibold text-sm">
        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
          <FileText size={16} />
        </div>
        <span>Prescription Required (Schedule H Drug)</span>
      </div>

      <p className="text-xs text-amber-950/80 leading-relaxed">
        Under the Drugs and Cosmetics Act & Rules, 1945, {productName || 'this medicine'} can only be dispensed against a valid prescription issued by a registered medical practitioner (RMP).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-amber-900 pt-1">
        <div className="flex items-start gap-1.5">
          <CheckCircle2 size={13} className="text-amber-700 shrink-0 mt-0.5" />
          <span>Upload doctor&apos;s prescription during checkout</span>
        </div>
        <div className="flex items-start gap-1.5">
          <CheckCircle2 size={13} className="text-amber-700 shrink-0 mt-0.5" />
          <span>Reviewed by a qualified registered pharmacist</span>
        </div>
      </div>

      <div className="text-[10px] text-amber-800/80 border-t border-amber-200/70 pt-2 flex items-center gap-1.5">
        <ShieldAlert size={12} className="text-amber-700 shrink-0" />
        <span>No medicine will be dispatched until prescription verification is approved.</span>
      </div>
    </div>
  );
}
