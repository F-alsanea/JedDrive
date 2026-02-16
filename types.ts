
export type Role = 'admin' | 'user' | 'provider';

export interface ProviderService {
  id: string;
  name: string;
  price: number;
}

export interface Provider {
  id: string;
  user_id: string;
  business_name: string;
  service_type: 'Tow' | 'Wash' | 'Repair' | 'Tinting';
  city: string;
  status: 'pending' | 'active' | 'blocked' | 'offline';
  is_online: boolean;
  rating: number;
  debt_balance: number;
  credit_limit: number;
  cr_number?: string;
  lat?: number;
  lng?: number;
  google_maps_url?: string;
  image_url: string;
  is_featured?: boolean;
  services_list: ProviderService[];
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
  is_premium: boolean;
  wallet_balance: number;
  lat?: number;
  lng?: number;
  address?: string;
}

export interface Service {
  id: string;
  name: string;
  category: 'Tow' | 'Wash' | 'Repair' | 'Tinting';
  base_price: number;
  icon: string;
}

export interface Order {
  id: string;
  user_id: string;
  provider_id: string | null;
  service_id: string; // Keep for backward compatibility or primary service
  service_name: string;
  services: ProviderService[]; // Support for multiple services
  status: 'pending' | 'accepted' | 'in_route' | 'started' | 'completed' | 'cancelled';
  location_gps: { lat: number; lng: number; address: string };
  total_price: number;
  unique_otp: string;
  created_at: string;
  commission: number;
  payment_method: 'bank' | 'center' | 'cash' | 'online' | 'wallet';
  order_type: 'Stationary' | 'Mobile';
  review?: Review;
  offline_sync_pending?: boolean;
}

export interface Review {
  rating: number;
  comment: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_value: number;
  type: 'fixed' | 'percent';
  is_active: boolean;
  expiry_date: string;
  max_uses: number;
  current_uses: number;
}

export type Theme = 'light' | 'dark' | 'luxury';
export type Language = 'ar' | 'en';
