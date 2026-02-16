
import React, { useEffect } from 'react';
import { MemoryRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Bell, Clock, Package, CheckCircle, MapPin, Star, Shield } from 'lucide-react';
import { useStore } from './store';
import { translations } from './translations';
import Landing from './pages/Landing';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import PaymentPage from './pages/PaymentPage';
import ProviderSignup from './pages/ProviderSignup';
import OrdersPage from './pages/OrdersPage';

const RouterContent: React.FC = () => {
  const { user, theme, language, setTheme, setLanguage, setUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[language];

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('theme-luxury');
    } else if (theme === 'luxury') {
      document.documentElement.classList.add('theme-luxury');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('dark', 'theme-luxury');
    }

    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [theme, language]);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  if (!user && location.pathname !== '/provider-signup') return <Landing />;

  return (
    <div className={`min-h-screen transition-theme ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <nav className={`fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center shadow-lg border-b transition-theme ${theme === 'dark' ? 'bg-slate-800 border-slate-700' :
        theme === 'luxury' ? 'bg-black border-orange-900/30' :
          'bg-white border-slate-200'
        }`}>
        <div className="flex items-center gap-4">
          <h1
            className={`text-2xl font-black tracking-tighter cursor-pointer transition-colors ${theme === 'luxury' ? 'text-[#ff6b00]' : 'text-blue-600'
              }`}
            onClick={() => navigate('/')}
          >
            {t.appName}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-700 luxury:bg-slate-900 p-1 rounded-full gap-1 border luxury:border-orange-900/20">
            <button onClick={() => setTheme('light')} className={`px-2 py-1 text-[10px] font-bold rounded-full transition-all ${theme === 'light' ? 'bg-white shadow-sm' : 'opacity-50'}`}>{t.light}</button>
            <button onClick={() => setTheme('dark')} className={`px-2 py-1 text-[10px] font-bold rounded-full transition-all ${theme === 'dark' ? 'bg-slate-600 text-white shadow-sm' : 'opacity-50'}`}>{t.dark}</button>
            <button onClick={() => setTheme('luxury')} className={`px-2 py-1 text-[10px] font-bold rounded-full transition-all ${theme === 'luxury' ? 'bg-[#ff6b00] text-white shadow-sm' : 'opacity-50'}`}>{t.luxury}</button>
          </div>

          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="px-3 py-1 text-[10px] font-black border rounded-md"
          >
            {language === 'ar' ? 'EN' : 'عربي'}
          </button>

          {user && (
            <div className="flex items-center gap-3 border-l pl-3 ml-3 border-slate-300 dark:border-slate-600">
              {/* Notifications */}
              <div className="relative group">
                <button className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${useStore.getState().notifications.some(n => n.status === 'unread') ? 'notification-pulse' : ''}`}>
                  <Bell size={20} className="opacity-70" />
                </button>

                {/* Dropdown */}
                <div className="absolute top-full -right-4 w-72 bg-white dark:bg-slate-800 border rounded-3xl mt-2 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                  <div className="p-4 border-b font-black text-xs uppercase tracking-widest opacity-40">
                    {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700">
                    {useStore.getState().notifications.length === 0 ? (
                      <div className="p-8 text-center opacity-30 text-[10px] font-black">{language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</div>
                    ) : (
                      useStore.getState().notifications.map(n => (
                        <div key={n.id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${n.status === 'unread' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                          <p className="font-black text-sm">{n.title}</p>
                          <p className="text-[10px] font-medium opacity-60 line-clamp-2">{n.body}</p>
                          <p className="text-[8px] opacity-30 mt-1 font-bold">{new Date(n.created_at).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <span className="text-xs font-black hidden sm:block uppercase">{user.name}</span>
              <button onClick={handleLogout} className="text-[10px] text-red-500 font-bold hover:underline">{t.logout}</button>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${theme === 'luxury' ? 'bg-[#ff6b00]' : 'bg-blue-600'}`}>
                {user.name.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="pt-20 pb-24 max-w-7xl mx-auto px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/provider-signup" element={<ProviderSignup />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/provider" element={user?.role === 'provider' ? <ProviderDashboard /> : <Navigate to="/" />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation - Glassmorphism Style */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 h-auto md:hidden pointer-events-none">
          <div className="max-w-md mx-auto h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[35px] shadow-2xl border border-white/20 dark:border-slate-700/30 flex items-center justify-around px-6 pointer-events-auto ring-1 ring-black/5">
            <button
              onClick={() => navigate('/')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${location.pathname === '/' ? (theme === 'luxury' ? 'text-[#ff6b00] scale-110' : 'text-blue-600 scale-110') : 'opacity-40 hover:opacity-100'}`}
            >
              <div className={`p-2 rounded-2xl ${location.pathname === '/' ? (theme === 'luxury' ? 'bg-[#ff6b00]/10' : 'bg-blue-600/10') : ''}`}>
                <Package size={22} className={location.pathname === '/' ? 'animate-bounce-short' : ''} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{t.home}</span>
            </button>

            <button
              onClick={() => navigate('/orders')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${location.pathname === '/orders' ? (theme === 'luxury' ? 'text-[#ff6b00] scale-110' : 'text-blue-600 scale-110') : 'opacity-40 hover:opacity-100'}`}
            >
              <div className={`p-2 rounded-2xl ${location.pathname === '/orders' ? (theme === 'luxury' ? 'bg-[#ff6b00]/10' : 'bg-blue-600/10') : ''}`}>
                <Clock size={22} className={location.pathname === '/orders' ? 'animate-bounce-short' : ''} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{t.orders}</span>
            </button>

            {user.role === 'admin' ? (
              <button
                onClick={() => navigate('/admin')}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${location.pathname === '/admin' ? 'text-red-500 scale-110' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className={`p-2 rounded-2xl ${location.pathname === '/admin' ? 'bg-red-500/10' : ''}`}>
                  <Shield size={22} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{language === 'ar' ? 'الإدارة' : 'Admin'}</span>
              </button>
            ) : user.role === 'provider' ? (
              <button
                onClick={() => navigate('/provider')}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${location.pathname === '/provider' ? 'text-green-500 scale-110' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className={`p-2 rounded-2xl ${location.pathname === '/provider' ? 'bg-green-500/10' : ''}`}>
                  <CheckCircle size={22} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{language === 'ar' ? 'المركز' : 'Panel'}</span>
              </button>
            ) : null}

            <button
              onClick={() => navigate('/settings')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${location.pathname === '/settings' ? (theme === 'luxury' ? 'text-[#ff6b00] scale-110' : 'text-blue-600 scale-110') : 'opacity-40 hover:opacity-100'}`}
            >
              <div className={`p-2 rounded-2xl ${location.pathname === '/settings' ? (theme === 'luxury' ? 'bg-[#ff6b00]/10' : 'bg-blue-600/10') : ''}`}>
                <Star size={22} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{t.premium}</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Navigation for backwards compatibility or high-res tablets */}
      {user && (
        <div className="hidden md:fixed md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:z-50 md:flex md:gap-4 md:bg-white/80 md:dark:bg-slate-800/80 md:luxury:bg-black/80 md:backdrop-blur-md md:px-8 md:py-4 md:rounded-[30px] md:shadow-2xl md:border md:border-slate-200 md:dark:border-slate-700 md:luxury:border-orange-900/30">
          <button onClick={() => navigate('/')} className={`font-black text-xs uppercase transition-colors ${location.pathname === '/' ? (theme === 'luxury' ? 'text-[#ff6b00]' : 'text-blue-600') : 'opacity-50'}`}>{t.home}</button>
          <button onClick={() => navigate('/orders')} className={`font-black text-xs uppercase transition-colors ${location.pathname === '/orders' ? (theme === 'luxury' ? 'text-[#ff6b00]' : 'text-blue-600') : 'opacity-50'}`}>{t.orders}</button>
          {user.role === 'admin' && <button onClick={() => navigate('/admin')} className={`font-black text-xs uppercase transition-colors ${location.pathname === '/admin' ? 'text-red-500' : 'opacity-50'}`}>{t.adminPanel}</button>}
          {user.role === 'provider' && <button onClick={() => navigate('/provider')} className={`font-black text-xs uppercase transition-colors ${location.pathname === '/provider' ? 'text-green-500' : 'opacity-50'}`}>{t.providerPanel}</button>}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <RouterContent />
    </MemoryRouter>
  );
};

export default App;
