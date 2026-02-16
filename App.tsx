
import React, { useEffect } from 'react';
import { MemoryRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Bell, Clock, Package, CheckCircle, MapPin, Star, Shield, Sun, Moon, Crown, LogOut, ChevronRight } from 'lucide-react';
import { useStore } from './store';
import { translations } from './translations';
import Landing from './pages/LandingPage';
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

  // No global redirect, allow access to Home
  // if (!user && location.pathname !== '/provider-signup') return <Landing />;

  return (
    <div className={`min-h-screen transition-theme ${language === 'ar' ? 'font-arabic' : 'font-sans'} ${theme === 'luxury' ? 'bg-[#050505] text-white' :
      theme === 'dark' ? 'bg-slate-900 text-slate-100' :
        'bg-slate-50 text-slate-900'
      }`}>
      <nav className={`fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center shadow-lg border-b transition-theme ${theme === 'dark' ? 'bg-slate-800/90 border-slate-700 backdrop-blur-md' :
        theme === 'luxury' ? 'bg-black/80 border-orange-900/30 backdrop-blur-md' :
          'bg-white/90 border-slate-200 backdrop-blur-md'
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

        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-full gap-1 border border-white/10">
            <button
              onClick={() => setTheme('light')}
              className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-[#FF4500] text-white shadow-lg scale-110' : 'opacity-40 hover:opacity-100 hover:bg-white/10'}`}
              title={t.light}
            >
              <Sun size={14} />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-[#FF4500] text-white shadow-lg scale-110' : 'opacity-40 hover:opacity-100 hover:bg-white/10'}`}
              title={t.dark}
            >
              <Moon size={14} />
            </button>
            <button
              onClick={() => setTheme('luxury')}
              className={`p-2 rounded-full transition-all ${theme === 'luxury' ? 'bg-[#FF4500] text-white shadow-lg scale-110' : 'opacity-40 hover:opacity-100 hover:bg-white/10'}`}
              title={t.luxury}
            >
              <Crown size={14} />
            </button>
          </div>

          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="w-10 h-10 flex items-center justify-center text-[10px] font-black border border-white/10 rounded-full bg-white/5 hover:bg-[#FF4500]/20 transition-colors"
          >
            {language === 'ar' ? 'EN' : 'عربي'}
          </button>

          {user ? (
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

              <span className="text-[10px] font-black hidden sm:block uppercase tracking-widest opacity-60">{user.name}</span>
              <button
                onClick={handleLogout}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10 group"
              >
                <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black shadow-xl ring-2 ring-white/10 ${theme === 'luxury' ? 'bg-[#ff6b00] shadow-[#ff6b00]/20' : 'bg-blue-600'}`}>
                {user.name.charAt(0)}
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all ${theme === 'luxury' ? 'bg-[#FF4500] text-white shadow-lg shadow-[#FF4500]/20' : 'bg-blue-600 text-white shadow-lg'}`}
            >
              {t.login}
            </button>
          )}
        </div>
      </nav>

      <main className="pt-20 pb-24 max-w-7xl mx-auto px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Landing />} />
          <Route path="/orders" element={user ? <OrdersPage /> : <Navigate to="/login" />} />
          <Route path="/payment" element={user ? <PaymentPage /> : <Navigate to="/login" />} />
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
