import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '../types/cart';
import { IPremiumApp } from '@/types/premium-app';

interface CartStore extends Cart {
  addItem: (product: IPremiumApp) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (product: IPremiumApp) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.productId === product._id
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.productId === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            total: get().total + product.price,
          });
        } else {
          set({
            items: [
              ...currentItems,
              { productId: product._id, quantity: 1, product },
            ],
            total: get().total + product.price,
          });
        }
      },
      removeItem: (productId: string) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find(
          (item) => item.productId === productId
        );

        if (itemToRemove) {
          set({
            items: currentItems.filter((item) => item.productId !== productId),
            total:
              get().total - itemToRemove.product.price * itemToRemove.quantity,
          });
        }
      },
      clearCart: () => {
        set({ items: [], total: 0 });
      },
      updateQuantity: (productId: string, quantity: number) => {
        const currentItems = get().items;
        const itemToUpdate = currentItems.find(
          (item) => item.productId === productId
        );

        if (itemToUpdate) {
          const quantityDiff = quantity - itemToUpdate.quantity;
          set({
            items: currentItems.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
            total: get().total + itemToUpdate.product.price * quantityDiff,
          });
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
