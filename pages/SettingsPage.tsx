
import React from 'react';
import { useStore } from '../store';
import { translations } from '../translations';
import { Star, Shield, CreditCard, Bell, Smartphone, User, ChevronRight } from 'lucide-react';

const SettingsPage: React.FC = () => {
    const { user, language, theme } = useStore();
    const t = translations[language];

    if (!user) return null;

    const sections = [
        {
            title: t.premium,
            icon: <Star className="text-orange-500" />,
            desc: language === 'ar' ? 'قم بترقية حسابك للوصول لميزات حصرية' : 'Upgrade for exclusive features',
            action: <button className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">{language === 'ar' ? 'ترقية الآن' : 'Upgrade'}</button>
        },
        {
            title: language === 'ar' ? 'بيانات الحساب' : 'Account Details',
            icon: <User className="text-blue-500" />,
            desc: user.name + ' • ' + user.phone,
            action: <ChevronRight size={16} className="opacity-30" />
        },
        {
            title: language === 'ar' ? 'الأمان' : 'Security',
            icon: <Shield className="text-green-500" />,
            desc: language === 'ar' ? 'تغيير كلمة المرور والتحقق بخطوتين' : 'Password & 2FA',
            action: <ChevronRight size={16} className="opacity-30" />
        }
    ];

    return (
        <div className="space-y-6 max-w-2xl mx-auto pb-20">
            <div className={`p-8 rounded-[40px] border relative overflow-hidden transition-all ${theme === 'luxury' ? 'bg-black/40 border-orange-900/20' : 'bg-white border-slate-100'
                }`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl -mr-10 -mt-10" />

                <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center text-3xl font-black text-white shadow-2xl relative ${theme === 'luxury' ? 'bg-gradient-to-br from-[#FF4500] to-[#FF8C00]' : 'bg-blue-600'
                        }`}>
                        {user.name.charAt(0)}
                        {user.is_premium && (
                            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-lg">
                                <Star size={12} fill="#FF4500" className="text-[#FF4500]" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
                        <p className="text-xs font-bold opacity-40 uppercase tracking-widest">{user.phone}</p>
                        {user.is_premium && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-[9px] font-black mt-2 uppercase tracking-widest">
                                VIP MEMBER
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {sections.map((s, i) => (
                    <div key={i} className={`p-5 rounded-[28px] border flex items-center justify-between transition-all hover:scale-[1.02] cursor-pointer ${theme === 'luxury' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'
                        }`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'luxury' ? 'bg-white/5' : 'bg-slate-50'
                                }`}>
                                {s.icon}
                            </div>
                            <div>
                                <h3 className="font-black text-sm">{s.title}</h3>
                                <p className="text-[10px] font-medium opacity-40">{s.desc}</p>
                            </div>
                        </div>
                        {s.action}
                    </div>
                ))}
            </div>

            <div className={`p-8 rounded-[35px] text-center border overflow-hidden relative ${theme === 'luxury' ? 'bg-[#FF4500]/5 border-[#FF4500]/10' : 'bg-blue-50/50 border-blue-100'
                }`}>
                <CreditCard size={48} className="mx-auto opacity-10 mb-4" />
                <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-2">{language === 'ar' ? 'رصيد المحفظة' : 'Wallet Balance'}</h4>
                <div className="text-4xl font-black mb-1">{user.wallet_balance} <span className="text-sm opacity-50">{t.sar}</span></div>
                <button className="text-[10px] font-black text-blue-600 uppercase border-b border-blue-600/30 pb-1 mt-4">{language === 'ar' ? 'شحن الرصيد' : 'Add Funds'}</button>
            </div>
        </div>
    );
};

export default SettingsPage;
