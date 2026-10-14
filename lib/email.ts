import { OrderSubmissionData, OrderConfirmationResult } from '@/types/order';
import { formatCurrency } from './utils';

/**
 * Generates an auditable order reference string.
 * Example: EM-20261014-9842
 */
export function generateOrderReference(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `EM-${dateStr}-${randomSuffix}`;
}

/**
 * Generates a human-readable order summary text for email body or display.
 */
export function generateOrderSummaryText(orderData: OrderSubmissionData, orderRef: string): string {
  const lines: string[] = [
    `EasyMeds Order Request: ${orderRef}`,
    `Date: ${new Date().toLocaleString('en-IN')}`,
    `----------------------------------------------------`,
    `CUSTOMER DETAILS:`,
    `Name: ${orderData.customer.fullName}`,
    `Email: ${orderData.customer.email}`,
    `Phone: ${orderData.customer.phone}`,
    `Address: ${orderData.customer.addressLine1}${orderData.customer.addressLine2 ? ', ' + orderData.customer.addressLine2 : ''}`,
    `City/State: ${orderData.customer.city}, ${orderData.customer.state} - ${orderData.customer.postalCode}`,
    `Order Notes: ${orderData.customer.orderNotes || 'None'}`,
    `----------------------------------------------------`,
    `ITEMS REQUESTED:`,
  ];

  orderData.items.forEach((item, idx) => {
    const rxTag = item.prescriptionRequired ? ' [PRESCRIPTION REQUIRED]' : '';
    lines.push(
      `${idx + 1}. ${item.productName} (SKU: ${item.sku})${rxTag}`,
      `   Qty: ${item.quantity} x ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.subtotal)}`
    );
  });

  lines.push(
    `----------------------------------------------------`,
    `Subtotal: ${formatCurrency(orderData.subtotal)}`,
    `Delivery Charge: ${formatCurrency(orderData.deliveryCharge)}`,
    `Final Total: ${formatCurrency(orderData.finalTotal)}`,
    `----------------------------------------------------`,
    `PRESCRIPTION STATUS:`,
    orderData.hasPrescriptionItems
      ? `ATTENTION: Order contains prescription medications. A registered pharmacist will verify your medical prescription before dispatch.`
      : `No prescription medications in this order.`
  );

  return lines.join('\n');
}

/**
 * Generates an encoded mailto: URI for demonstration or offline order inquiries.
 * Explains that client-side mailto will open the customer's email client and requires them to send it.
 */
export function generateOrderMailtoLink(
  orderData: OrderSubmissionData,
  orderRef: string,
  businessEmail = 'orders@easymeds-demo.in'
): string {
  const subject = encodeURIComponent(`EasyMeds Order Request [${orderRef}] - ${orderData.customer.fullName}`);
  const body = encodeURIComponent(generateOrderSummaryText(orderData, orderRef));
  return `mailto:${businessEmail}?subject=${subject}&body=${body}`;
}

/**
 * Demo submission handler: processes order in static mode, saves to sessionStorage for order-confirmation view,
 * and returns truthful confirmation result.
 */
export function processDemoOrderSubmission(orderData: OrderSubmissionData): OrderConfirmationResult {
  const orderRef = generateOrderReference();
  const timestamp = new Date().toISOString();

  const status = orderData.hasPrescriptionItems
    ? 'prescription_verification_required'
    : 'confirmed_demo';

  const nextSteps: string[] = [];
  if (orderData.hasPrescriptionItems) {
    nextSteps.push('Prescription Verification: Our licensed pharmacist will review the prescription details.');
    nextSteps.push('Confirmation Call: You may receive a verification call on ' + orderData.customer.phone + ' to confirm dosage.');
    nextSteps.push('Dispatch: Medicines will be securely packaged and dispatched once verified.');
  } else {
    nextSteps.push('Order Acknowledgment: Your order request has been logged in this demonstration session.');
    nextSteps.push('Packaging: Healthcare items are readied for dispatch.');
    nextSteps.push('Estimated Delivery: 24-48 business hours depending on PIN code coverage.');
  }

  const result: OrderConfirmationResult = {
    orderReference: orderRef,
    status,
    createdAt: timestamp,
    customer: orderData.customer,
    items: orderData.items.map(i => ({
      id: i.productId,
      product: {
        id: i.productId,
        sku: i.sku,
        slug: '',
        name: i.productName,
        brand: '',
        category: '',
        description: '',
        price: i.unitPrice,
        currency: 'INR',
        imageUrl: '',
        prescriptionRequired: i.prescriptionRequired,
        availabilityStatus: 'in_stock',
        matchConfidence: 'exact',
        verificationStatus: 'demo',
      },
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      subtotal: i.subtotal,
    })),
    subtotal: orderData.subtotal,
    deliveryCharge: orderData.deliveryCharge,
    finalTotal: orderData.finalTotal,
    hasPrescriptionItems: orderData.hasPrescriptionItems,
    prescriptionNotice: orderData.hasPrescriptionItems
      ? 'Prescription required for dispensing. In this demo, no real medicine will be dispatched.'
      : undefined,
    nextSteps,
    isDemoNotice: 'Static Demonstration Mode: This order has been recorded in your local browser session for testing purposes. In production, this connects to an authenticated server-side API with PostgreSQL/MongoDB and transactional email service (e.g. Resend, SendGrid).',
  };

  if (typeof window !== 'undefined') {
    sessionStorage.setItem('easymeds_latest_order', JSON.stringify(result));
  }

  return result;
}
