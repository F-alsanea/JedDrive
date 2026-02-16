import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { translations } from '../translations';
import { MOCK_SERVICES, CATEGORY_ICONS } from '../constants';
import { MapPin, Search, ChevronRight, Zap, Star, X, Download, CheckCircle, Navigation } from 'lucide-react';
import { Provider } from '../types';

interface ProviderCardProps {
  p: Provider;
  selectedServices: Record<string, string[]>;
  toggleService: (providerId: string, serviceId: string) => void;
  handleBookNow: (p: Provider) => void;
  language: 'ar' | 'en';
  t: any;
}

const ProviderCard = React.memo<ProviderCardProps>(({ p, selectedServices, toggleService, handleBookNow, language, t }) => {
  return (
    <div className={`group relative overflow-hidden glass-card p-8 hover:scale-[1.03] active:scale-95 transition-all duration-500 border border-white/5 hover:border-[#FF4500]/30 shadow-2xl ${p.is_featured ? 'ring-2 ring-[#FF4500]/20' : ''}`}>
      {p.is_featured && (
        <div className="absolute top-0 right-0 p-4 z-10">
          <div className="bg-[#FF4500] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-lg shadow-orange-500/20">
            <Star size={10} fill="currentColor" /> {language === 'ar' ? 'مميز' : 'FEATURED'}
          </div>
        </div>
      )}
      <div className="flex gap-6 items-start">
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={p.image_url}
            loading="lazy"
            className="w-full h-full object-cover rounded-[2rem] shadow-2xl transition-transform group-hover:scale-110"
            alt={p.business_name}
          />
          <div className="absolute inset-0 rounded-[2rem] border border-white/10 group-hover:border-[#FF4500]/50 transition-colors"></div>
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-black flex items-center justify-center ${p.is_online ? 'bg-green-500' : 'bg-red-500'}`}>
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="font-black text-xl tracking-tighter leading-tight group-hover:text-[#FF4500] transition-colors">
              {p.business_name}
            </h4>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full backdrop-blur-md">
              <Star size={12} className="text-[#FF4500] fill-[#FF4500]" />
              <span className="text-[10px] font-black">{p.rating}</span>
            </div>
          </div>
          <p className="text-[10px] font-inter font-bold opacity-40 uppercase tracking-widest">{p.service_type === 'Tow' ? t.mobileService : t.stationaryService}</p>
          <div className="flex items-center gap-1 opacity-30">
            <MapPin size={10} />
            <span className="text-[9px] font-bold">{p.city}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-orbitron font-black text-dim uppercase tracking-[0.2em]">{t.servicePrice}</span>
          <span className="text-[10px] font-inter font-bold opacity-30">{language === 'ar' ? 'اختر الخدمة للطلب' : 'SELECT SERVICE'}</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {p.services_list.map((s) => (
            <button
              key={s.id}
              onClick={() => toggleService(p.id, s.id)}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between group/s ${selectedServices[p.id]?.includes(s.id)
                ? 'bg-[#FF4500] border-[#FF4500] shadow-[0_8px_20px_rgba(255,69,0,0.3)]'
                : 'bg-white/5 border-white/10 hover:border-[#FF4500]/50'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${selectedServices[p.id]?.includes(s.id) ? 'bg-white/20' : 'bg-white/5'}`}>
                  {selectedServices[p.id]?.includes(s.id) ? <CheckCircle size={14} className="text-white" /> : <Zap size={14} className="text-[#FF4500]" />}
                </div>
                <div className="text-start">
                  <p className={`text-xs font-black ${selectedServices[p.id]?.includes(s.id) ? 'text-white' : 'text-white/80'}`}>{s.name}</p>
                  <p className={`text-[9px] font-bold opacity-40 ${selectedServices[p.id]?.includes(s.id) ? 'text-white/60' : ''}`}>{s.price} {t.sar}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => handleBookNow(p)}
          disabled={!selectedServices[p.id] || selectedServices[p.id].length === 0}
          className={`w-full py-5 rounded-[2rem] font-orbitron font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 ${selectedServices[p.id] && selectedServices[p.id].length > 0
            ? 'bg-gradient-to-r from-[#FF4500] to-[#FF8C00] text-white hover:scale-[1.02] hover:shadow-orange-500/30'
            : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
            }`}
        >
          {t.orderNow} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
});

const Home: React.FC = () => {
  const { user, providers, language, theme, bannerUrl, updateUser } = useStore();
  const navigate = useNavigate();
  const t = translations[language];
  const [selectedServices, setSelectedServices] = useState<Record<string, string[]>>({});
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [newAddress, setNewAddress] = useState(user?.address || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  React.useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallPopup(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    if (ios && !window.matchMedia('(display-mode: standalone)').matches) {
      const timer = setTimeout(() => setShowInstallPopup(true), 3000);
      return () => clearTimeout(timer);
    }
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleBookNow = useCallback((p: Provider) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const services = p.services_list.filter(s => selectedServices[p.id]?.includes(s.id));
    localStorage.setItem('selected_provider', JSON.stringify(p));
    localStorage.setItem('selected_services', JSON.stringify(services));
    navigate('/payment');
  }, [user, navigate, selectedServices]);

  const toggleService = useCallback((providerId: string, serviceId: string) => {
    setSelectedServices(prev => {
      const current = prev[providerId] || [];
      if (current.includes(serviceId)) {
        return { ...prev, [providerId]: current.filter(id => id !== serviceId) };
      }
      return { ...prev, [providerId]: [...current, serviceId] };
    });
  }, []);

  const activeProviders = useMemo(() =>
    providers.filter(p => p.status === 'active' && (!selectedCategory || p.service_type === selectedCategory)),
    [providers, selectedCategory]
  );

  const featuredProviders = useMemo(() =>
    activeProviders.filter(p => p.is_featured),
    [activeProviders]
  );

  const standardProviders = useMemo(() =>
    activeProviders.filter(p => !p.is_featured),
    [activeProviders]
  );

  return (
    <div className="relative min-h-screen space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="bg-blob top-[10%] left-[5%]"></div>
      <div className="bg-blob bottom-[20%] right-[10%] [animation-delay:2s]"></div>

      {showInstallPopup && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="glass-card w-full max-w-md p-8 shadow-2xl border-t-4 border-[#FF4500] animate-in slide-in-from-bottom-20 zoom-in-95 duration-500">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                <img src="https://cdn-icons-png.flaticon.com/512/3202/3202926.png" className="w-10 h-10 object-contain" alt="app-icon" />
              </div>
              <button onClick={() => setShowInstallPopup(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} className="opacity-40" />
              </button>
            </div>
            <h3 className="text-3xl font-orbitron font-black mb-3 tracking-tighter leading-tight luxury-text-gradient">
              {language === 'ar' ? 'حمّل تطبيق JedDrive الآن!' : 'Install JedDrive App!'}
            </h3>
            <p className="text-sm opacity-60 font-medium mb-8 leading-relaxed font-inter">
              {language === 'ar' ? 'استمتع بتجربة أسرع للوصول لخدماتنا!' : 'Enjoy a faster experience with our services!'}
            </p>
            {isIOS ? (
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-xs font-bold font-inter">
                <p className="text-[#FF4500] uppercase mb-4 tracking-widest">{language === 'ar' ? 'تحميل الايفون:' : 'iPhone Setup:'}</p>
                <p>{language === 'ar' ? '1. اضغط مشاركة' : '1. Tap Share'}</p>
                <p>{language === 'ar' ? '2. إضافة للشاشة الرئيسية' : '2. Add to Home Screen'}</p>
              </div>
            ) : (
              <button onClick={() => installPrompt?.prompt()} className="w-full bg-[#FF4500] text-white py-5 rounded-3xl font-orbitron font-black shadow-lg">
                {language === 'ar' ? 'تثبيت التطبيق' : 'Install App'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mx-4 bg-[#FF4500]/5 backdrop-blur-md overflow-hidden py-3 rounded-3xl border border-[#FF4500]/10">
        <div className="whitespace-nowrap inline-block animate-marquee font-orbitron font-bold text-[10px] text-dim uppercase tracking-[0.3em]">
          <span className="mx-8">{useStore.getState().scrollingTicker}</span>
          <span className="mx-8 text-[#FF4500]">///</span>
          <span className="mx-8">{useStore.getState().scrollingTicker}</span>
        </div>
      </div>

      <div className="px-4">
        <div className="relative h-56 md:h-80 rounded-[3rem] overflow-hidden shadow-2xl group border border-white/10">
          <img src={bannerUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
            <h2 className="text-3xl md:text-5xl font-orbitron font-black text-white luxury-text-gradient">
              {language === 'ar' ? 'اكتشف فخامة خدمات السيارات' : 'Premium Jeddah Car Services'}
            </h2>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="relative glass-card p-10 overflow-hidden shadow-2xl">
          <h2 className="text-4xl font-orbitron font-black mb-2 luxury-text-gradient uppercase tracking-tight">
            {language === 'ar' ? `مرحباً، ${user?.name || 'ضيف'}` : `WELCOME, ${user?.name || 'GUEST'}`}
          </h2>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 mt-6">
            <MapPin className="text-[#FF4500]" size={22} />
            <div className="flex-1">
              <p className="text-[10px] font-orbitron font-black opacity-30 tracking-widest">{language === 'ar' ? 'الموقع الحالي' : 'CURRENT LOCATION'}</p>
              <span className="font-bold text-sm tracking-tight">{user?.address || (language === 'ar' ? 'حي الروضة، جدة' : 'Al-Rawdah, Jeddah')}</span>
            </div>
            <button onClick={() => setShowLocationModal(true)} className="bg-white/10 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{language === 'ar' ? 'تغيير' : 'EDIT'}</button>
          </div>
        </div>
      </div>

      <div className="px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {MOCK_SERVICES.map((s) => (
          <button key={s.id} onClick={() => setSelectedCategory(selectedCategory === s.category ? null : s.category)} className={`flex flex-col items-center gap-5 p-8 glass-card transition-all ${selectedCategory === s.category ? 'border-[#FF4500] bg-[#FF4500]/5' : ''}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${selectedCategory === s.category ? 'bg-[#FF4500] text-white shadow-lg' : 'bg-white/5 opacity-40'}`}>{CATEGORY_ICONS[s.category]}</div>
            <span className="font-orbitron font-black text-[10px] uppercase tracking-widest">{translations[language][s.category.toLowerCase() as keyof typeof translations['ar']]}</span>
          </button>
        ))}
      </div>

      {featuredProviders.length > 0 && (
        <div className="px-4 space-y-8">
          <div className="px-4 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-orbitron font-black luxury-text-gradient">{language === 'ar' ? 'المراكز المميزة' : 'FEATURED CENTERS'}</h3>
              <p className="text-[10px] font-bold opacity-30 mt-1 uppercase tracking-widest">{language === 'ar' ? 'نخبة مزودي الخدمة المختارة' : 'ELITE HANDPICKED SERVICE PROVIDERS'}</p>
            </div>
            <Star className="text-orange-500 fill-orange-500/20" size={24} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProviders.map(p => <ProviderCard key={p.id} p={p} selectedServices={selectedServices} toggleService={toggleService} handleBookNow={handleBookNow} language={language} t={t} />)}
          </div>
        </div>
      )}

      <div className="px-4 space-y-8">
        <div className="px-4 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-orbitron font-black luxury-text-gradient">{language === 'ar' ? 'جميع مراكز الخدمة' : 'ALL SERVICE CENTERS'}</h3>
            <p className="text-[10px] font-bold opacity-30 mt-1 uppercase tracking-widest">{language === 'ar' ? 'خدمات احترافية بجودة عالية' : 'PROFESSIONAL HIGH-QUALITY SERVICES'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {standardProviders.length > 0 ? standardProviders.map(p => (
            <ProviderCard key={p.id} p={p} selectedServices={selectedServices} toggleService={toggleService} handleBookNow={handleBookNow} language={language} t={t} />
          )) : (
            <div className="col-span-full py-20 text-center glass-card">
              <MapPin size={40} className="mx-auto opacity-10 mb-4" />
              <p className="font-orbitron font-black opacity-20 uppercase tracking-widest">{language === 'ar' ? 'لا توجد مراكز متوفرة' : 'NO CENTERS AVAILABLE'}</p>
            </div>
          )}
        </div>
      </div>

      {showLocationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-8 rounded-[40px] border shadow-2xl animate-in zoom-in-95 duration-300 ${theme === 'luxury' ? 'bg-[#050505] border-orange-900/30' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xl font-orbitron font-black luxury-text-gradient uppercase tracking-tight">{language === 'ar' ? 'تعديل الموقع' : 'EDIT LOCATION'}</h3>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1 mb-6">{language === 'ar' ? 'أدخل عنوانك يدوياً' : 'Enter address manually'}</p>
            <input type="text" placeholder={language === 'ar' ? 'حي الروضة...' : 'Al-Rawdah...'} value={newAddress} onChange={(e) => setNewAddress(e.target.value)} className="w-full p-4 rounded-2xl border bg-white/5 border-white/10 font-bold text-sm mb-6 outline-none focus:border-[#FF4500]" />
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowLocationModal(false)} className="py-4 font-black text-xs opacity-40 underline">{language === 'ar' ? 'إلغاء' : 'CANCEL'}</button>
              <button onClick={() => { updateUser({ address: newAddress }); setShowLocationModal(false); }} className="bg-[#FF4500] py-4 rounded-2xl font-black text-xs text-white shadow-xl">{language === 'ar' ? 'حفظ' : 'SAVE'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
