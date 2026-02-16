
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { translations } from '../translations';
import { MOCK_SERVICES, CATEGORY_ICONS } from '../constants';
import { MapPin, Search, ChevronRight, Zap, Navigation, Star, X, Download } from 'lucide-react';
import { Provider } from '../types';

const Home: React.FC = () => {
  const { language, user, providers, bannerUrl } = useStore();
  const navigate = useNavigate();
  const t = translations[language];
  const [selectedServices, setSelectedServices] = useState<Record<string, string[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  React.useEffect(() => {
    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Only show if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallPopup(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show popup after a short delay since we can't detect installability via event
    if (ios && !window.matchMedia('(display-mode: standalone)').matches) {
      const timer = setTimeout(() => setShowInstallPopup(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  React.useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [selectedCategory]);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallPopup(false);
    }
    setInstallPrompt(null);
  };

  const activeProviders = providers.filter(p => !selectedCategory || p.service_type === selectedCategory);

  const toggleService = (providerId: string, serviceId: string) => {
    setSelectedServices(prev => {
      const current = prev[providerId] || [];
      if (current.includes(serviceId)) {
        return { ...prev, [providerId]: current.filter(id => id !== serviceId) };
      }
      return { ...prev, [providerId]: [...current, serviceId] };
    });
  };

  return (
    <div className="relative min-h-screen space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Background Blobs for Luxury Theme */}
      <div className="bg-blob top-[10%] left-[5%]"></div>
      <div className="bg-blob bottom-[20%] right-[10%] [animation-delay:2s]"></div>

      {/* PWA Install Popup */}
      {showInstallPopup && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
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
              {language === 'ar'
                ? 'استمتع بتجربة أسرع، إشعارات فورية، والوصول لخدماتنا حتى بدون إنترنت. ضغطة زر وحدة والتطبيق في جوالك!'
                : 'Enjoy a faster experience, instant notifications, and offline access. One click and the app is on your phone!'}
            </p>

            {isIOS ? (
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <p className="text-xs font-black mb-4 flex items-center gap-2 text-[#FF4500] uppercase tracking-widest font-orbitron">
                  <span className="w-6 h-6 rounded-full bg-[#FF4500] text-white flex items-center justify-center text-[10px]">!</span>
                  {language === 'ar' ? 'طريقة التحميل للايفون:' : 'Installation for iPhone:'}
                </p>
                <div className="space-y-4 text-xs font-bold opacity-80 font-inter">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-xl border border-white/10">1</div>
                    {language === 'ar' ? 'اضغط على زر المشاركة (Share) في السفاري' : 'Tap the Share button in Safari'}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-xl border border-white/10">2</div>
                    {language === 'ar' ? 'اختر "إضافة إلى الشاشة الرئيسية"' : 'Select "Add to Home Screen"'}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full bg-[#FF4500] text-white py-5 rounded-3xl font-orbitron font-black text-lg shadow-[0_10px_30px_rgba(255,69,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Download size={24} /> {language === 'ar' ? 'تثبيت التطبيق 📲' : 'Install App 📲'}
              </button>
            )}

            <button
              onClick={() => setShowInstallPopup(false)}
              className="w-full mt-6 text-[10px] font-orbitron font-black opacity-30 uppercase tracking-[0.2em] hover:opacity-100 transition-opacity"
            >
              {language === 'ar' ? 'ربما لاحقاً' : 'NOT NOW'}
            </button>
          </div>
        </div>
      )}

      {/* Scrolling Ticker (Marquee) */}
      <div className="mx-4 bg-[#FF4500]/10 backdrop-blur-md text-white overflow-hidden py-3 rounded-3xl border border-white/5">
        <div className="whitespace-nowrap inline-block animate-marquee font-orbitron font-bold text-[10px] uppercase tracking-[0.3em]">
          <span className="mx-8">{useStore.getState().scrollingTicker}</span>
          <span className="mx-8 text-[#FF4500]">///</span>
          <span className="mx-8">{useStore.getState().scrollingTicker}</span>
          <span className="mx-8 text-[#FF4500]">///</span>
          <span className="mx-8">{useStore.getState().scrollingTicker}</span>
        </div>
      </div>

      {/* Dynamic Promotion Banner */}
      <div className="px-4 reveal-on-scroll">
        <div className="relative h-56 md:h-80 rounded-[3rem] overflow-hidden shadow-2xl group border border-white/10">
          <img
            src={bannerUrl}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt="Promotion Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10">
            <span className="bg-[#FF4500] text-white text-[10px] font-orbitron font-black px-4 py-1.5 rounded-full w-fit mb-4 uppercase tracking-[0.2em] shadow-lg">
              {language === 'ar' ? 'عرض حصري' : 'Exclusive Offer'}
            </span>
            <h2 className="text-3xl md:text-5xl font-orbitron font-black text-white tracking-tighter leading-none luxury-text-gradient max-w-2xl">
              {language === 'ar' ? 'اكتشف فخامة خدمات السيارات في جدة' : 'Discover Luxury Car Services in Jeddah'}
            </h2>
          </div>
        </div>
      </div>

      <div className="px-4 reveal-on-scroll">
        <div className="relative overflow-hidden glass-card p-10 text-white shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl font-orbitron font-black mb-2 luxury-text-gradient">
              {language === 'ar' ? `مرحباً، ${user?.name}` : `WELCOME, ${user?.name}`}
            </h2>
            <p className="text-white/60 mb-8 max-w-md font-inter font-medium leading-relaxed">
              {t.tagline}
            </p>

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-[#FF4500]/20 flex items-center justify-center text-[#FF4500]">
                <MapPin size={22} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-orbitron font-black opacity-40 uppercase tracking-widest">{language === 'ar' ? 'الموقع الحالي' : 'CURRENT LOCATION'}</p>
                <span className="font-bold font-inter text-sm">{language === 'ar' ? 'حي الروضة، جدة' : 'Al-Rawdah, Jeddah'}</span>
              </div>
              <button className="bg-white/10 hover:bg-white/20 text-xs px-4 py-2 rounded-xl font-orbitron font-black transition-all border border-white/5">{language === 'ar' ? 'تغيير' : 'EDIT'}</button>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF4500]/10 blur-[100px] rounded-full"></div>
        </div>
      </div>

      {!user?.is_premium && (
        <div className="px-4 reveal-on-scroll">
          <div className="bg-gradient-to-br from-[#FF4500] to-[#8B0000] p-8 rounded-[3rem] flex items-center justify-between text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-inner">
                <Zap size={32} className="fill-white" />
              </div>
              <div>
                <h3 className="text-2xl font-orbitron font-black tracking-tight mb-1">{t.premium}</h3>
                <p className="text-sm opacity-80 font-inter font-medium">{language === 'ar' ? 'خصم 15% على كل طلب وأولوية قصوى.' : '15% Discount on all orders & top priority.'}</p>
              </div>
            </div>
            <button className="bg-white text-black px-8 py-3 rounded-2xl font-orbitron font-black text-xs hover:bg-slate-100 transition-all shadow-xl hover:scale-105 active:scale-95 relative z-10">
              {language === 'ar' ? 'تفعيل الآن' : 'JOIN VIP'}
            </button>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="px-4 grid grid-cols-2 md:grid-cols-4 gap-6 reveal-on-scroll">
        {MOCK_SERVICES.map((service) => (
          <button
            key={service.id}
            onClick={() => setSelectedCategory(service.category === selectedCategory ? null : service.category)}
            className={`flex flex-col items-center gap-5 p-8 glass-card group ${selectedCategory === service.category ? 'border-[#FF4500] bg-[#FF4500]/5' : ''}`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 scale-110 ${selectedCategory === service.category ? 'bg-[#FF4500] text-white rotate-[10deg] shadow-[0_0_30px_rgba(255,69,0,0.4)]' : 'bg-white/5 group-hover:bg-[#FF4500]/20 group-hover:text-[#FF4500]'}`}>
              {CATEGORY_ICONS[service.category]}
            </div>
            <span className="font-orbitron font-black text-xs uppercase tracking-[0.2em]">{translations[language][service.category.toLowerCase() as keyof typeof translations['ar']]}</span>
          </button>
        ))}
      </div>

      {/* Providers List */}
      <div className="px-4 space-y-6 pb-12 reveal-on-scroll">
        <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/5">
          <h3 className="text-lg font-orbitron font-black flex items-center gap-3">
            <Navigation className="w-5 h-5 text-[#FF4500] animate-pulse" />
            {language === 'ar' ? 'المراكز المعتمدة' : 'VERIFIED CENTERS'}
          </h3>
          <div className="text-[10px] font-orbitron font-black opacity-30 flex gap-4 uppercase">
            <span>{activeProviders.length} CENTERS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeProviders.map(p => (
            <div key={p.id} className="glass-card p-6 flex flex-col gap-6 group">
              <div className="flex gap-6">
                <div className="relative overflow-hidden rounded-[2rem] w-32 h-32 flex-shrink-0 border border-white/5">
                  <img src={p.image_url} alt={p.business_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-orbitron font-black text-lg tracking-tight luxury-text-gradient">{p.business_name}</h4>
                    <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                      <Star size={12} className="text-[#FF4500] fill-[#FF4500]" />
                      <span className="text-[10px] font-orbitron font-black">{p.rating}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-inter font-bold opacity-40 uppercase tracking-widest mb-4">{p.service_type === 'Tow' ? t.mobileService : t.stationaryService}</p>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[10px] font-orbitron font-black text-[#FF4500] hover:text-white transition-colors"
                  >
                    <Navigation size={12} /> {language === 'ar' ? 'التوجه للمركز' : 'NAVIGATE NOW'}
                  </a>
                </div>
              </div>

              {/* Service Selection */}
              <div className="bg-black/40 backdrop-blur-xl p-5 rounded-[2.5rem] space-y-3 border border-white/5">
                <p className="text-[8px] font-orbitron font-black opacity-30 uppercase tracking-[0.3em]">{language === 'ar' ? 'قائمة الخدمات' : 'SERVICE CATALOG'}</p>
                <div className="flex flex-wrap gap-2">
                  {p.services_list.map(s => (
                    <button
                      key={s.id}
                      onClick={() => toggleService(p.id, s.id)}
                      className={`px-4 py-2.5 rounded-2xl text-[10px] font-orbitron font-black transition-all border ${selectedServices[p.id]?.includes(s.id)
                        ? 'bg-[#FF4500] text-white border-[#FF4500] shadow-[0_5px_15px_rgba(255,69,0,0.3)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                    >
                      {s.name} - {s.price} {t.sar}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!(selectedServices[p.id]?.length > 0)}
                onClick={() => {
                  const services = p.services_list.filter(s => selectedServices[p.id]?.includes(s.id));
                  localStorage.setItem('selected_provider', JSON.stringify(p));
                  localStorage.setItem('selected_services', JSON.stringify(services));
                  navigate('/payment');
                }}
                className={`py-4 px-6 rounded-[2.5rem] font-orbitron font-black text-xs transition-all uppercase tracking-[0.2em] shadow-2xl ${selectedServices[p.id]?.length > 0
                  ? 'bg-white text-black hover:bg-[#FF4500] hover:text-white hover:scale-[1.02] active:scale-95'
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                  }`}
              >
                {t.orderNow}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
