
import React from 'react';
import { 
  Truck, 
  Droplets, 
  Wrench, 
  Sparkles, 
  LayoutDashboard, 
  Users, 
  Settings, 
  CreditCard,
  Ticket,
  AlertTriangle
} from 'lucide-react';
import { Service, User, Provider, Order, Coupon } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Faisal Admin',
  phone: '0501234567',
  email: 'faisal@jeddrive.com',
  role: 'admin',
  is_premium: true,
  wallet_balance: 1500,
};

export const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Towing', category: 'Tow', base_price: 150, icon: 'Truck' },
  { id: 's2', name: 'Wash', category: 'Wash', base_price: 60, icon: 'Droplets' },
  { id: 's3', name: 'Repair', category: 'Repair', base_price: 300, icon: 'Wrench' },
  { id: 's4', name: 'Tinting', category: 'Tinting', base_price: 200, icon: 'Sparkles' },
];

export const MOCK_PROVIDERS: Provider[] = [
  { 
    id: 'p1', 
    user_id: 'up1', 
    business_name: 'Fast Towing Jeddah', 
    service_type: 'Tow', 
    city: 'Jeddah', 
    status: 'active', 
    is_online: true, 
    rating: 4.8, 
    debt_balance: 120, 
    credit_limit: 500,
    lat: 21.5433,
    lng: 39.1728,
    image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=300',
    services_list: [{ id: 'ps1', name: 'Normal Tow', price: 150 }, { id: 'ps2', name: 'Hydraulic Tow', price: 250 }]
  },
  { 
    id: 'p2', 
    user_id: 'up2', 
    business_name: 'Sparkle Auto Spa', 
    service_type: 'Wash', 
    city: 'Jeddah', 
    status: 'active', 
    is_online: true, 
    rating: 4.5, 
    debt_balance: 550, 
    credit_limit: 500,
    lat: 21.6167,
    lng: 39.1500,
    image_url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?auto=format&fit=crop&q=80&w=300',
    services_list: [{ id: 'ps3', name: 'Internal Wash', price: 60 }, { id: 'ps4', name: 'Polishing', price: 400 }]
  },
  { 
    id: 'p3', 
    user_id: 'up3', 
    business_name: 'Master Mechanics', 
    service_type: 'Repair', 
    city: 'Jeddah', 
    status: 'pending', 
    is_online: false, 
    rating: 0, 
    debt_balance: 0, 
    credit_limit: 500,
    lat: 21.4858,
    lng: 39.1925,
    image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=300',
    services_list: [{ id: 'ps5', name: 'Oil Change', price: 120 }, { id: 'ps6', name: 'Engine Diagnostic', price: 200 }]
  },
];

export const MOCK_COUPONS: Coupon[] = [
  { id: 'c1', code: 'JED20', discount_value: 20, type: 'percent', is_active: true, expiry_date: '2025-12-31', max_uses: 100, current_uses: 45 },
  { id: 'c2', code: 'FIRST50', discount_value: 50, type: 'fixed', is_active: false, expiry_date: '2024-01-01', max_uses: 50, current_uses: 50 },
];

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Tow: <Truck className="w-8 h-8" />,
  Wash: <Droplets className="w-8 h-8" />,
  Repair: <Wrench className="w-8 h-8" />,
  Tinting: <Sparkles className="w-8 h-8" />,
};

export const generateUniqueOTP = () => {
  return 'JD-' + Math.random().toString(36).substr(2, 6).toUpperCase();
};
