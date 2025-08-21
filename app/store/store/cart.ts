import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { Cart, CartItem, CartStorage, CartItemStorage } from '../types/cart';
import { IPremiumApp } from '@/types/premium-app';
import { getCurrentPrice } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { cartItemsByIdsQuery, validateCartItemsQuery } from '@/sanity/lib/queries';

interface CartStore extends Cart {
  isLoading: boolean;
  addItem: (product: IPremiumApp) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  validateAndRefreshPrices: () => Promise<void>;
  recalculateTotal: () => void;
  loadCartItems: () => Promise<void>;
  validateCartItems: () => Promise<string[]>; // Returns array of invalid item IDs
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      isLoading: false,
      addItem: (product: IPremiumApp) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.productId === product._id
        );

        // For software purchases, don't allow duplicates
        if (existingItem) {
          return; // Item already in cart, do nothing
        }

        set({
          items: [
            ...currentItems,
            { productId: product._id, quantity: 1, product },
          ],
          total: get().total + getCurrentPrice(product),
        });
      },
      removeItem: (productId: string) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find(
          (item) => item.productId === productId
        );

        if (itemToRemove) {
          set({
            items: currentItems.filter((item) => item.productId !== productId),
            total: get().total - getCurrentPrice(itemToRemove.product),
          });
        }
      },
      clearCart: () => {
        set({ items: [], total: 0 });
      },

      recalculateTotal: () => {
        const currentItems = get().items;
        const newTotal = currentItems.reduce(
          (sum, item) => sum + getCurrentPrice(item.product),
          0
        );
        set({ total: newTotal });
      },
      loadCartItems: async () => {
        const currentItems = get().items;
        if (currentItems.length === 0) return;

        set({ isLoading: true });
        try {
          const productIds = currentItems.map(item => item.productId);
          const products = await client.fetch(cartItemsByIdsQuery, { ids: productIds });
          
          // Update items with fresh product data
          const updatedItems = currentItems
            .map(item => {
              const product = products.find((p: IPremiumApp) => p._id === item.productId);
              return product ? { 
                ...item, 
                product,
                quantity: item.quantity || 1 // Ensure quantity is always set
              } : null;
            })
            .filter(Boolean) as CartItem[];

          // Recalculate total with current prices
          const newTotal = updatedItems.reduce(
            (sum, item) => sum + getCurrentPrice(item.product),
            0
          );

          set({ items: updatedItems, total: newTotal });
        } catch (error) {
          console.error('Error loading cart items:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      validateCartItems: async () => {
        const currentItems = get().items;
        if (currentItems.length === 0) return [];

        try {
          const productIds = currentItems.map(item => item.productId);
          const validationResults = await client.fetch(validateCartItemsQuery, { ids: productIds });
          
          const invalidIds = productIds.filter(id => {
            const result = validationResults.find((r: any) => r._id === id);
            return !result || !result.isPublished;
          });

          // Remove invalid items from cart
          if (invalidIds.length > 0) {
            const validItems = currentItems.filter(item => !invalidIds.includes(item.productId));
            const newTotal = validItems.reduce(
              (sum, item) => sum + getCurrentPrice(item.product),
              0
            );
            set({ items: validItems, total: newTotal });
          }

          return invalidIds;
        } catch (error) {
          console.error('Error validating cart items:', error);
          return [];
        }
      },
      validateAndRefreshPrices: async () => {
        await get().loadCartItems();
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items.map(item => ({
          productId: item.productId
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure all items have quantity set to 1 after rehydration
          const itemsWithQuantity = state.items.map(item => ({
            ...item,
            quantity: 1, // Default quantity for software purchases
            product: null as any // Will be loaded by loadCartItems
          })) as CartItem[];
          
          // Update state with proper quantities
          useCartStore.setState({ items: itemsWithQuantity });
          
          // Load cart items after rehydration
          setTimeout(() => {
            useCartStore.getState().loadCartItems();
          }, 0);
        }
      }
    }
  )
);
