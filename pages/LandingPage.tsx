
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { translations } from '../translations';
import { MOCK_USER } from '../constants';
import { Car, Shield, Navigation, Star, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { User } from '../types';

const Landing: React.FC = () => {
  const { language, setUser } = useStore();
  const navigate = useNavigate();
  const t = translations[language];
  const [view, setView] = useState<'login' | 'signup' | 'forgot' | 'otp' | 'reset'>('login');

  const [formData, setFormData] = useState({ identifier: '', password: '', name: '', phone: '', email: '', otp: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // --- Strictly Restricted Admin Access ---
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

    // --- Mock Standard Login for Testing ---
    if (formData.identifier === 'user' && formData.password === '123') {
      setUser(MOCK_USER);
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
    <div className="flex flex-col items-center justify-center text-center py-6 space-y-10 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-400/20 blur-3xl rounded-full"></div>
        <Car className="w-16 h-16 text-blue-600 mx-auto mb-4 drop-shadow-2xl" />
        <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter">
          {t.appName}
        </h1>
        <p className="text-md text-slate-500 max-w-lg mx-auto font-medium">
          {t.tagline}
        </p>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-700">
        {view !== 'forgot' && view !== 'otp' && view !== 'reset' && (
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl mb-6">
            <button
              onClick={() => setView('login')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all ${view === 'login' ? 'bg-white dark:bg-slate-800 shadow-md text-blue-600' : 'opacity-50'}`}
            >
              {t.login}
            </button>
            <button
              onClick={() => setView('signup')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all ${view === 'signup' ? 'bg-white dark:bg-slate-800 shadow-md text-blue-600' : 'opacity-50'}`}
            >
              {t.signup}
            </button>
          </div>
        )}

        {(view === 'login' || view === 'signup') && (
          <form className="space-y-4 text-right" onSubmit={handleLogin}>
            {view === 'signup' && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  required
                  type="text"
                  placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            )}
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                required
                type="text"
                placeholder={t.username}
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                required
                type="password"
                placeholder={t.password}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {view === 'login' && (
              <button
                type="button"
                onClick={() => setView('forgot')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                {t.forgotPassword}
              </button>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold animate-pulse">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95"
            >
              {view === 'login' ? t.login : t.signup}
            </button>
          </form>
        )}

        {view === 'forgot' && (
          <form className="space-y-4 text-right" onSubmit={handleRecoveryRequest}>
            <h3 className="text-xl font-black mb-4">{t.resetPassword}</h3>
            <p className="text-xs text-slate-500 mb-6">{t.enterPhone}</p>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                required
                type="text"
                placeholder="05xxxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            {success && <div className="p-3 bg-green-50 text-green-600 rounded-xl text-xs font-bold">{success}</div>}
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl">{t.sendCode}</button>
            <button type="button" onClick={() => setView('login')} className="w-full text-xs font-bold text-slate-400 mt-2">{t.ar ? 'العودة لتسجيل الدخول' : 'Back to Login'}</button>
          </form>
        )}

        {view === 'otp' && (
          <form className="space-y-4 text-center" onSubmit={handleVerifyOtp}>
            <h3 className="text-xl font-black mb-4">{t.verifyOtp}</h3>
            <p className="text-xs text-slate-500 mb-6">{language === 'ar' ? 'أدخل الرمز المرسل (1234 للمحاكاة)' : 'Enter Code (1234 for Mock)'}</p>
            <input
              required
              type="text"
              maxLength={4}
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              className="w-full p-4 rounded-2xl border dark:bg-slate-900 text-center text-3xl font-black tracking-[1em]"
            />
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold">{error}</div>}
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl">{t.verifyOtp}</button>
          </form>
        )}

        {view === 'reset' && (
          <form className="space-y-4 text-right" onSubmit={handleResetPassword}>
            <h3 className="text-xl font-black mb-4">{t.newPassword}</h3>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                required
                type="password"
                placeholder={t.newPassword}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border dark:bg-slate-900"
              />
            </div>
            {success && <div className="p-3 bg-green-50 text-green-600 rounded-xl text-xs font-bold">{success}</div>}
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl">{t.save}</button>
          </form>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => navigate('/provider-signup')}
            className="flex items-center justify-center gap-2 text-blue-600 hover:underline font-bold w-full"
          >
            <Navigation className="w-5 h-5" />
            {t.joinAsProvider}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
        <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-3xl border border-slate-200">
          <Shield className="w-8 h-8 text-green-500 mb-2 mx-auto" />
          <h3 className="font-bold">{language === 'ar' ? 'أمان تام' : 'Full Safety'}</h3>
          <p className="text-xs opacity-60 mt-1">{language === 'ar' ? 'مقدمو خدمة معتمدون' : 'Verified Providers'}</p>
        </div>
        <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-3xl border border-slate-200">
          <Navigation className="w-8 h-8 text-blue-500 mb-2 mx-auto" />
          <h3 className="font-bold">{language === 'ar' ? 'تتبع لحظي' : 'Live Tracking'}</h3>
          <p className="text-xs opacity-60 mt-1">{language === 'ar' ? 'اعرف مكان السطحة فوراً' : 'Live Tow Status'}</p>
        </div>
        <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-3xl border border-slate-200">
          <Star className="w-8 h-8 text-yellow-500 mb-2 mx-auto" />
          <h3 className="font-bold">{language === 'ar' ? 'عضوية VIP' : 'VIP Membership'}</h3>
          <p className="text-xs opacity-60 mt-1">{language === 'ar' ? 'خصومات حصرية للبريميم' : 'Exclusive Discounts'}</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
