import { Product } from '@/types/product';
import { CartItem, CartSummary } from '@/types/order';
import { calculateCartSubtotal, calculateDeliveryCharge, calculateLineTotal } from './pricing';
import { getProductById } from './catalog';

export const CART_STORAGE_KEY = 'easymeds_cart_v1';
export const MAX_QUANTITY_PER_ITEM = 10;
export const MIN_QUANTITY_PER_ITEM = 1;

export function getCartSummary(items: CartItem[]): CartSummary {
  // Re-verify items against catalog to prevent client-side price tampering
  const validatedItems: CartItem[] = items.map(item => {
    const verifiedProduct = getProductById(item.product.id) || item.product;
    const unitPrice = verifiedProduct.price;
    const subtotal = calculateLineTotal(unitPrice, item.quantity);
    return {
      ...item,
      product: verifiedProduct,
      unitPrice,
      subtotal,
    };
  });

  const totalQuantity = validatedItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = calculateCartSubtotal(validatedItems);
  const deliveryCharge = calculateDeliveryCharge(subtotal);
  const finalTotal = Number((subtotal + deliveryCharge).toFixed(2));

  const prescriptionItems = validatedItems.filter(item => item.product.prescriptionRequired);
  const hasPrescriptionItems = prescriptionItems.length > 0;
  const prescriptionItemNames = prescriptionItems.map(item => item.product.name);

  return {
    items: validatedItems,
    totalQuantity,
    subtotal,
    deliveryCharge,
    finalTotal,
    hasPrescriptionItems,
    prescriptionItemNames,
  };
}

export function addItemToCart(currentItems: CartItem[], product: Product, quantity = 1): CartItem[] {
  if (quantity < MIN_QUANTITY_PER_ITEM) return currentItems;

  const existingIndex = currentItems.findIndex(i => i.product.id === product.id);
  if (existingIndex > -1) {
    const updated = [...currentItems];
    const newQty = Math.min(updated[existingIndex].quantity + quantity, MAX_QUANTITY_PER_ITEM);
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: newQty,
      subtotal: calculateLineTotal(updated[existingIndex].unitPrice, newQty),
    };
    return updated;
  }

  const initialQty = Math.min(quantity, MAX_QUANTITY_PER_ITEM);
  const newItem: CartItem = {
    id: product.id,
    product,
    quantity: initialQty,
    unitPrice: product.price,
    subtotal: calculateLineTotal(product.price, initialQty),
  };

  return [...currentItems, newItem];
}

export function updateItemQuantity(currentItems: CartItem[], productId: string, quantity: number): CartItem[] {
  if (quantity < MIN_QUANTITY_PER_ITEM) {
    return removeItemFromCart(currentItems, productId);
  }

  const targetQty = Math.min(quantity, MAX_QUANTITY_PER_ITEM);
  return currentItems.map(item => {
    if (item.product.id === productId) {
      return {
        ...item,
        quantity: targetQty,
        subtotal: calculateLineTotal(item.unitPrice, targetQty),
      };
    }
    return item;
  });
}

export function removeItemFromCart(currentItems: CartItem[], productId: string): CartItem[] {
  return currentItems.filter(item => item.product.id !== productId);
}

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: CartItem[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    // Validate each item exists in catalog
    return parsed
      .map(item => {
        const product = getProductById(item.product?.id);
        if (!product) return null;
        const qty = Math.max(MIN_QUANTITY_PER_ITEM, Math.min(item.quantity, MAX_QUANTITY_PER_ITEM));
        return {
          id: product.id,
          product,
          quantity: qty,
          unitPrice: product.price,
          subtotal: calculateLineTotal(product.price, qty),
        };
      })
      .filter((item): item is CartItem => item !== null);
  } catch (e) {
    console.error('Failed to parse cart from localStorage:', e);
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to persist cart to localStorage:', e);
  }
}
