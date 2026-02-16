
import React, { useState } from 'react';
import { useStore } from '../store';
import { translations } from '../translations';
import {
  Users,
  Truck,
  Ticket,
  ShieldCheck,
  Activity,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Wallet,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Settings,
  X
} from 'lucide-react';
import { Coupon, Provider, ProviderService } from '../types';

const AdminDashboard: React.FC = () => {
  const { language, providers, coupons, toggleCoupon, addCoupon, updateProvider, addProvider, user: currentUser, orders } = useStore();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'stats' | 'providers' | 'marketing' | 'approvals' | 'coupons' | 'debts' | 'orders'>('stats');

  // Manual Add Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProv, setNewProv] = useState<Partial<Provider>>({
    business_name: '',
    service_type: 'Repair',
    city: 'Jeddah',
    lat: 21.5,
    lng: 39.2,
    image_url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=300',
    services_list: [{ id: '1', name: 'خدمة أساسية', price: 150 }]
  });

  const [newCoupon, setNewCoupon] = useState({ code: '', val: 0, type: 'percent' as 'percent' | 'fixed' });

  const stats = [
    { label: t.users, val: '1,284', icon: <Users />, color: 'blue' },
    { label: t.active + ' ' + t.providers, val: providers.filter(p => p.status === 'active').length.toString(), icon: <Truck />, color: 'green' },
    { label: language === 'ar' ? 'إجمالي العمولات' : 'Total Commissions', val: '24,500 ر.س', icon: <Activity />, color: 'purple' },
    { label: language === 'ar' ? 'ديون مستحقة' : 'Owed Debts', val: providers.reduce((acc, p) => acc + p.debt_balance, 0).toString() + ' ر.س', icon: <AlertTriangle />, color: 'red' },
  ];

  const handleCreateProvider = () => {
    if (!newProv.business_name) return;
    const p: Provider = {
      ...newProv as Provider,
      id: 'p-' + Math.random().toString(36).substr(2, 5),
      user_id: 'u-' + Math.random().toString(36).substr(2, 5),
      status: 'active',
      is_online: true,
      rating: 5.0,
      debt_balance: 0,
      credit_limit: 500
    };
    addProvider(p);
    setShowAddForm(false);
    alert(language === 'ar' ? 'تمت إضافة المركز بنجاح' : 'Provider added successfully');
  };

  const addServiceField = () => {
    const updatedServices = [...(newProv.services_list || []), { id: Math.random().toString(), name: '', price: 0 }];
    setNewProv({ ...newProv, services_list: updatedServices });
  };

  const handleServiceChange = (idx: number, field: keyof ProviderService, val: string | number) => {
    const updated = [...(newProv.services_list || [])];
    updated[idx] = { ...updated[idx], [field]: val };
    setNewProv({ ...newProv, services_list: updated });
  };

  const updateExistingServicePrice = (pId: string, sId: string, newPrice: number) => {
    const provider = providers.find(p => p.id === pId);
    if (!provider) return;
    const updatedServices = provider.services_list.map(s => s.id === sId ? { ...s, price: newPrice } : s);
    updateProvider(pId, { services_list: updatedServices });
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black flex items-center gap-3">
            <ShieldCheck className="text-blue-600" />
            {language === 'ar' ? `لوحة الإدارة (${currentUser?.name})` : `Admin Dashboard (${currentUser?.name})`}
          </h2>
          <p className="text-xs opacity-50 font-black mt-1 uppercase tracking-widest">JedDrive Superior Access</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {['stats', 'providers', 'orders', 'marketing', 'approvals', 'coupons', 'debts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-2xl font-black whitespace-nowrap transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' : 'bg-white dark:bg-slate-800 border hover:bg-slate-50'
                }`}
            >
              {t[tab as keyof typeof t] || (tab === 'marketing' ? (language === 'ar' ? 'التسويق' : 'Marketing') : tab)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 dark:bg-blue-900/30`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs opacity-50 font-black uppercase tracking-wider">{s.label}</p>
                <p className="text-3xl font-black">{s.val}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black">{t.providers}</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
            >
              {showAddForm ? <X size={18} /> : <Plus size={18} />}
              {showAddForm ? (language === 'ar' ? 'إلغاء' : 'Cancel') : t.addProviderManual}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border-4 border-blue-500 animate-in zoom-in duration-300 shadow-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-50">{t.businessName}</label>
                  <input
                    placeholder="مثلاً: مركز صيانة جدة"
                    className="w-full p-4 rounded-2xl border dark:bg-slate-900 outline-none focus:ring-2 ring-blue-500"
                    onChange={(e) => setNewProv({ ...newProv, business_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-50">{language === 'ar' ? 'التصنيف' : 'Category'}</label>
                  <select
                    className="w-full p-4 rounded-2xl border dark:bg-slate-900 outline-none focus:ring-2 ring-blue-500"
                    onChange={(e) => setNewProv({ ...newProv, service_type: e.target.value as any })}
                  >
                    <option value="Repair">{t.repair}</option>
                    <option value="Wash">{t.wash}</option>
                    <option value="Tinting">{t.tinting}</option>
                    <option value="Tow">{t.towing}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-50">{t.uploadPhoto} URL</label>
                  <input
                    placeholder="رابط صورة المركز"
                    className="w-full p-4 rounded-2xl border dark:bg-slate-900 outline-none"
                    onChange={(e) => setNewProv({ ...newProv, image_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-50">{t.locationCoords}</label>
                  <div className="flex gap-4">
                    <input placeholder="Lat (21.5)" className="flex-1 p-4 rounded-2xl border dark:bg-slate-900" onChange={(e) => setNewProv({ ...newProv, lat: parseFloat(e.target.value) })} />
                    <input placeholder="Lng (39.2)" className="flex-1 p-4 rounded-2xl border dark:bg-slate-900" onChange={(e) => setNewProv({ ...newProv, lng: parseFloat(e.target.value) })} />
                  </div>
                </div>
              </div>

              {/* Service Pricing Manager */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-black text-lg">{t.servicePrice}</h5>
                  <button onClick={addServiceField} className="text-blue-600 font-bold flex items-center gap-1 text-sm bg-blue-50 px-3 py-1 rounded-lg">
                    <Plus size={14} /> {language === 'ar' ? 'أضف خدمة' : 'Add Service'}
                  </button>
                </div>
                <div className="space-y-3">
                  {newProv.services_list?.map((s, idx) => (
                    <div key={s.id} className="flex gap-4">
                      <input
                        placeholder="اسم الخدمة"
                        className="flex-1 p-3 rounded-xl border dark:bg-slate-900"
                        onChange={(e) => handleServiceChange(idx, 'name', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="السعر"
                        className="w-32 p-3 rounded-xl border dark:bg-slate-900"
                        onChange={(e) => handleServiceChange(idx, 'price', parseInt(e.target.value))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateProvider}
                className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all"
              >
                {t.save}
              </button>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 text-sm">
                <tr>
                  <th className="px-6 py-4 font-black">{language === 'ar' ? 'المركز / الورشة' : 'Provider'}</th>
                  <th className="px-6 py-4 font-black">{t.servicePrice}</th>
                  <th className="px-6 py-4 font-black">{t.viewOnMap}</th>
                  <th className="px-6 py-4 font-black">{language === 'ar' ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={p.image_url} className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-slate-100" />
                        <div>
                          <p className="font-black text-lg leading-tight">{p.business_name}</p>
                          <p className="text-[10px] opacity-40 font-black uppercase tracking-widest mt-1">{p.service_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {p.services_list.map(s => (
                          <div key={s.id} className="flex items-center gap-2">
                            <span className="text-[10px] font-bold opacity-60 min-w-[70px] truncate">{s.name}:</span>
                            <div className="relative">
                              <input
                                type="number"
                                value={s.price}
                                onChange={(e) => updateExistingServicePrice(p.id, s.id, parseInt(e.target.value))}
                                className="w-20 p-1.5 border rounded-lg text-xs text-center font-black focus:ring-2 ring-blue-300 outline-none"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] opacity-30 font-bold uppercase">ر.س</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`https://www.google.com/maps?q=${p.lat},${p.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-blue-100 font-bold w-fit"
                      >
                        <MapPin size={12} /> {p.lat.toFixed(2)}, {p.lng.toFixed(2)}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateProvider(p.id, { status: p.status === 'active' ? 'blocked' : 'active' })}
                          className={`px-4 py-2 rounded-xl font-black text-xs transition-all ${p.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                        >
                          {p.status === 'active' ? t.ar ? 'حظر' : 'Block' : t.ar ? 'تفعيل' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Global Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-xl border overflow-hidden">
            <div className="p-8 border-b dark:border-slate-700">
              <h3 className="text-2xl font-black text-blue-600 flex items-center gap-3">
                <ShieldCheck /> {language === 'ar' ? 'سجل العمليات الكلي' : 'Global Operations Log'}
              </h3>
              <p className="text-xs opacity-50 font-bold mt-1 uppercase tracking-widest">Real-time order monitoring across the city</p>
            </div>
            <table className="w-full text-right">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">رقم الطلب</th>
                  <th className="px-8 py-4">الخدمة</th>
                  <th className="px-8 py-4">الحالة</th>
                  <th className="px-8 py-4">القيمة</th>
                  <th className="px-8 py-4">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center opacity-30 font-black">
                      {language === 'ar' ? 'لا توجد عمليات مسجلة حالياً' : 'No operations recorded yet'}
                    </td>
                  </tr>
                ) : (
                  orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-8 py-6 font-mono text-xs font-black opacity-60">#{o.id.slice(0, 8)}</td>
                      <td className="px-8 py-6 font-black text-lg">{o.service_name}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${o.status === 'completed' ? 'bg-green-100 text-green-700' :
                          o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700 animate-pulse'
                          }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-xl text-blue-600">{o.total_price} {t.sar}</td>
                      <td className="px-8 py-6 text-xs opacity-50 font-bold">{new Date(o.created_at).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Marketing Tab (Banner & Ticker) */}
      {activeTab === 'marketing' && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border shadow-2xl space-y-4">
            <h4 className="font-black text-xl flex items-center gap-2 text-blue-600"><ImageIcon /> {language === 'ar' ? 'إدارة البانر الإعلاني' : 'Banner Management'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-sm opacity-60 font-medium">
                  {language === 'ar'
                    ? 'قم بتغيير صورة العرض الرئيسية في الصفحة الرئيسية للتطبيق.'
                    : 'Change the main promo banner on the home page.'}
                </p>
                <div className="space-y-2">
                  <label className="text-xs font-black opacity-40 uppercase tracking-widest">{language === 'ar' ? 'رابط الصورة' : 'Image URL'}</label>
                  <input
                    className="w-full p-4 rounded-2xl border dark:bg-slate-900 font-bold outline-none focus:ring-2 ring-blue-500"
                    placeholder="https://..."
                    value={useStore.getState().bannerUrl}
                    onChange={(e) => useStore.getState().setBannerUrl(e.target.value)}
                  />
                </div>
              </div>
              <div className="relative h-48 rounded-3xl overflow-hidden shadow-inner border bg-slate-50">
                <img src={useStore.getState().bannerUrl} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border shadow-2xl space-y-4">
            <h4 className="font-black text-xl flex items-center gap-2 text-blue-600"><AlertTriangle /> {language === 'ar' ? 'إدارة الشريط المتحرك (Ticker)' : 'Scrolling Ticker Control'}</h4>
            <div className="space-y-4">
              <p className="text-sm opacity-60 font-medium">
                {language === 'ar'
                  ? 'هذا النص سيظهر كشريط متحرك في أعلى الصفحة الرئيسية.'
                  : 'This text will appear as a scrolling marquee at the top of the home page.'}
              </p>
              <div className="space-y-2">
                <label className="text-xs font-black opacity-40 uppercase tracking-widest">{language === 'ar' ? 'نص الإعلان' : 'Announcement Text'}</label>
                <textarea
                  className="w-full p-4 rounded-2xl border dark:bg-slate-900 font-bold outline-none focus:ring-2 ring-blue-500 min-h-[100px]"
                  placeholder="..."
                  value={useStore.getState().scrollingTicker}
                  onChange={(e) => useStore.getState().setScrollingTicker(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'debts' && (
        <div className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border-2 border-amber-200 flex items-center gap-4 text-amber-700">
            <AlertTriangle className="animate-pulse" />
            <div className="text-sm">
              <p className="font-black">{language === 'ar' ? 'نظام الحظر المالي التلقائي' : 'Automatic Debt Blocking'}</p>
              <p>{language === 'ar' ? 'أي مركز يتجاوز مديونيته 500 ريال يتم تقييد ظهوره في التطبيق.' : 'Centers exceeding 500 SAR debt are restricted automatically.'}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border shadow-xl">
            <table className="w-full text-right">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-black">المزود</th>
                  <th className="px-6 py-4 font-black">المديونية</th>
                  <th className="px-6 py-4 font-black">الحالة</th>
                  <th className="px-6 py-4 font-black">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {providers.map(p => (
                  <tr key={p.id} className={p.debt_balance >= p.credit_limit ? 'bg-red-50/30' : ''}>
                    <td className="px-6 py-4 font-black text-lg">{p.business_name}</td>
                    <td className="px-6 py-4">
                      <span className={`font-black text-xl ${p.debt_balance >= p.credit_limit ? 'text-red-600 animate-pulse' : 'text-slate-600'}`}>
                        {p.debt_balance} {t.sar}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.debt_balance >= p.credit_limit ? (
                        <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg shadow-red-500/20">محظور فوراً</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">نشط / سليم</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => updateProvider(p.id, { debt_balance: 0 })}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        {language === 'ar' ? 'تسوية المديونية' : 'Settle Debt'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Coupons Tab Management */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border shadow-2xl space-y-4">
            <h4 className="font-black text-xl flex items-center gap-2"><Ticket className="text-blue-600" /> {language === 'ar' ? 'إنشاء كوبون جديد' : 'New Coupon'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                placeholder="الكود (مثلاً: JED50)"
                className="p-4 rounded-2xl border dark:bg-slate-900 font-black uppercase"
                value={newCoupon.code}
                onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
              />
              <input
                type="number"
                placeholder="القيمة"
                className="p-4 rounded-2xl border dark:bg-slate-900 font-black"
                value={newCoupon.val}
                onChange={e => setNewCoupon({ ...newCoupon, val: parseInt(e.target.value) })}
              />
              <select
                className="p-4 rounded-2xl border dark:bg-slate-900 font-bold"
                value={newCoupon.type}
                onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
              >
                <option value="percent">نسبة %</option>
                <option value="fixed">مبلغ ر.س</option>
              </select>
              <button
                onClick={() => {
                  if (!newCoupon.code) return;
                  addCoupon({
                    id: Math.random().toString(),
                    code: newCoupon.code.toUpperCase(),
                    discount_value: newCoupon.val,
                    type: newCoupon.type,
                    is_active: true,
                    expiry_date: '2025-12-31',
                    max_uses: 100,
                    current_uses: 0
                  });
                  setNewCoupon({ code: '', val: 0, type: 'percent' });
                }}
                className="bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 active:scale-95 transition-all"
              >
                {t.save}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coupons.map(c => (
              <div key={c.id} className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border shadow-sm relative group overflow-hidden">
                {!c.is_active && <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-[1px] z-10"></div>}
                <div className="flex justify-between items-start mb-6 relative z-20">
                  <span className={`text-4xl font-black tracking-tighter uppercase ${c.is_active ? 'text-blue-600' : 'text-slate-400'}`}>{c.code}</span>
                  <button onClick={() => toggleCoupon(c.id)} className="hover:scale-110 transition-transform">
                    {c.is_active ? <ToggleRight size={44} className="text-blue-600" /> : <ToggleLeft size={44} className="text-slate-300" />}
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black pt-4 border-t opacity-40 uppercase tracking-widest relative z-20">
                  <span>{c.discount_value}{c.type === 'percent' ? '%' : ' ر.س'}</span>
                  <span>{language === 'ar' ? 'الاستخدام:' : 'Uses:'} {c.current_uses}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
