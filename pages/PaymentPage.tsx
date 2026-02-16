
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { translations } from '../translations';
import { CreditCard, Wallet, Apple, Ticket, ArrowRight, ShieldCheck, CheckCircle2, Navigation, MapPin, Printer } from 'lucide-react';
import { Provider, Order, ProviderService } from '../types';
import { generateUniqueOTP } from '../constants';

const PaymentPage: React.FC = () => {
  const { language, user, coupons, addOrder } = useStore();
  const navigate = useNavigate();
  const t = translations[language];

  const [paymentStep, setPaymentStep] = useState<'checkout' | 'success'>('checkout');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'center' | 'cash'>('bank');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedServices, setSelectedServices] = useState<ProviderService[]>([]);
  const [uniqueOtp, setUniqueOtp] = useState('');
  const [orderId, setOrderId] = useState('');
  const [trackingPos, setTrackingPos] = useState(0);

  useEffect(() => {
    const savedProv = localStorage.getItem('selected_provider');
    const savedServ = localStorage.getItem('selected_services');
    if (savedProv) setSelectedProvider(JSON.parse(savedProv));
    if (savedServ) setSelectedServices(JSON.parse(savedServ));
  }, []);

  // Tracking Simulation Logic
  useEffect(() => {
    if (paymentStep === 'success' && selectedProvider?.service_type === 'Tow') {
      const interval = setInterval(() => {
        setTrackingPos(prev => (prev < 100 ? prev + 1 : 100));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [paymentStep, selectedProvider]);

  const basePrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const premiumDiscount = user?.is_premium ? basePrice * 0.15 : 0;
  const couponDiscount = appliedCoupon ? (appliedCoupon.type === 'percent' ? basePrice * (appliedCoupon.discount_value / 100) : appliedCoupon.discount_value) : 0;
  const total = basePrice - premiumDiscount - couponDiscount;

  const handleApplyCoupon = () => {
    const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.is_active);
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponCode('');
    } else {
      alert(language === 'ar' ? 'كود غير صالح' : 'Invalid code');
    }
  };

  const confirmPayment = () => {
    const otp = generateUniqueOTP();
    const newId = Math.random().toString(36).substr(2, 9).toUpperCase();
    setUniqueOtp(otp);
    setOrderId(newId);

    const newOrder: Order = {
      id: newId,
      user_id: user?.id || 'guest',
      provider_id: selectedProvider?.id || null,
      service_id: selectedServices[0]?.id || 's1',
      service_name: selectedServices.map(s => s.name).join(' + '),
      services: selectedServices,
      status: 'accepted',
      location_gps: { lat: 21.5, lng: 39.2, address: 'حي الروضة، جدة' },
      total_price: total,
      unique_otp: otp,
      created_at: new Date().toISOString(),
      commission: total * 0.1,
      payment_method: selectedMethod,
      order_type: selectedProvider?.service_type === 'Tow' ? 'Mobile' : 'Stationary'
    };

    addOrder(newOrder);
    setPaymentStep('success');
  };

  if (paymentStep === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-8 max-w-2xl mx-auto animate-in fade-in duration-500">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4 animate-bounce">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-black mb-2">{language === 'ar' ? 'تم الطلب بنجاح!' : 'Order Placed!'}</h2>
          <p className="text-slate-500">{language === 'ar' ? 'شكراً لاختيارك JedDrive، خدمتك جاري تأكيدها.' : 'Thanks for choosing JedDrive.'}</p>
        </div>

        {/* Live Tracking for Towing */}
        {selectedProvider?.service_type === 'Tow' && (
          <div className="bg-slate-900 text-white p-8 rounded-[40px] w-full shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
                  <Navigation size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black opacity-50 uppercase">{language === 'ar' ? 'تتبع السطحة' : 'Live Tracking'}</p>
                  <p className="font-bold">{trackingPos === 100 ? (language === 'ar' ? 'وصلت السطحة!' : 'Tow Arrived!') : (language === 'ar' ? 'في الطريق إليك...' : 'In Route...')}</p>
                </div>
              </div>
              <span className="bg-green-500 text-[10px] px-3 py-1 rounded-full font-black animate-pulse">LIVE</span>
            </div>

            <div className="relative h-1 bg-white/10 rounded-full mb-8">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500 rounded-full"
                style={{ width: `${trackingPos}%`, [language === 'ar' ? 'right' : 'left']: 0 }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 flex items-center justify-center">
                  <Printer size={16} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-bold opacity-60">
              <div className="flex items-center gap-2"><MapPin size={14} /> حي الروضة</div>
              <div className="flex items-center gap-2 justify-end">{trackingPos === 100 ? '0' : Math.ceil((100 - trackingPos) / 10)} min</div>
            </div>
          </div>
        )}

        {/* Dynamic Navigation for stationary centers */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-[40px] w-full flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-10 -mt-10"></div>
          <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
            <MapPin size={40} className="animate-bounce" />
          </div>
          <div className="text-center">
            <h3 className="font-orbitron font-black text-2xl mb-2">{language === 'ar' ? 'يرجى التوجه للمركز' : 'STATIONARY CENTER'}</h3>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{selectedProvider?.business_name}</p>
          </div>
          <a
            href={selectedProvider?.google_maps_url || `https://www.google.com/maps/dir/?api=1&destination=${selectedProvider?.lat},${selectedProvider?.lng}`}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-white text-blue-600 py-5 rounded-[2rem] font-orbitron font-black text-sm flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl"
          >
            <Navigation size={20} /> {t.goToCenter}
          </a>
        </div>

        {/* Unique OTP Display */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl w-full border-4 border-dashed border-blue-200 dark:border-blue-900 text-center shadow-lg">
          <p className="text-sm opacity-50 mb-3 font-black uppercase tracking-widest">{t.otpLabel}</p>
          <span className="text-6xl font-black text-blue-600 font-mono tracking-tighter">{uniqueOtp}</span>

          {selectedMethod === 'bank' && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold mb-4">
                {language === 'ar'
                  ? 'يجب تحويل المبلغ للحساب الظاهر وارفاق الايصال في الواتس اب '
                  : 'You must transfer the amount and attach the receipt in WhatsApp '}
                <a
                  href={`https://wa.me/966596995687?text=${encodeURIComponent(
                    language === 'ar'
                      ? `مرحباً، أنا ${user?.name}. أرغب في تأكيد طلبي رقم ${orderId}. الخدمة: ${selectedServices.map(s => s.name).join(', ')}. الإجمالي: ${total} ر.س. لقد قمت بالتحويل البنكي وهذا هو الإيصال.`
                      : `Hello, I am ${user?.name}. I want to confirm my order #${orderId}. Service: ${selectedServices.map(s => s.name).join(', ')}. Total: ${total} SAR. I have made the bank transfer and here is the receipt.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline font-black"
                >
                  {language === 'ar' ? 'هنا' : 'HERE'}
                </a>
              </p>
            </div>
          )}

          <p className="mt-4 text-xs text-slate-400 font-bold">{language === 'ar' ? 'لا تشارك هذا الرمز إلا بعد انتهاء الخدمة فعلياً.' : 'Do not share until service is fully finished.'}</p>
        </div>

        {/* Visual Invoice Mockup */}
        <div className="bg-white dark:bg-slate-900 w-full p-8 rounded-[30px] border shadow-2xl space-y-4">
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h4 className="font-black text-xl">{t.invoice}</h4>
              <p className="text-[10px] opacity-40 font-black">ORDER ID: {orderId}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-blue-600 text-[10px]">JedDrive App</p>
              <div className="mt-1 flex gap-1 justify-end">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="space-y-3 py-4">
            {selectedServices.map(s => (
              <div key={s.id} className="flex justify-between text-sm">
                <span className="opacity-60">{s.name}</span>
                <span className="font-bold">{s.price} {t.sar}</span>
              </div>
            ))}
            <div className="flex justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="opacity-50">{t.paymentMethod}</span>
              <span className="font-black uppercase">{selectedMethod}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-blue-600 pt-2">
              <span>{t.total}</span>
              <span>{total} {t.sar}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white flex items-center justify-center rounded-xl p-1 shadow-sm">
              {/* Mock QR */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="30" height="30" fill="currentColor" />
                <rect x="60" y="10" width="30" height="30" fill="currentColor" />
                <rect x="10" y="60" width="30" height="30" fill="currentColor" />
                <rect x="50" y="50" width="10" height="10" fill="currentColor" />
                <rect x="70" y="70" width="20" height="20" fill="currentColor" />
              </svg>
            </div>
            <div className="text-[10px] font-bold opacity-50">
              {language === 'ar' ? 'امسح الرمز للتحقق من صحة الفاتورة الرقمية' : 'Scan for digital verification'}
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 py-3 rounded-2xl font-black text-[10px] hover:bg-slate-200 transition-colors uppercase tracking-widest"
          >
            <Printer size={14} /> {t.printInvoice}
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white w-full py-5 rounded-3xl font-black text-xl shadow-lg"
        >
          {t.home}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20 animate-in slide-in-from-bottom-6">
      <div className="lg:col-span-2 space-y-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600">
          <ArrowRight size={18} className={language === 'ar' ? '' : 'rotate-180'} /> {language === 'ar' ? 'العودة للخدمات' : 'Back to Services'}
        </button>

        <h2 className="text-3xl font-black">{language === 'ar' ? 'مراجعة الطلب والدفع' : 'Payment & Review'}</h2>

        {selectedProvider && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border flex items-center gap-6 shadow-sm">
            <img src={selectedProvider.image_url} className="w-24 h-24 rounded-2xl object-cover" />
            <div>
              <h4 className="font-black text-2xl">{selectedProvider.business_name}</h4>
              <p className="opacity-50 font-bold">{selectedProvider.services_list[0].name}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-3 py-1 rounded-full font-bold">
                  {selectedProvider.service_type === 'Tow' ? t.mobileService : t.stationaryService}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-bold">{t.ar ? 'اختر وسيلة الدفع' : 'Payment Method'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedMethod('bank')}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${selectedMethod === 'bank' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md' : 'bg-white dark:bg-slate-800'}`}
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-600">
                <Wallet size={24} />
              </div>
              <span className="font-bold">{language === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}</span>
            </button>
            <button
              onClick={() => setSelectedMethod('center')}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${selectedMethod === 'center' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md' : 'bg-white dark:bg-slate-800'}`}
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-600">
                <MapPin size={24} />
              </div>
              <span className="font-bold">{language === 'ar' ? 'ادفع فالمركز' : 'Pay at Center'}</span>
            </button>
            <button
              onClick={() => setSelectedMethod('cash')}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${selectedMethod === 'cash' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md' : 'bg-white dark:bg-slate-800'}`}
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-600">
                <CreditCard size={24} />
              </div>
              <span className="font-bold">{language === 'ar' ? 'كاش' : 'Cash'}</span>
            </button>
          </div>
        </div>

        {selectedMethod === 'bank' && (
          <div className="bg-slate-900 text-white p-8 rounded-[40px] border border-blue-500/30 shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Wallet size={20} />
                </div>
                <h3 className="text-xl font-orbitron font-black">{language === 'ar' ? 'تفاصيل التحويل البنكي' : 'BANK TRANSFER DETAILS'}</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] opacity-40 uppercase tracking-widest mb-1">{language === 'ar' ? 'البنك' : 'BANK'}</p>
                  <p className="font-bold text-lg">{language === 'ar' ? 'بنك الراجحي' : 'Al Rajhi Bank'}</p>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] opacity-40 uppercase tracking-widest mb-1">{language === 'ar' ? 'رقم الحساب (IBAN)' : 'IBAN'}</p>
                  <p className="font-mono font-bold text-lg select-all">SA09 8000 0507 6080 1666 6669</p>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] opacity-40 uppercase tracking-widest mb-1">{language === 'ar' ? 'اسم المستفيد' : 'BENEFICIARY'}</p>
                  <p className="font-bold text-lg">فيصل سعيد السني</p>
                </div>

                <div className="flex items-start gap-3 bg-blue-600/20 p-4 rounded-2xl border border-blue-500/30">
                  <ShieldCheck className="text-blue-400 shrink-0" size={20} />
                  <p className="text-xs font-bold leading-relaxed opacity-90">
                    {language === 'ar'
                      ? 'يجب تحويل المبلغ للحساب الظاهر أعلاه وارفاق إيصال التحويل عبر الواتساب لتأكيد طلبك.'
                      : 'Transfer the amount to the account above and attach the receipt via WhatsApp to confirm.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Ticket size={18} /> {language === 'ar' ? 'هل لديك كود خصم؟' : 'Have a coupon?'}</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="JED20"
              className="flex-1 p-4 rounded-2xl border dark:bg-slate-800 focus:ring-2 ring-blue-500 outline-none"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
            />
            <button
              onClick={handleApplyCoupon}
              className="bg-blue-600 text-white px-8 rounded-2xl font-bold hover:bg-blue-700 transition-colors"
            >
              {t.ar ? 'تطبيق' : 'Apply'}
            </button>
          </div>
          {appliedCoupon && (
            <p className="mt-3 text-green-600 font-bold text-sm">✓ تم تطبيق الخصم</p>
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border sticky top-24 space-y-6">
          <h3 className="text-xl font-bold">{language === 'ar' ? 'ملخص الفاتورة' : 'Bill Summary'}</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="opacity-50">{t.servicePrice}</span>
              <span className="font-bold">{basePrice} {t.sar}</span>
            </div>
            {user?.is_premium && (
              <div className="flex justify-between text-amber-600">
                <span className="flex items-center gap-1 font-bold">-{t.premium} 15%</span>
                <span className="font-bold">-{premiumDiscount} {t.sar}</span>
              </div>
            )}
            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span className="font-bold">-{t.discount}</span>
                <span className="font-bold">-{couponDiscount} {t.sar}</span>
              </div>
            )}
            <div className="h-[1px] bg-slate-100 dark:bg-slate-700 my-4"></div>
            <div className="flex justify-between text-2xl">
              <span className="font-black">{t.total}</span>
              <span className="font-black text-blue-600">{total} {t.sar}</span>
            </div>
          </div>

          <button
            onClick={confirmPayment}
            className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-xl shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            {t.payNow}
          </button>

          <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
            <p className="text-[10px] opacity-40 leading-relaxed">بضغطك على تأكيد الطلب، أنت توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بـ JedDrive.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
