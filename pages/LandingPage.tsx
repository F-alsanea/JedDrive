
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { translations } from '../translations';
import { MOCK_USER } from '../constants';
import { Car, Shield, Navigation, Star, Lock, User as UserIcon, AlertCircle, CheckCircle, MapPin } from 'lucide-react';
import { User } from '../types';

const Landing: React.FC = () => {
  const { language, setUser, users, signUp, theme } = useStore();
  const navigate = useNavigate();
  const t = translations[language];
  const [view, setView] = useState<'login' | 'signup' | 'forgot' | 'otp' | 'reset'>('login');

  const [formData, setFormData] = useState({ identifier: '', password: '', name: '', phone: '', email: '', otp: '', newPassword: '', lat: 21.5, lng: 39.2, address: 'Jeddah' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);

  React.useEffect(() => {
    if (view === 'signup') {
      handleGetLocation();
    }
  }, [view]);

  const handleGetLocation = () => {
    setDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude }));
          setDetectingLocation(false);
          // Reverse geocoding could be done here with an API key, for now we just show coords or 'Current Spot'
        },
        () => setDetectingLocation(false)
      );
    } else {
      setDetectingLocation(false);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (view === 'signup') {
      const existingUser = users.find(u => u.phone === formData.phone || u.email === formData.email || u.id === formData.identifier);
      if (existingUser) {
        setError(language === 'ar' ? 'المستخدم موجود مسبقاً' : 'User already exists');
        return;
      }

      const newUser: User = {
        id: formData.identifier,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        role: 'user',
        is_premium: false,
        wallet_balance: 0,
        lat: formData.lat,
        lng: formData.lng,
        address: formData.address,
      };

      signUp(newUser);
      setSuccess(language === 'ar' ? 'تم إنشاء الحساب بنجاح! جاري تسجيل الدخول...' : 'Account created! Logging in...');
      setTimeout(() => {
        setUser(newUser);
        navigate('/');
      }, 1500);
      return;
    }

    // Login Logic
    // --- Strictly Restricted Admin Access (Hardcoded for primary admins) ---
    const admins = [
      { user: 'thsfaisal', pass: 'SA1500$a', name: 'فيصل' },
      { user: 'R0F8', pass: 'SA1500$a', name: 'أبو عابد' }
    ];

    const foundAdmin = admins.find(a => a.user === formData.identifier && a.pass === formData.password);

    if (foundAdmin) {
      const adminUser: User = {
        id: foundAdmin.user,
        name: foundAdmin.name,
        phone: '0000000000',
        email: `${foundAdmin.user}@jeddrive.com`,
        role: 'admin',
        is_premium: true,
        wallet_balance: 99999,
      };
      setUser(adminUser);
      navigate('/admin');
      return;
    }

    // Check against persisted users
    const foundUser = users.find(u => (u.id === formData.identifier || u.phone === formData.identifier) && formData.password === '12345678'); // Default password for mock testing or if we add pass field to User

    if (foundUser) {
      setUser(foundUser);
      navigate('/');
      return;
    }

    setError(t.loginError);
  };

  const handleRecoveryRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(language === 'ar' ? 'تم إرسال رمز التحقق إلى جوالك' : 'Verification code sent to your phone');
    setTimeout(() => setView('otp'), 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp === '1234') {
      setView('reset');
      setError('');
    } else {
      setError(language === 'ar' ? 'رمز التحقق غير صحيح' : 'Invalid OTP');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(t.passwordResetSuccess);
    setTimeout(() => setView('login'), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen py-10 space-y-10 animate-in fade-in duration-500 overflow-hidden relative">
      {/* Background Blobs for Luxury Feel */}
      <div className="bg-blob -top-20 -left-20"></div>
      <div className="bg-blob -bottom-20 -right-20" style={{ animationDelay: '-5s' }}></div>

      <div className="relative z-10">
        <Car className="w-20 h-20 text-[#FF4500] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(255,69,0,0.5)] animate-bounce-short" />
        <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter luxury-text-gradient">
          {t.appName}
        </h1>
        <p className="text-sm text-dim max-w-lg mx-auto font-medium uppercase tracking-[0.2em]">
          {t.tagline}
        </p>
      </div>

      <div className="w-full max-w-md glass-card p-10 shadow-2xl border-t-4 border-[#FF4500]">
        {view !== 'forgot' && view !== 'otp' && view !== 'reset' && (
          <div className="flex bg-white/5 p-1.5 rounded-[2rem] mb-10 border border-white/10">
            <button
              onClick={() => setView('login')}
              className={`flex-1 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${view === 'login' ? 'bg-[#FF4500] text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}
            >
              {t.login}
            </button>
            <button
              onClick={() => setView('signup')}
              className={`flex-1 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${view === 'signup' ? 'bg-[#FF4500] text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}
            >
              {t.signup}
            </button>
          </div>
        )}

        {(view === 'login' || view === 'signup') && (
          <form className="space-y-6 text-right" onSubmit={handleAuth}>
            {view === 'signup' && (
              <>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF4500] w-5 h-5" />
                  <input
                    required
                    type="text"
                    placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-6 py-5 rounded-3xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-[#FF4500] outline-none transition-all font-inter font-bold placeholder:opacity-30"
                  />
                </div>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF4500] w-5 h-5" />
                  <input
                    required
                    type="tel"
                    placeholder={language === 'ar' ? 'رقم الجوال' : 'Phone Number'}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-12 pr-6 py-5 rounded-3xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-[#FF4500] outline-none transition-all font-inter font-bold placeholder:opacity-30"
                  />
                </div>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF4500] w-5 h-5" />
                  <input
                    required
                    type="email"
                    placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-6 py-5 rounded-3xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-[#FF4500] outline-none transition-all font-inter font-bold placeholder:opacity-30"
                  />
                </div>

                {/* Location Picker Section */}
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FF4500]/10 flex items-center justify-center text-[#FF4500]">
                        <MapPin size={20} />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-orbitron font-black text-dim uppercase tracking-widest">{language === 'ar' ? 'الموقــع' : 'LOCATION'}</p>
                        <p className="text-xs font-bold font-inter truncate max-w-[150px]">
                          {detectingLocation ? (language === 'ar' ? 'جاري التحديد...' : 'Locating...') : `${formData.lat.toFixed(4)}, ${formData.lng.toFixed(4)}`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      className="text-[10px] font-orbitron font-black text-[#FF4500] hover:underline uppercase tracking-widest"
                    >
                      {language === 'ar' ? 'تغيير' : 'CHANGE'}
                    </button>
                  </div>
                  <p className="text-[9px] opacity-30 font-bold leading-relaxed">
                    {language === 'ar'
                      ? 'سيتم استخدام هذا الموقع لتزويدك بأقرب مقدمي الخدمة.'
                      : 'This location will be used to show nearest service providers.'}
                  </p>
                </div>
              </>
            )}
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF4500] w-5 h-5" />
              <input
                required
                type="text"
                placeholder={t.username}
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                className="w-full pl-12 pr-6 py-5 rounded-3xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-[#FF4500] outline-none transition-all font-inter font-bold placeholder:opacity-30"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF4500] w-5 h-5" />
              <input
                required
                type="password"
                placeholder={t.password}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-6 py-5 rounded-3xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-[#FF4500] outline-none transition-all font-inter font-bold placeholder:opacity-30"
              />
            </div>

            {view === 'login' && (
              <button
                type="button"
                onClick={() => setView('forgot')}
                className="text-[10px] font-orbitron font-black text-[#FF4500] hover:underline uppercase tracking-widest"
              >
                {t.forgotPassword}
              </button>
            )}

            {success && (
              <div className="flex items-center gap-2 p-4 bg-green-500/10 text-green-400 rounded-2xl text-[10px] font-orbitron font-black uppercase tracking-widest border border-green-500/20">
                <CheckCircle size={16} />
                {success}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-4 bg-[#FF4500]/10 text-[#FF4500] rounded-2xl text-[10px] font-orbitron font-black uppercase tracking-widest border border-[#FF4500]/20 animate-pulse">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#FF4500] text-white font-orbitron font-black py-5 rounded-[2rem] shadow-[0_10px_30px_rgba(255,69,0,0.3)] hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-[0.2em] text-sm"
            >
              {view === 'login' ? t.login : t.signup}
            </button>
          </form>
        )}

        {view === 'forgot' && (
          <form className="space-y-6 text-right" onSubmit={handleRecoveryRequest}>
            <h3 className="text-2xl font-orbitron font-black mb-2 luxury-text-gradient">{t.resetPassword}</h3>
            <p className="text-[10px] font-inter font-black text-dim mb-6 uppercase tracking-widest">{t.enterPhone}</p>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF4500] w-5 h-5" />
              <input
                required
                type="text"
                placeholder="05xxxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-12 pr-6 py-5 rounded-3xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-[#FF4500] outline-none font-bold"
              />
            </div>
            {success && <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl text-[10px] font-orbitron font-black uppercase tracking-widest">{success}</div>}
            <button type="submit" className="w-full bg-[#FF4500] text-white font-orbitron font-black py-5 rounded-[2rem] shadow-xl">{t.sendCode}</button>
            <button type="button" onClick={() => setView('login')} className="w-full text-[10px] font-orbitron font-black opacity-30 mt-2 uppercase tracking-widest hover:opacity-100 transition-opacity">{language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}</button>
          </form>
        )}

        {view === 'otp' && (
          <form className="space-y-6 text-center" onSubmit={handleVerifyOtp}>
            <h3 className="text-2xl font-orbitron font-black mb-2 luxury-text-gradient">{t.verifyOtp}</h3>
            <p className="text-[10px] font-inter font-black opacity-40 mb-6 uppercase tracking-widest">{language === 'ar' ? 'أدخل الرمز المرسل (1234 للمحاكاة)' : 'Enter Code (1234 for Mock)'}</p>
            <input
              required
              type="text"
              maxLength={4}
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              className="w-full p-6 rounded-3xl border border-white/10 bg-white/5 text-center text-4xl font-black tracking-[0.5em] focus:ring-2 focus:ring-[#FF4500] outline-none"
            />
            {error && <div className="p-4 bg-[#FF4500]/10 text-[#FF4500] rounded-2xl text-[10px] font-orbitron font-black uppercase tracking-widest">{error}</div>}
            <button type="submit" className="w-full bg-[#FF4500] text-white font-orbitron font-black py-5 rounded-[2rem] shadow-xl">{t.verifyOtp}</button>
          </form>
        )}

        {view === 'reset' && (
          <form className="space-y-6 text-right" onSubmit={handleResetPassword}>
            <h3 className="text-2xl font-orbitron font-black mb-2 luxury-text-gradient">{t.newPassword}</h3>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF4500] w-5 h-5" />
              <input
                required
                type="password"
                placeholder={t.newPassword}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full pl-12 pr-6 py-5 rounded-3xl border border-white/10 bg-white/5 focus:ring-2 focus:ring-[#FF4500] outline-none"
              />
            </div>
            {success && <div className="p-4 bg-green-500/10 text-green-400 rounded-2xl text-[10px] font-orbitron font-black uppercase tracking-widest">{success}</div>}
            <button type="submit" className="w-full bg-[#FF4500] text-white font-orbitron font-black py-5 rounded-[2rem] shadow-xl">{t.save}</button>
          </form>
        )}

        <div className="mt-10 pt-8 border-t border-white/5">
          <button
            onClick={() => navigate('/provider-signup')}
            className="flex items-center justify-center gap-3 text-[#FF4500] hover:text-white transition-colors font-orbitron font-black text-[10px] w-full uppercase tracking-widest"
          >
            <Navigation className="w-5 h-5 animate-pulse" />
            {t.joinAsProvider}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
        <div className="p-8 glass-card border-none bg-white/5 backdrop-blur-3xl group hover:bg-[#FF4500]/10 transition-colors">
          <Shield className="w-10 h-10 text-[#FF4500] mb-4 mx-auto group-hover:scale-110 transition-transform" />
          <h3 className="font-orbitron font-black uppercase tracking-widest text-sm">{language === 'ar' ? 'أمان تام' : 'Full Safety'}</h3>
          <p className="text-[10px] font-inter font-black opacity-30 mt-2 uppercase tracking-[0.2em]">{language === 'ar' ? 'مقدمو خدمة معتمدون' : 'Verified Providers'}</p>
        </div>
        <div className="p-8 glass-card border-none bg-white/5 backdrop-blur-3xl group hover:bg-[#FF4500]/10 transition-colors">
          <Navigation className="w-10 h-10 text-[#FF4500] mb-4 mx-auto group-hover:scale-110 transition-transform" />
          <h3 className="font-orbitron font-black uppercase tracking-widest text-sm">{language === 'ar' ? 'تتبع لحظي' : 'Live Tracking'}</h3>
          <p className="text-[10px] font-inter font-black opacity-30 mt-2 uppercase tracking-[0.2em]">{language === 'ar' ? 'اعرف مكان السطحة فوراً' : 'Live Tow Status'}</p>
        </div>
        <div className="p-8 glass-card border-none bg-white/5 backdrop-blur-3xl group hover:bg-[#FF4500]/10 transition-colors">
          <Star className="w-10 h-10 text-[#FF4500] mb-4 mx-auto group-hover:scale-110 transition-transform" />
          <h3 className="font-orbitron font-black uppercase tracking-widest text-sm">{language === 'ar' ? 'عضوية VIP' : 'VIP Membership'}</h3>
          <p className="text-[10px] font-inter font-black opacity-30 mt-2 uppercase tracking-[0.2em]">{language === 'ar' ? 'خصومات حصرية للبريميم' : 'Exclusive Discounts'}</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
