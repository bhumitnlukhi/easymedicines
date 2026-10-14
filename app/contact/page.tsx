'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main">
          Contact EasyMeds Support
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-2">
          Have an inquiry regarding medicine availability, prescription verification, or delivery PIN codes? Our team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info Sidebar */}
        <div className="md:col-span-5 flex flex-col gap-5">
          <div className="bg-white rounded-3xl border border-border p-6 flex flex-col gap-5 shadow-xs">
            <h3 className="font-bold text-text-main text-base border-b border-border pb-3">
              Pharmacy Desk Details
            </h3>

            <div className="flex flex-col gap-4 text-xs text-text-muted">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="font-semibold text-text-main block">Helpline Contact</span>
                  <span>+91 (Configurable Business Helpline)</span>
                  <p className="text-[11px] text-text-subtle mt-0.5">Mon - Sat: 9:00 AM - 8:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="font-semibold text-text-main block">Email Inquiries</span>
                  <span>support@easymeds-demo.in</span>
                  <p className="text-[11px] text-text-subtle mt-0.5">Responses typically within 2-4 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="font-semibold text-text-main block">Pharmacist Desk Hours</span>
                  <span>10:00 AM - 7:00 PM (IST)</span>
                  <p className="text-[11px] text-text-subtle mt-0.5">Available for Schedule H verification assistance</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="font-semibold text-text-main block">Registered Office</span>
                  <span>Registered Operations Center (Configurable via business environment)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-text-main mb-4">Send an Inquiry</h2>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center flex flex-col items-center gap-3">
              <CheckCircle2 size={36} className="text-emerald-600" />
              <h3 className="font-bold text-text-main text-base">Inquiry Received</h3>
              <p className="text-xs text-text-muted max-w-sm">
                Thank you for reaching out! In this demonstration mode, your message has been logged. Our customer service team will respond to {formData.email || 'your email'}.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                }}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name *"
                  required
                  placeholder="e.g. Priya Patel"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Email Address *"
                  type="email"
                  required
                  placeholder="e.g. priya@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  label="Subject *"
                  required
                  placeholder="e.g. Prescription Verification"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-main">
                  Message Details *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe your question or medicine inquiry..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <Button type="submit" variant="primary" size="md" className="mt-2 w-full sm:w-auto self-start">
                <Send size={16} />
                <span>Submit Inquiry</span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
