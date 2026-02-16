
import { create } from 'zustand';
import { User, Provider, Order, Coupon, Theme, Language, Review, ProviderService, ProviderRequest } from './types';
import { MOCK_USER, MOCK_PROVIDERS, MOCK_COUPONS } from './constants';

interface AppState {
  user: User | null;
  users: User[];
  providers: Provider[];
  orders: Order[];
  coupons: Coupon[];
  theme: Theme;
  language: Language;
  bannerUrl: string;
  scrollingTicker: string;
  notifications: any[];

  setUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  signUp: (user: User) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  setBannerUrl: (url: string) => void;
  setScrollingTicker: (text: string) => void;
  addNotification: (title: string, body: string) => void;
  updateProvider: (id: string, updates: Partial<Provider>) => void;
  addProvider: (provider: Provider) => void;
  deleteProvider: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCoupon: (id: string) => void;
  toggleOfflineMode: (providerId: string) => void;
  syncOfflineOrders: () => void;
  submitReview: (orderId: string, review: Review) => void;
  updateUser: (updates: Partial<User>) => void;
  updateExistingServicePrice: (providerId: string, serviceId: string, newPrice: number) => void;
  providerRequests: ProviderRequest[];
  submitProviderRequest: (request: ProviderRequest) => void;
}

const getLocalStorage = (key: string) => JSON.parse(localStorage.getItem(key) || 'null');
const setLocalStorage = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value));

export const useStore = create<AppState>((set) => ({
  user: getLocalStorage('jeddrive_user'),
  users: getLocalStorage('jeddrive_users') || [MOCK_USER],
  providers: getLocalStorage('jeddrive_providers') || MOCK_PROVIDERS,
  orders: getLocalStorage('jeddrive_orders') || [],
  coupons: getLocalStorage('jeddrive_coupons') || MOCK_COUPONS,
  theme: (localStorage.getItem('jeddrive_theme') as Theme) || 'luxury',
  language: (localStorage.getItem('jeddrive_language') as Language) || 'ar',
  bannerUrl: localStorage.getItem('jeddrive_banner') || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000',
  scrollingTicker: localStorage.getItem('jeddrive_ticker') || 'أهلاً بكم في JedDrive - أفضل خدمات السيارات في جدة متوفرة الآن بين يديك! متميزون في السطحات والغسيل والتلميع.',
  notifications: getLocalStorage('jeddrive_notifications') || [],
  providerRequests: getLocalStorage('jeddrive_provider_requests') || [],

  setUser: (user) => {
    set({ user });
    setLocalStorage('jeddrive_user', user);
  },
  setUsers: (users) => {
    set({ users });
    setLocalStorage('jeddrive_users', users);
  },
  signUp: (user) => set((state) => {
    const newUsers = [...state.users, user];
    setLocalStorage('jeddrive_users', newUsers);
    return { users: newUsers };
  }),
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('jeddrive_theme', theme);
  },
  setLanguage: (language) => {
    set({ language });
    localStorage.setItem('jeddrive_language', language);
  },
  setBannerUrl: (bannerUrl) => {
    set({ bannerUrl });
    localStorage.setItem('jeddrive_banner', bannerUrl);
  },
  setScrollingTicker: (scrollingTicker) => {
    set({ scrollingTicker });
    localStorage.setItem('jeddrive_ticker', scrollingTicker);
  },
  addNotification: (title, body) => set((state) => {
    const newNotifs = [{ id: Date.now(), title, body, status: 'unread', created_at: new Date().toISOString() }, ...state.notifications];
    setLocalStorage('jeddrive_notifications', newNotifs);
    return { notifications: newNotifs };
  }),
  updateProvider: (id, updates) => set((state) => {
    const newProviders = state.providers.map(p => p.id === id ? { ...p, ...updates } : p);
    setLocalStorage('jeddrive_providers', newProviders);
    return { providers: newProviders };
  }),
  addProvider: (provider) => set((state) => {
    const newProviders = [...state.providers, provider];
    setLocalStorage('jeddrive_providers', newProviders);
    return { providers: newProviders };
  }),
  deleteProvider: (id) => set((state) => {
    const newProviders = state.providers.filter(p => p.id !== id);
    setLocalStorage('jeddrive_providers', newProviders);
    return { providers: newProviders };
  }),
  addOrder: (order) => set((state) => {
    const newOrders = [order, ...state.orders];
    setLocalStorage('jeddrive_orders', newOrders);
    return { orders: newOrders };
  }),
  updateOrder: (id, updates) => set((state) => {
    const newOrders = state.orders.map(o => o.id === id ? { ...o, ...updates } : o);
    setLocalStorage('jeddrive_orders', newOrders);
    return { orders: newOrders };
  }),
  addCoupon: (coupon) => set((state) => {
    const newCoupons = [...state.coupons, coupon];
    setLocalStorage('jeddrive_coupons', newCoupons);
    return { coupons: newCoupons };
  }),
  toggleCoupon: (id) => set((state) => {
    const newCoupons = state.coupons.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c);
    setLocalStorage('jeddrive_coupons', newCoupons);
    return { coupons: newCoupons };
  }),
  toggleOfflineMode: (id) => set((state) => {
    const newProviders = state.providers.map(p => p.id === id ? { ...p, status: p.status === 'offline' ? 'active' : 'offline' } : p);
    setLocalStorage('jeddrive_providers', newProviders);
    return { providers: newProviders };
  }),
  syncOfflineOrders: () => set((state) => ({
    orders: state.orders.map(o => o.offline_sync_pending ? { ...o, offline_sync_pending: false } : o)
  })),
  submitReview: (orderId: string, review: Review) => set((state) => ({
    orders: state.orders.map(o => o.id === orderId ? { ...o, review, status: 'completed' } : o)
  })),
  updateUser: (updates) => set((state) => {
    if (!state.user) return state;
    const updatedUser = { ...state.user, ...updates };
    setLocalStorage('jeddrive_user', updatedUser);
    return { user: updatedUser };
  }),
  updateExistingServicePrice: (providerId, serviceId, newPrice) => set((state) => {
    const newProviders = state.providers.map(p => {
      if (p.id !== providerId) return p;
      return {
        ...p,
        services_list: p.services_list.map(s => s.id === serviceId ? { ...s, price: newPrice } : s)
      };
    });
    setLocalStorage('jeddrive_providers', newProviders);
    return { providers: newProviders };
  }),
  submitProviderRequest: (request) => set((state) => {
    const newRequests = [request, ...state.providerRequests];
    setLocalStorage('jeddrive_provider_requests', newRequests);
    return { providerRequests: newRequests };
  }),
}));
