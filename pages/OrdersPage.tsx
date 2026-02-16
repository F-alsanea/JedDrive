
import React, { useState } from 'react';
import { useStore } from '../store';
import { translations } from '../translations';
import { CheckCircle, Clock, Package, ChevronRight, MapPin, Star } from 'lucide-react';

const OrdersPage: React.FC = () => {
    const { language, orders, user } = useStore();
    const t = translations[language];
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    const userOrders = orders.filter(o => o.user_id === user?.id);
    const filteredOrders = userOrders.filter(o => {
        if (filter === 'active') return ['pending', 'accepted', 'in_route', 'started'].includes(o.status);
        if (filter === 'completed') return o.status === 'completed';
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-50';
            case 'cancelled': return 'text-red-600 bg-red-50';
            default: return 'text-blue-600 bg-blue-50';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                    <Package className="text-blue-600" />
                    {t.orders}
                </h2>
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                    {(['all', 'active', 'completed'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${filter === f ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'opacity-40'}`}
                        >
                            {f === 'all' ? (language === 'ar' ? 'الكل' : 'All') : f === 'active' ? (language === 'ar' ? 'القائمة' : 'Active') : (language === 'ar' ? 'السابقة' : 'Past')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-[40px] border shadow-sm flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-300">
                            <Package size={32} />
                        </div>
                        <p className="opacity-30 font-black">{language === 'ar' ? 'لا توجد طلبات حالياً' : 'No orders found'}</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-slate-800 p-6 rounded-[30px] border shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getStatusColor(order.status)}`}>
                                        {order.status === 'completed' ? <CheckCircle /> : <Clock className="animate-pulse" />}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg leading-tight">{order.service_name}</h4>
                                        <p className="text-xs opacity-50 font-bold">{new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                    {language === 'ar' ? (order.status === 'completed' ? 'مكتمل' : 'تحت التنفيذ') : order.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50 dark:border-slate-700/50">
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-slate-400" />
                                    <span className="text-[10px] font-bold opacity-60 truncate">{order.location_gps.address}</span>
                                </div>
                                <div className="text-left font-black text-blue-600 text-lg">
                                    {order.total_price} {t.sar}
                                </div>
                            </div>

                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-10 group-hover:translate-x-1 transition-all" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
