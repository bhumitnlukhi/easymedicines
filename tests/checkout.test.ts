import { checkoutFormSchema } from '../lib/checkout-validation';
import { generateOrderReference, generateOrderSummaryText, processDemoOrderSubmission } from '../lib/email';
import { OrderSubmissionData } from '../types/order';

describe('Checkout Validation and Order Submission', () => {
  const validData = {
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '9876543210',
    addressLine1: 'Flat 402, Sunshine Apartments, MG Road',
    addressLine2: 'Near Central Mall',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    orderNotes: 'Please ring bell',
    termsAccepted: true,
  };

  test('accepts valid customer and address data', () => {
    const result = checkoutFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test('rejects invalid email address', () => {
    const invalid = { ...validData, email: 'not-an-email' };
    const result = checkoutFormSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  test('rejects invalid Indian mobile number', () => {
    // 9 digits instead of 10
    const shortPhone = { ...validData, phone: '987654321' };
    expect(checkoutFormSchema.safeParse(shortPhone).success).toBe(false);

    // Invalid starting digit
    const invalidStart = { ...validData, phone: '1234567890' };
    expect(checkoutFormSchema.safeParse(invalidStart).success).toBe(false);
  });

  test('rejects invalid Indian PIN code', () => {
    // 5 digits
    const shortPin = { ...validData, postalCode: '40001' };
    expect(checkoutFormSchema.safeParse(shortPin).success).toBe(false);

    // Alpha PIN code
    const alphaPin = { ...validData, postalCode: '40000A' };
    expect(checkoutFormSchema.safeParse(alphaPin).success).toBe(false);
  });

  test('requires acceptance of terms and conditions', () => {
    const noTerms = { ...validData, termsAccepted: false };
    const result = checkoutFormSchema.safeParse(noTerms);
    expect(result.success).toBe(false);
  });

  test('generates formatted order reference starting with EM-YYYYMMDD', () => {
    const ref = generateOrderReference();
    expect(ref.startsWith('EM-')).toBe(true);
    expect(ref.length).toBeGreaterThan(12);
  });

  test('processes demo order submission with truthful prescription status', () => {
    const payload: OrderSubmissionData = {
      customer: validData,
      items: [
        {
          productId: 'em-sku-0001',
          productName: 'Augmentin 625 Duo Tablet',
          sku: 'EM-SKU-0001',
          quantity: 1,
          unitPrice: 204.5,
          subtotal: 204.5,
          prescriptionRequired: true,
        },
      ],
      subtotal: 204.5,
      deliveryCharge: 40,
      finalTotal: 244.5,
      hasPrescriptionItems: true,
      deliveryMethod: 'Standard Verified Shipping',
      termsAccepted: true,
      submissionType: 'demo_submission',
    };

    const confirmation = processDemoOrderSubmission(payload);
    expect(confirmation.status).toBe('prescription_verification_required');
    expect(confirmation.hasPrescriptionItems).toBe(true);
    expect(confirmation.orderReference).toBeDefined();
    expect(confirmation.isDemoNotice).toContain('Static Demonstration Mode');
  });
});
