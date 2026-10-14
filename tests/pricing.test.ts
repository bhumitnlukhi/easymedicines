import {
  toPaise,
  toRupees,
  calculateLineTotal,
  calculateCartSubtotal,
  calculateDiscount,
  calculateDeliveryCharge,
} from '../lib/pricing';

describe('Pricing and Integer Minor Units', () => {
  test('converts rupees to paise without floating point error', () => {
    expect(toPaise(204.5)).toBe(20450);
    expect(toPaise(31.5)).toBe(3150);
    expect(toPaise(0.1 + 0.2)).toBe(30);
  });

  test('converts paise to rupees accurately', () => {
    expect(toRupees(20450)).toBe(204.5);
    expect(toRupees(3150)).toBe(31.5);
  });

  test('calculates line totals precisely', () => {
    expect(calculateLineTotal(31.5, 3)).toBe(94.5);
    expect(calculateLineTotal(204.5, 2)).toBe(409.0);
  });

  test('calculates multi-item cart subtotals', () => {
    const items = [
      { unitPrice: 31.5, quantity: 2 }, // 63.00
      { unitPrice: 204.5, quantity: 1 }, // 204.50
    ];
    expect(calculateCartSubtotal(items)).toBe(267.5);
  });

  test('calculates discount only when valid verified MRP is provided', () => {
    // Normal discount
    const discount = calculateDiscount(204.5, 227.2);
    expect(discount.hasDiscount).toBe(true);
    expect(discount.percentage).toBe(10);
    expect(discount.savingsRupees).toBe(22.7);

    // No MRP provided
    const noMrp = calculateDiscount(100, undefined);
    expect(noMrp.hasDiscount).toBe(false);
    expect(noMrp.percentage).toBe(0);

    // Invalid MRP <= price
    const invalidMrp = calculateDiscount(100, 100);
    expect(invalidMrp.hasDiscount).toBe(false);
  });

  test('calculates delivery charges and applies free shipping over ₹500', () => {
    expect(calculateDeliveryCharge(0)).toBe(0);
    expect(calculateDeliveryCharge(250)).toBe(40);
    expect(calculateDeliveryCharge(499.99)).toBe(40);
    expect(calculateDeliveryCharge(500)).toBe(0);
    expect(calculateDeliveryCharge(1200)).toBe(0);
  });
});
