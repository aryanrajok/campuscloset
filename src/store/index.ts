import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Product, FilterState, Notification, ChatRoom, UserRole } from '@/types';

// ============================================
// Auth Store
// ============================================
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setRole: (role: UserRole) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
    setRole: (role) =>
        set((state) => ({
            user: state.user ? { ...state.user, role } : null,
        })),
    logout: () => set({ user: null, isAuthenticated: false }),
}));

// ============================================
// Product Store (Marketplace) — with localStorage persistence
// ============================================
interface ProductState {
    products: Product[];
    userListings: Product[];
    filteredProducts: Product[];
    filters: FilterState;
    isLoading: boolean;
    selectedProduct: Product | null;
    hasHydrated: boolean;
    setProducts: (products: Product[]) => void;
    addProduct: (product: Product) => void;
    deleteProduct: (id: string) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    setFilters: (filters: Partial<FilterState>) => void;
    clearFilters: () => void;
    setSelectedProduct: (product: Product | null) => void;
    applyFilters: () => void;
}

export const useProductStore = create<ProductState>()(
    persist(
        (set, get) => ({
            products: [],
            userListings: [],
            filteredProducts: [],
            filters: {},
            isLoading: true,
            selectedProduct: null,
            hasHydrated: false,
            setProducts: (products) => set({ products, filteredProducts: products, isLoading: false }),
            addProduct: (product) => {
                set((state) => ({
                    products: [product, ...state.products],
                    filteredProducts: [product, ...state.filteredProducts],
                    userListings: [product, ...state.userListings],
                }));
            },
            deleteProduct: (id) => {
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id),
                    filteredProducts: state.filteredProducts.filter((p) => p.id !== id),
                    userListings: state.userListings.filter((p) => p.id !== id),
                }));
            },
            updateProduct: (id, updates) => {
                const updater = (p: Product) => p.id === id ? { ...p, ...updates } : p;
                set((state) => ({
                    products: state.products.map(updater),
                    filteredProducts: state.filteredProducts.map(updater),
                    userListings: state.userListings.map(updater),
                }));
            },
            setFilters: (newFilters) => {
                set((state) => ({ filters: { ...state.filters, ...newFilters } }));
                get().applyFilters();
            },
            clearFilters: () => {
                set({ filters: {} });
                get().applyFilters();
            },
            setSelectedProduct: (product) => set({ selectedProduct: product }),
            applyFilters: () => {
                const { products, filters } = get();
                let filtered = [...products];

                if (filters.search) {
                    const search = filters.search.toLowerCase();
                    filtered = filtered.filter(
                        (p) =>
                            p.title.toLowerCase().includes(search) ||
                            p.description.toLowerCase().includes(search) ||
                            p.brand?.toLowerCase().includes(search)
                    );
                }
                if (filters.category) {
                    filtered = filtered.filter((p) => p.category === filters.category);
                }
                if (filters.size) {
                    filtered = filtered.filter((p) => p.size === filters.size);
                }
                if (filters.color) {
                    filtered = filtered.filter((p) => p.color === filters.color);
                }
                if (filters.condition) {
                    filtered = filtered.filter((p) => p.condition === filters.condition);
                }
                if (filters.university) {
                    filtered = filtered.filter((p) => p.university === filters.university);
                }
                if (filters.priceMin !== undefined) {
                    filtered = filtered.filter((p) => p.sellingPrice >= filters.priceMin!);
                }
                if (filters.priceMax !== undefined) {
                    filtered = filtered.filter((p) => p.sellingPrice <= filters.priceMax!);
                }

                switch (filters.sortBy) {
                    case 'price-asc':
                        filtered.sort((a, b) => a.sellingPrice - b.sellingPrice);
                        break;
                    case 'price-desc':
                        filtered.sort((a, b) => b.sellingPrice - a.sellingPrice);
                        break;
                    case 'newest':
                        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                        break;
                    case 'best-condition':
                        const condOrder = { new: 0, 'like-new': 1, good: 2, used: 3 };
                        filtered.sort((a, b) => condOrder[a.condition] - condOrder[b.condition]);
                        break;
                }

                set({ filteredProducts: filtered });
            },
        }),
        {
            name: 'campuscloset-products',
            partialize: (state) => ({
                userListings: state.userListings,
            }),
            onRehydrateStorage: () => {
                return () => {
                    useProductStore.setState({ hasHydrated: true });
                };
            },
        }
    )
);

// ============================================
// Notification Store
// ============================================
interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    setNotifications: (notifications: Notification[]) => void;
    markAsRead: (id: string) => void;
    addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    setNotifications: (notifications) =>
        set({
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
        }),
    markAsRead: (id) =>
        set((state) => {
            const updated = state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            );
            return {
                notifications: updated,
                unreadCount: updated.filter((n) => !n.read).length,
            };
        }),
    addNotification: (notification) =>
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        })),
}));

// ============================================
// Chat Store
// ============================================
interface ChatState {
    chatRooms: ChatRoom[];
    activeChatRoom: ChatRoom | null;
    setChatRooms: (rooms: ChatRoom[]) => void;
    setActiveChatRoom: (room: ChatRoom | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    chatRooms: [],
    activeChatRoom: null,
    setChatRooms: (rooms) => set({ chatRooms: rooms }),
    setActiveChatRoom: (room) => set({ activeChatRoom: room }),
}));

// ============================================
// UI Store
// ============================================
interface UIState {
    sidebarOpen: boolean;
    mobileMenuOpen: boolean;
    theme: 'light' | 'dark';
    toggleSidebar: () => void;
    toggleMobileMenu: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
    sidebarOpen: true,
    mobileMenuOpen: false,
    theme: 'dark',
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
    setTheme: (theme) => set({ theme }),
}));
