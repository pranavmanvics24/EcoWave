import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './api';

export interface CartItem extends Product {
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
    count: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === product.id);
                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...items, { ...product, quantity: 1 }] });
                }
            },
            removeItem: (productId) =>
                set({ items: get().items.filter((item) => item.id !== productId) }),
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            total: () =>
                get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
            count: () =>
                get().items.reduce((acc, item) => acc + item.quantity, 0),
        }),
        {
            name: 'cart-storage',
        }
    )
);

interface AuthStore {
    isAuthenticated: boolean;
    user: { name: string; email: string } | null;
    login: (user: { name: string; email: string }) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            login: (user) => set({ isAuthenticated: true, user }),
            logout: () => set({ isAuthenticated: false, user: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
