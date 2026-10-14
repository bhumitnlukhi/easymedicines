'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Product } from '@/types/product';
import { CartItem, CartSummary } from '@/types/order';
import {
  addItemToCart,
  getCartSummary,
  loadCartFromStorage,
  removeItemFromCart,
  saveCartToStorage,
  updateItemQuantity,
} from '@/lib/cart';

interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  isLoaded: boolean;
  toastMessage: string | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize cart from localStorage on client mount
  useEffect(() => {
    const stored = loadCartFromStorage();
    setItems(stored);
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever items change (after initial mount)
  useEffect(() => {
    if (isLoaded) {
      saveCartToStorage(items);
    }
  }, [items, isLoaded]);

  const summary = useMemo(() => getCartSummary(items), [items]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const updated = addItemToCart(prev, product, quantity);
      return updated;
    });
    showToast(`Added ${product.name} to your cart.`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prev => updateItemQuantity(prev, productId, quantity));
  };

  const removeItem = (productId: string) => {
    setItems(prev => {
      const toRemove = prev.find(i => i.product.id === productId);
      if (toRemove) {
        showToast(`Removed ${toRemove.product.name} from your cart.`);
      }
      return removeItemFromCart(prev, productId);
    });
  };

  const clearCart = () => {
    setItems([]);
    showToast('Your cart has been cleared.');
  };

  const dismissToast = () => setToastMessage(null);

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isLoaded,
        toastMessage,
        dismissToast,
      }}
    >
      {children}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-text-main text-white px-5 py-3 rounded-xl shadow-xl transition-all duration-300 animate-slide-up"
        >
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button
            onClick={dismissToast}
            className="ml-2 text-text-subtle hover:text-white transition-colors text-xs"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
