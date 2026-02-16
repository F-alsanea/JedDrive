
import React, { useState } from 'react';
import { useStore } from '../store';
import { translations } from '../translations';
import { Truck, MapPin, CheckCircle, Smartphone, AlertCircle, History as HistoryIcon, Wallet, Phone, Navigation, Zap } from 'lucide-react';

const ProviderDashboard: React.FC = () => {
  const { language, providers, user, updateProvider, orders: allOrders, updateOrder, toggleOfflineMode, syncOfflineOrders } = useStore();
  const t = translations[language];

  const provider = providers.find(p => p.user_id === user?.id) || providers[0];
  const isBlocked = provider.debt_balance >= provider.credit_limit;
  const isOffline = provider.status === 'offline';
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'wallet'>('current');

  const providerOrders = allOrders.filter(o => o.provider_id === provider.id);
  const [otpInput, setOtpInput] = useState('');

  const handleCompleteOrder = (orderId: string, correctOtp: string) => {
    if (otpInput.trim().toUpperCase() === correctOtp.trim().toUpperCase()) {
      if (isOffline) {
        // Offline Logic: Mark as completed but pending sync
        updateOrder(orderId, { status: 'completed', offline_sync_pending: true });
        alert(language === 'ar' ? 'تم التوثيق محلياً (وضع الأوفلاين)، سيتم المزامنة فور العودة للشبكة.' : 'Verified locally (Offline), sync pending.');
      } else {
        updateOrder(orderId, { status: 'completed' });
        updateProvider(provider.id, { debt_balance: provider.debt_balance + 20 }); // Increased commission for multi-services mockup
      }
      setOtpInput('');
    } else {
      alert(language === 'ar' ? 'عذراً، الكود المدخل غير مطابق لكود العميل' : 'OTP verification failed');
    }
  };

  const handleToggleOnline = () => {
    if (isOffline) {
      toggleOfflineMode(provider.id);
      syncOfflineOrders();
      alert(language === 'ar' ? 'تمت العودة للاتصال ومزامنة الطلبات.' : 'Back online and orders synced.');
    } else {
      updateProvider(provider.id, { is_online: !provider.is_online });
    }
  };

  if (isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 animate-pulse border-4 border-red-200">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-4xl font-black">{t.blocked}</h2>
        <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-200 max-w-lg shadow-2xl">
          <p className="text-red-700 font-bold text-lg mb-2">
            {language === 'ar'
              ? `مديونيتك الحالية (${provider.debt_balance} ر.س) تجاوزت الحد المسموح به.`
              : `Your debt (${provider.debt_balance} SAR) exceeds limit.`}
          </p>
          <p className="text-sm opacity-60 font-bold leading-relaxed">{language === 'ar' ? 'يرجى التوجه لسداد العمولات المستحقة لتتمكن من العودة لاستقبال الطلبات مرة أخرى.' : 'Please settle your commissions to resume receiving orders.'}</p>
        </div>
        <button className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-xl shadow-blue-500/30">
          {language === 'ar' ? 'سداد العمولات' : 'Pay Commissions'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header with Status Toggle */}
      <div className={`flex flex-col md:flex-row justify-between items-start gap-4 p-8 rounded-3xl shadow-xl border transition-colors ${isOffline ? 'bg-slate-100 border-slate-300 opacity-80' : 'bg-white dark:bg-slate-800'}`}>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-3xl overflow-hidden shadow-inner ring-4 ring-blue-50">
            {provider.image_url ? <img src={provider.image_url} className="w-full h-full object-cover" /> : provider.business_name?.[0]}
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter">{provider.business_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-3 h-3 rounded-full ${isOffline ? 'bg-orange-500' : provider.is_online ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span className="text-xs font-black opacity-50 uppercase tracking-widest">{isOffline ? (t.ar ? 'وضع غير متصل' : 'Offline Mode') : provider.is_online ? t.online : t.offline}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toggleOfflineMode(provider.id)}
            className={`px-6 py-4 rounded-2xl font-black text-xs transition-all ${isOffline ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 opacity-50'}`}
          >
            {t.ar ? 'الوضع غير المتصل' : 'Offline Mode'}
          </button>
          <button
            onClick={handleToggleOnline}
            className={`px-10 py-4 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-95 ${isOffline ? 'bg-green-600 text-white' :
                provider.is_online ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' : 'bg-green-600 text-white shadow-green-500/20 hover:bg-green-700'
              }`}
          >
            {isOffline ? (t.ar ? 'اتصال بالمزامنة' : 'Sync & Connect') : provider.is_online ? language === 'ar' ? 'الخروج من النظام' : 'Go Offline' : language === 'ar' ? 'تفعيل الاستقبال' : 'Go Online'}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {[
          { id: 'current', label: language === 'ar' ? 'الطلبات النشطة' : 'Active Orders', icon: <Truck size={18} /> },
          { id: 'history', label: t.history, icon: <HistoryIcon size={18} /> },
          { id: 'wallet', label: t.wallet, icon: <Wallet size={18} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-white dark:bg-slate-800 border hover:bg-slate-50'
              }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'current' && (
        <div className="space-y-6">
          {providerOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length === 0 ? (
            <div className="py-32 text-center opacity-20 flex flex-col items-center">
              <Zap size={64} className="mb-4" />
              <p className="font-black text-2xl tracking-tighter">{language === 'ar' ? 'لا يوجد طلبات نشطة حالياً' : 'Searching for orders...'}</p>
            </div>
          ) : (
            providerOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').map(order => (
              <div key={order.id} className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border-l-[12px] border-blue-600 animate-in slide-in-from-right-10 duration-500">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-5">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-50">
                      <Zap />
                    </div>
                    <div>
                      <p className="font-black text-2xl tracking-tight">{order.service_name}</p>
                      <p className="text-sm opacity-60 flex items-center gap-1 font-bold"><MapPin size={14} /> {order.location_gps.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-3xl text-blue-600 leading-none">{order.total_price} {t.sar}</p>
                    <div className="flex items-center gap-1 justify-end text-[10px] text-amber-600 font-black uppercase mt-2 tracking-widest">
                      {order.order_type === 'Mobile' ? t.mobileService : t.stationaryService}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border-2 border-dashed border-slate-200 shadow-inner">
                    <p className="text-[10px] mb-4 font-black flex items-center gap-2 uppercase opacity-60 tracking-widest text-blue-600"><Smartphone size={16} /> {t.otpLabel}</p>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="JD-XXXXXX"
                        className="flex-1 p-5 rounded-2xl border-2 dark:bg-slate-800 text-center font-black text-2xl tracking-tighter uppercase focus:ring-4 ring-blue-500 outline-none shadow-sm transition-all"
                        value={otpInput}
                        onChange={e => setOtpInput(e.target.value)}
                      />
                      <button
                        onClick={() => handleCompleteOrder(order.id, order.unique_otp)}
                        className="bg-green-600 text-white px-10 rounded-2xl font-black text-lg hover:bg-green-700 shadow-xl shadow-green-500/20 active:scale-95 transition-all"
                      >
                        {t.completeOrder}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 h-full">
                      <button className="flex-1 flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-700 py-5 rounded-3xl font-black hover:bg-slate-200 transition-colors shadow-sm">
                        <Phone size={20} /> {t.call}
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-700 py-5 rounded-3xl font-black hover:bg-slate-200 transition-colors shadow-sm">
                        <Navigation size={20} /> {t.viewOnMap}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in duration-300">
          <div className="bg-gradient-to-br from-blue-600 to-blue-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-10 -mt-10 rounded-full"></div>
            <p className="opacity-70 font-black mb-2 uppercase tracking-widest text-xs">{t.totalIncome}</p>
            <h3 className="text-6xl font-black mb-10 tracking-tighter">4,280 ر.س</h3>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
              <p className="text-xs font-bold opacity-80 mb-1">{language === 'ar' ? 'الرصيد القادم' : 'Upcoming'}</p>
              <p className="text-2xl font-black">1,150 ر.س</p>
            </div>
          </div>

          <div className={`p-10 rounded-[40px] border shadow-xl flex flex-col justify-between transition-colors ${provider.debt_balance > 400 ? 'bg-red-50/50 border-red-100' : 'bg-white dark:bg-slate-800'}`}>
            <div>
              <p className="opacity-50 font-black mb-2 uppercase tracking-widest text-xs">{t.currentDebt}</p>
              <h3 className={`text-6xl font-black tracking-tighter ${provider.debt_balance > 400 ? 'text-red-600' : 'text-slate-800 dark:text-white'}`}>
                {provider.debt_balance} ر.س
              </h3>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-[10px] font-black opacity-40 uppercase tracking-widest">
                <span>{t.debtLimit}</span>
                <span>{provider.credit_limit} {t.sar}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-4 rounded-full overflow-hidden shadow-inner">
                <div className={`h-full transition-all duration-1000 ${provider.debt_balance > 400 ? 'bg-red-500 animate-pulse' : 'bg-blue-600'}`} style={{ width: `${(provider.debt_balance / provider.credit_limit) * 100}%` }}></div>
              </div>
              <button className="w-full bg-slate-100 dark:bg-slate-700 py-4 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all">
                {language === 'ar' ? 'طرق سداد المديونية' : 'How to pay?'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border overflow-hidden">
          {providerOrders.filter(o => o.status === 'completed').length === 0 ? (
            <div className="py-32 text-center opacity-30 font-black">{language === 'ar' ? 'سجل الطلبات فارغ' : 'No history yet'}</div>
          ) : (
            <div className="divide-y divide-slate-50 dark:divide-slate-700">
              {providerOrders.filter(o => o.status === 'completed').map(order => (
                <div key={order.id} className="p-8 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <p className="font-black text-lg">{order.service_name}</p>
                      <p className="text-xs opacity-50 font-bold">{new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-xl text-blue-600">{order.total_price} {t.sar}</p>
                    <p className="text-[10px] opacity-40 font-black uppercase mt-1">#ID-{order.id.substr(0, 5)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
