'use client';

import React, { useState } from 'react';
import { FileText, ShieldAlert, Upload, CheckCircle2, PhoneCall } from 'lucide-react';

interface PrescriptionSectionProps {
  prescriptionItems: string[];
  onUploadStateChange: (hasFile: boolean, fileName?: string) => void;
}

export function PrescriptionSection({
  prescriptionItems,
  onUploadStateChange,
}: PrescriptionSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<'upload' | 'callback'>('upload');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onUploadStateChange(true, file.name);
    } else {
      setFileName(null);
      onUploadStateChange(false);
    }
  };

  return (
    <div className="bg-amber-50/50 rounded-2xl border border-amber-200/90 p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
          <FileText size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-text-main text-base flex items-center gap-2">
            <span>Prescription Verification Required</span>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold uppercase">
              Schedule H
            </span>
          </h3>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            The following items in your cart legally require a valid doctor&apos;s prescription under the Indian Drugs and Cosmetics Act:
          </p>
        </div>
      </div>

      {/* List of items */}
      <div className="bg-white rounded-xl border border-amber-200 p-3">
        <ul className="list-disc list-inside text-xs font-medium text-amber-950 space-y-1">
          {prescriptionItems.map((name, idx) => (
            <li key={idx} className="truncate">
              {name}
            </li>
          ))}
        </ul>
      </div>

      {/* Verification method selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            setSelectedMethod('upload');
            onUploadStateChange(Boolean(fileName), fileName || undefined);
          }}
          className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
            selectedMethod === 'upload'
              ? 'bg-white border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
              : 'bg-white/60 border-border hover:bg-white'
          }`}
        >
          <Upload size={18} className="text-brand-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-text-main">Attach Prescription File</p>
            <p className="text-[11px] text-text-muted mt-0.5">Upload a photo or PDF of your doctor&apos;s prescription.</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedMethod('callback');
            onUploadStateChange(false, 'Pharmacist Assistance Requested');
          }}
          className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
            selectedMethod === 'callback'
              ? 'bg-white border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
              : 'bg-white/60 border-border hover:bg-white'
          }`}
        >
          <PhoneCall size={18} className="text-brand-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-text-main">Pharmacist Callback</p>
            <p className="text-[11px] text-text-muted mt-0.5">Our pharmacist will call you to collect prescription details.</p>
          </div>
        </button>
      </div>

      {/* Upload Input UI */}
      {selectedMethod === 'upload' && (
        <div className="mt-2 bg-white rounded-xl border-2 border-dashed border-amber-300 p-5 flex flex-col items-center justify-center text-center">
          <input
            type="file"
            id="prescription-file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="prescription-file"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
              <Upload size={18} />
            </div>
            {fileName ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg">
                <CheckCircle2 size={14} />
                <span>Selected: {fileName}</span>
              </div>
            ) : (
              <>
                <span className="text-xs font-semibold text-brand-600 hover:underline">
                  Click to choose prescription file
                </span>
                <span className="text-[11px] text-text-muted">
                  Supports JPG, PNG, or PDF (Max 5MB)
                </span>
              </>
            )}
          </label>
        </div>
      )}

      {/* Strict Regulatory Notice */}
      <div className="flex items-start gap-2 text-[11px] text-amber-900 border-t border-amber-200/70 pt-3">
        <ShieldAlert size={14} className="text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Safety Commitment:</strong> Orders with prescription drugs are placed in <em>&quot;Pending Pharmacist Review&quot;</em> status. EasyMeds will never dispense or ship prescription drugs without clinical validation by a registered pharmacist.
        </p>
      </div>
    </div>
  );
}
