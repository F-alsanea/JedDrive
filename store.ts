
import { create } from 'zustand';
import { User, Provider, Order, Coupon, Theme, Language, Review, ProviderService } from './types';
import { MOCK_USER, MOCK_PROVIDERS, MOCK_COUPONS } from './constants';

interface AppState {
  user: User | null;
  providers: Provider[];
  orders: Order[];
  coupons: Coupon[];
  theme: Theme;
  language: Language;

  setUser: (user: User | null) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  updateProvider: (id: string, updates: Partial<Provider>) => void;
  addProvider: (provider: Provider) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCoupon: (id: string) => void;
  toggleOfflineMode: (providerId: string) => void;
  syncOfflineOrders: () => void;
  submitReview: (orderId: string, review: Review) => void;
}

export const useStore = create<AppState>((set) => ({
  user: MOCK_USER,
  providers: MOCK_PROVIDERS,
  orders: [],
  coupons: MOCK_COUPONS,
  theme: 'light',
  language: 'ar',
  bannerUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000',
  scrollingTicker: 'أهلاً بكم في JedDrive - أفضل خدمات السيارات في جدة متوفرة الآن بين يديك! متميزون في السطحات والغسيل والتلميع.',
  notifications: [],

  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  setBannerUrl: (bannerUrl) => set({ bannerUrl }),
  setScrollingTicker: (scrollingTicker) => set({ scrollingTicker }),
  addNotification: (title, body) => set((state) => ({
    notifications: [{ id: Date.now(), title, body, status: 'unread', created_at: new Date().toISOString() }, ...state.notifications]
  })),
  updateProvider: (id, updates) => set((state) => ({
    providers: state.providers.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  addProvider: (provider) => set((state) => ({
    providers: [...state.providers, provider]
  })),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrder: (id, updates) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, ...updates } : o)
  })),
  addCoupon: (coupon) => set((state) => ({ coupons: [...state.coupons, coupon] })),
  toggleCoupon: (id) => set((state) => ({
    coupons: state.coupons.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c)
  })),
  toggleOfflineMode: (id) => set((state) => ({
    providers: state.providers.map(p => p.id === id ? { ...p, status: p.status === 'offline' ? 'active' : 'offline' } : p)
  })),
  syncOfflineOrders: () => set((state) => ({
    orders: state.orders.map(o => o.offline_sync_pending ? { ...o, offline_sync_pending: false } : o)
  })),
  submitReview: (orderId, review) => set((state) => ({
    orders: state.orders.map(o => o.id === orderId ? { ...o, review, status: 'completed' } : o)
  })),
}));
