import { Product } from './product';

export interface CartItem {
  id: string; // Unique cart item identifier (usually product.id)
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CartSummary {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  deliveryCharge: number;
  finalTotal: number;
  hasPrescriptionItems: boolean;
  prescriptionItemNames: string[];
}

export type OrderStatus =
  | 'pending_review'
  | 'confirmed_demo'
  | 'prescription_verification_required'
  | 'cancelled';

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  orderNotes?: string;
}

export interface OrderSubmissionData {
  customer: CustomerDetails;
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    prescriptionRequired: boolean;
  }[];
  subtotal: number;
  deliveryCharge: number;
  finalTotal: number;
  hasPrescriptionItems: boolean;
  prescriptionDetails?: {
    uploadedFileName?: string;
    fileSize?: number;
    consultationRequested?: boolean;
    doctorName?: string;
  };
  deliveryMethod: string;
  termsAccepted: boolean;
  submissionType: 'demo_submission' | 'mailto_inquiry' | 'production_api';
}

export interface OrderConfirmationResult {
  orderReference: string;
  status: OrderStatus;
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  finalTotal: number;
  hasPrescriptionItems: boolean;
  prescriptionNotice?: string;
  nextSteps: string[];
  isDemoNotice: string;
}
