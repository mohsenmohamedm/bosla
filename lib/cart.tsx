'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem, Product } from './types';

interface CartContextValue {
  items: CartItem[];
  /** إجمالي عدد القطع (لعدّاد الهيدر) */
  totalCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * حالة السلة. متغلفة في layout.tsx فتتاح لكل الصفحة.
 * ملاحظة: الحالة في الذاكرة بس — لو عايز تفضل بعد الريفرش، ضيف localStorage هنا.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((previous) => {
      const existing = previous.find((item) => item.product.id === product.id);
      if (existing) {
        return previous.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...previous, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((previous) =>
      previous.filter((item) => item.product.id !== productId),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, totalCount, addItem, removeItem, clear }),
    [items, totalCount, addItem, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart لازم يتستخدم جوه <CartProvider>.');
  }
  return context;
}
