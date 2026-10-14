import { Product } from '@/types/product';
import { formatCurrency } from './utils';

/**
 * Converts a floating point INR price to integer paise (minor units)
 * to avoid IEEE 754 floating point arithmetic inaccuracies.
 */
export function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Converts integer paise back to INR rupees.
 */
export function toRupees(paise: number): number {
  return Number((paise / 100).toFixed(2));
}

/**
 * Calculates item subtotal in paise, then returns rupees.
 */
export function calculateLineTotal(unitPrice: number, quantity: number): number {
  const pricePaise = toPaise(unitPrice);
  const totalPaise = pricePaise * quantity;
  return toRupees(totalPaise);
}

/**
 * Calculates cart subtotal using integer paise units.
 */
export function calculateCartSubtotal(items: { unitPrice: number; quantity: number }[]): number {
  const subtotalPaise = items.reduce((acc, item) => {
    return acc + toPaise(item.unitPrice) * item.quantity;
  }, 0);
  return toRupees(subtotalPaise);
}

/**
 * Returns discount percentage only if MRP is explicitly verified and greater than selling price.
 * Never fabricates or invents discounts.
 */
export function calculateDiscount(price: number, mrp?: number): {
  hasDiscount: boolean;
  savingsRupees: number;
  percentage: number;
  formattedSavings: string;
} {
  if (!mrp || mrp <= price) {
    return {
      hasDiscount: false,
      savingsRupees: 0,
      percentage: 0,
      formattedSavings: '',
    };
  }

  const savingsPaise = toPaise(mrp) - toPaise(price);
  const savingsRupees = toRupees(savingsPaise);
  const percentage = Math.round((savingsPaise / toPaise(mrp)) * 100);

  return {
    hasDiscount: true,
    savingsRupees,
    percentage,
    formattedSavings: formatCurrency(savingsRupees),
  };
}

/**
 * Configurable delivery charge calculation.
 * Standard free delivery threshold can be applied (e.g. orders over ₹500 get free delivery).
 */
export function calculateDeliveryCharge(subtotal: number, threshold = 500, standardCharge = 40): number {
  if (subtotal <= 0) return 0;
  return subtotal >= threshold ? 0 : standardCharge;
}
