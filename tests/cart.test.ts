import {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  getCartSummary,
  MAX_QUANTITY_PER_ITEM,
} from '../lib/cart';
import { getAllProducts } from '../lib/catalog';
import { CartItem } from '../types/order';

describe('Shopping Cart State Operations', () => {
  const allProducts = getAllProducts();
  const otcProduct = allProducts.find(p => !p.prescriptionRequired)!;
  const rxProduct = allProducts.find(p => p.prescriptionRequired && p.price > 0)!;

  test('adds product to empty cart', () => {
    const cart: CartItem[] = [];
    const updated = addItemToCart(cart, otcProduct, 1);
    expect(updated.length).toBe(1);
    expect(updated[0].product.id).toBe(otcProduct.id);
    expect(updated[0].quantity).toBe(1);
    expect(updated[0].unitPrice).toBe(otcProduct.price);
  });

  test('increments quantity when existing product is added again', () => {
    let cart = addItemToCart([], rxProduct, 1);
    cart = addItemToCart(cart, rxProduct, 2);
    expect(cart.length).toBe(1);
    expect(cart[0].quantity).toBe(3);
    expect(cart[0].subtotal).toBe(Number((rxProduct.price * 3).toFixed(2)));
  });

  test('caps quantity at MAX_QUANTITY_PER_ITEM', () => {
    let cart = addItemToCart([], otcProduct, 8);
    cart = addItemToCart(cart, otcProduct, 5);
    expect(cart[0].quantity).toBe(MAX_QUANTITY_PER_ITEM);
  });

  test('removes item when quantity updated to 0', () => {
    let cart = addItemToCart([], otcProduct, 2);
    cart = updateItemQuantity(cart, otcProduct.id, 0);
    expect(cart.length).toBe(0);
  });

  test('removes item explicitly with removeItemFromCart', () => {
    let cart = addItemToCart([], otcProduct, 1);
    cart = addItemToCart(cart, rxProduct, 1);
    expect(cart.length).toBe(2);

    cart = removeItemFromCart(cart, otcProduct.id);
    expect(cart.length).toBe(1);
    expect(cart[0].product.id).toBe(rxProduct.id);
  });

  test('detects prescription requirements accurately in cart summary', () => {
    // Cart with only OTC items
    const otcCart = addItemToCart([], otcProduct, 1);
    const otcSummary = getCartSummary(otcCart);
    expect(otcSummary.hasPrescriptionItems).toBe(false);

    // Cart with Schedule H item added
    const rxCart = addItemToCart(otcCart, rxProduct, 1);
    const rxSummary = getCartSummary(rxCart);
    expect(rxSummary.hasPrescriptionItems).toBe(true);
    expect(rxSummary.prescriptionItemNames).toContain(rxProduct.name);
  });
});
