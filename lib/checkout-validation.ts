import { z } from 'zod';

export const phoneRegex = /^[6-9]\d{9}$/;
export const pinCodeRegex = /^[1-9]\d{5}$/;

export const checkoutFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Please enter your full name (minimum 2 characters)')
    .max(80, 'Full name must be under 80 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(phoneRegex, 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)'),
  addressLine1: z
    .string()
    .min(5, 'Please provide your street or house address (minimum 5 characters)')
    .max(150, 'Address must be under 150 characters'),
  addressLine2: z
    .string()
    .max(100, 'Apartment/landmark must be under 100 characters')
    .optional(),
  city: z
    .string()
    .min(2, 'City is required')
    .max(50, 'City name is too long'),
  state: z
    .string()
    .min(2, 'State is required')
    .max(50, 'State name is too long'),
  postalCode: z
    .string()
    .regex(pinCodeRegex, 'Please enter a valid 6-digit Indian PIN code (e.g. 400001)'),
  orderNotes: z
    .string()
    .max(300, 'Order notes must be under 300 characters')
    .optional(),
  prescriptionUploaded: z.boolean().optional(),
  prescriptionFileName: z.string().optional(),
  termsAccepted: z
    .boolean()
    .refine(val => val === true, {
      message: 'You must confirm that you agree to the Terms, Conditions, and Prescription Policy',
    }),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
