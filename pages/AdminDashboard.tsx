
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
  X,
  Star,
  FileText
} from 'lucide-react';
import { Coupon, Provider, ProviderService } from '../types';

const AdminDashboard: React.FC = () => {
  const { language, providers, coupons, toggleCoupon, addCoupon, updateProvider, addProvider, user: currentUser, orders, updateExistingServicePrice, providerRequests, submitProviderRequest } = useStore();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'stats' | 'providers' | 'marketing' | 'approvals' | 'coupons' | 'debts' | 'orders'>('stats');

  // Manual Add/Edit Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProviderId, setEditingProviderId] = useState<string | null>(null);
  const [tempProv, setTempProv] = useState<Partial<Provider>>({
    business_name: '',
    service_type: 'Repair',
    city: 'Jeddah',
    google_maps_url: '',
    image_url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=300',
    services_list: [{ id: '1', name: 'خدمة أساسية', price: 150 }],
    driver_name: '',
    driver_phone: ''
  });

  const [newCoupon, setNewCoupon] = useState({ code: '', val: 0, type: 'percent' as 'percent' | 'fixed' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const triggerSaveFeedback = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const stats = [
    { label: t.users, val: '1,284', icon: <Users />, color: 'blue' },
    { label: t.active + ' ' + t.providers, val: providers.filter(p => p.status === 'active').length.toString(), icon: <Truck />, color: 'green' },
    { label: language === 'ar' ? 'إجمالي العمولات' : 'Total Commissions', val: '24,500 ر.س', icon: <Activity />, color: 'purple' },
    { label: language === 'ar' ? 'ديون مستحقة' : 'Owed Debts', val: providers.reduce((acc, p) => acc + p.debt_balance, 0).toString() + ' ر.س', icon: <AlertTriangle />, color: 'red' },
  ];

  const handleSaveProvider = () => {
    if (!tempProv.business_name) return;

    if (editingProviderId) {
      updateProvider(editingProviderId, tempProv);
      setEditingProviderId(null);
      setShowAddForm(false);
      triggerSaveFeedback();
    } else {
      const p: Provider = {
        ...tempProv as Provider,
        id: 'p-' + Math.random().toString(36).substr(2, 5),
        user_id: 'u-' + Math.random().toString(36).substr(2, 5),
        status: 'active',
        is_online: true,
        is_featured: tempProv.is_featured || false,
        rating: 5.0,
        debt_balance: 0,
        credit_limit: 500
      };
      addProvider(p);
      setShowAddForm(false);
      triggerSaveFeedback();
    }
  };

  const addServiceField = () => {
    const updatedServices = [...(tempProv.services_list || []), { id: Math.random().toString(), name: '', price: 0 }];
    setTempProv({ ...tempProv, services_list: updatedServices });
  };

  const handleServiceChange = (idx: number, field: keyof ProviderService, val: string | number) => {
    const updated = [...(tempProv.services_list || [])];
    updated[idx] = { ...updated[idx], [field]: val };
    setTempProv({ ...tempProv, services_list: updated });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for localStorage
        alert(language === 'ar' ? 'الصورة كبيرة جداً، يرجى اختيار صورة أقل من 1 ميجابايت' : 'Image is too large, please choose a file under 1MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProv({ ...tempProv, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for banner
        alert(language === 'ar' ? 'حجم البانر كبير جداً' : 'Banner image is too large');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        useStore.getState().setBannerUrl(reader.result as string);
        triggerSaveFeedback();
      };
      reader.readAsDataURL(file);
    }
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
                    value={tempProv.business_name}
                    onChange={(e) => setTempProv({ ...tempProv, business_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-50">{language === 'ar' ? 'التصنيف' : 'Category'}</label>
                  <select
                    className="w-full p-4 rounded-2xl border dark:bg-slate-900 outline-none focus:ring-2 ring-blue-500"
                    value={tempProv.service_type}
                    onChange={(e) => setTempProv({ ...tempProv, service_type: e.target.value as any })}
                  >
                    <option value="Repair">{t.repair}</option>
                    <option value="Wash">{t.wash}</option>
                    <option value="Tinting">{t.tinting}</option>
                    <option value="Tow">{t.towing}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-50">{t.uploadPhoto}</label>
                  <div className="relative group cursor-pointer h-16 w-full border-2 border-dashed border-blue-500/30 rounded-2xl flex items-center justify-center hover:border-blue-500 transition-all overflow-hidden bg-blue-50/5">
                    {tempProv.image_url && (
                      <img src={tempProv.image_url} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={handleFileUpload}
                    />
                    <div className="flex items-center gap-2 text-blue-600 font-black text-xs z-20">
                      <ImageIcon size={18} />
                      {tempProv.image_url ? (language === 'ar' ? 'تغيير الصورة' : 'Change Photo') : (language === 'ar' ? 'ارفع صورة المركز' : 'Upload Photo')}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-50">{language === 'ar' ? 'رابط قوقل ماب' : 'Google Maps URL'}</label>
                  <input
                    placeholder="https://..."
                    value={tempProv.google_maps_url}
                    className="w-full p-4 rounded-2xl border dark:bg-slate-900 outline-none focus:ring-2 ring-blue-500"
                    onChange={(e) => setTempProv({ ...tempProv, google_maps_url: e.target.value })}
                  />
                </div>
                {tempProv.service_type === 'Tow' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold opacity-50 text-blue-600 font-black">{language === 'ar' ? 'اسم السائق' : 'Driver Name'}</label>
                      <input
                        placeholder={language === 'ar' ? 'محمد علي' : 'Driver Name'}
                        className="w-full p-4 rounded-2xl border-2 border-blue-100 dark:bg-slate-900 outline-none focus:ring-2 ring-blue-500"
                        value={tempProv.driver_name}
                        onChange={(e) => setTempProv({ ...tempProv, driver_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold opacity-50 text-blue-600 font-black">{language === 'ar' ? 'رقم جوال السائق' : 'Driver Phone'}</label>
                      <input
                        placeholder="05..."
                        className="w-full p-4 rounded-2xl border-2 border-blue-100 dark:bg-slate-900 outline-none focus:ring-2 ring-blue-500"
                        value={tempProv.driver_phone}
                        onChange={(e) => setTempProv({ ...tempProv, driver_phone: e.target.value })}
                      />
                    </div>
                  </>
                )}
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
                  {tempProv.services_list?.map((s, idx) => (
                    <div key={s.id} className="flex gap-4">
                      <input
                        placeholder="اسم الخدمة"
                        className="flex-1 p-3 rounded-xl border dark:bg-slate-900"
                        value={s.name}
                        onChange={(e) => handleServiceChange(idx, 'name', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="السعر"
                        className="w-32 p-3 rounded-xl border dark:bg-slate-900"
                        value={s.price}
                        onChange={(e) => handleServiceChange(idx, 'price', parseInt(e.target.value))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveProvider}
                className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all"
              >
                {t.save}
              </button>
            </div>
          )}

          <div className="hidden md:block bg-white dark:bg-slate-800 rounded-3xl shadow-xl border overflow-hidden">
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
                      {p.google_maps_url ? (
                        <a
                          href={p.google_maps_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-blue-100 font-bold w-fit"
                        >
                          <MapPin size={12} /> {language === 'ar' ? 'عرض على الماب' : 'View on Map'}
                        </a>
                      ) : p.lat && p.lng ? (
                        <a
                          href={`https://www.google.com/maps?q=${p.lat},${p.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-blue-100 font-bold w-fit"
                        >
                          <MapPin size={12} /> {p.lat.toFixed(2)}, {p.lng.toFixed(2)}
                        </a>
                      ) : (
                        <span className="text-[10px] opacity-30 font-bold italic">{language === 'ar' ? 'لا يوجد موقع' : 'No Location'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateProvider(p.id, { is_featured: !p.is_featured })}
                          className={`p-2 rounded-xl transition-all ${p.is_featured ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400 hover:text-orange-600'}`}
                          title={language === 'ar' ? 'تمييز المركز' : 'Feature Center'}
                        >
                          <Star size={16} fill={p.is_featured ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingProviderId(p.id);
                            setTempProv(p);
                            setShowAddForm(true);
                          }}
                          className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black text-xs hover:bg-blue-100 transition-all"
                        >
                          {language === 'ar' ? 'تعديل' : 'Edit'}
                        </button>
                        <button
                          onClick={() => updateProvider(p.id, { status: p.status === 'active' ? 'blocked' : 'active' })}
                          className={`px-4 py-2 rounded-xl font-black text-xs transition-all ${p.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                        >
                          {p.status === 'active' ? (language === 'ar' ? 'حظر' : 'Block') : (language === 'ar' ? 'تفعيل' : 'Activate')}
                        </button>
                        <button
                          onClick={() => useStore.getState().deleteProvider(p.id)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Provider Cards */}
          <div className="md:hidden space-y-4">
            {providers.map((p) => (
              <div key={p.id} className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border shadow-lg space-y-4">
                <div className="flex items-center gap-4">
                  <img src={p.image_url} className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-100" />
                  <div>
                    <h5 className="font-black text-lg leading-tight">{p.business_name}</h5>
                    <p className="text-[10px] opacity-40 font-black uppercase tracking-widest mt-1">{p.service_type}</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl space-y-3">
                  <h6 className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">{t.servicePrice}</h6>
                  {p.services_list.map(s => (
                    <div key={s.id} className="flex items-center justify-between">
                      <span className="text-xs font-bold opacity-60">{s.name}</span>
                      <div className="relative">
                        <input
                          type="number"
                          value={s.price}
                          onChange={(e) => updateExistingServicePrice(p.id, s.id, parseInt(e.target.value))}
                          className="w-16 p-1.5 border rounded-lg text-[10px] text-center font-black focus:ring-2 ring-blue-300 outline-none"
                        />
                        <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-[8px] opacity-30 font-bold uppercase">ر.س</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => updateProvider(p.id, { is_featured: !p.is_featured })}
                    className={`p-3 rounded-2xl transition-all ${p.is_featured ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}
                  >
                    <Star size={18} fill={p.is_featured ? 'currentColor' : 'none'} />
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProviderId(p.id);
                        setTempProv(p);
                        setShowAddForm(true);
                      }}
                      className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black text-[10px] hover:bg-blue-100"
                    >
                      {language === 'ar' ? 'تعديل' : 'Edit'}
                    </button>
                    <button
                      onClick={() => updateProvider(p.id, { status: p.status === 'active' ? 'blocked' : 'active' })}
                      className={`px-4 py-2 rounded-xl font-black text-[10px] transition-all ${p.status === 'active' ? 'bg-red-50 text-red-600' : 'bg-green-600 text-white'}`}
                    >
                      {p.status === 'active' ? (language === 'ar' ? 'حظر' : 'Block') : (language === 'ar' ? 'تفعيل' : 'Activate')}
                    </button>
                  </div>
                  <button
                    onClick={() => useStore.getState().deleteProvider(p.id)}
                    className="p-2 text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div >
      )}
      {/* Global Orders Tab */}
      {
        activeTab === 'orders' && (
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
        )
      }
      {/* Marketing Tab (Banner & Ticker) */}
      {
        activeTab === 'marketing' && (
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
                  <div className="space-y-4">
                    <label className="text-xs font-black opacity-40 uppercase tracking-widest">{language === 'ar' ? 'رفع البانر الجديد' : 'Upload New Banner'}</label>
                    <div className="relative group cursor-pointer h-24 w-full border-4 border-dashed border-blue-500/30 rounded-3xl flex items-center justify-center hover:border-blue-500 transition-all overflow-hidden bg-blue-50/5">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={handleBannerUpload}
                      />
                      <div className="flex flex-col items-center gap-2 text-blue-600 font-black z-20">
                        <ImageIcon size={32} />
                        <span className="text-sm">{language === 'ar' ? 'اختر ملف الصورة من جهازك' : 'Choose Image File'}</span>
                      </div>
                    </div>
                    <p className="text-[10px] opacity-40 font-bold text-center">
                      {language === 'ar' ? 'سيتم ضغط وتحديث الصورة فوراً على الموقع' : 'Image will be compressed and updated instantly on the site'}
                    </p>
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
                <div className="space-y-4">
                  <label className="text-xs font-black opacity-40 uppercase tracking-widest">{language === 'ar' ? 'نص الإعلان' : 'Announcement Text'}</label>
                  <textarea
                    className="w-full p-4 rounded-2xl border dark:bg-slate-900 font-bold outline-none focus:ring-2 ring-blue-500 min-h-[100px]"
                    placeholder="..."
                    defaultValue={useStore.getState().scrollingTicker}
                    id="ticker-text-input"
                  />
                  <button
                    onClick={() => {
                      const val = (document.getElementById('ticker-text-input') as HTMLTextAreaElement).value;
                      useStore.getState().setScrollingTicker(val);
                      triggerSaveFeedback();
                    }}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all"
                  >
                    {language === 'ar' ? 'حفظ النص وتطبيقه فورا' : 'Save & Apply Immediately'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Join Requests (Approvals) Tab */}
      {
        activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[40px] shadow-xl border overflow-hidden">
              <div className="p-8 border-b dark:border-slate-700 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-blue-600 flex items-center gap-3">
                    <FileText /> {language === 'ar' ? 'طلبات الانضمام الجديدة' : 'New Join Requests'}
                  </h3>
                  <p className="text-xs opacity-50 font-bold mt-1 uppercase tracking-widest">Review and activate new service providers</p>
                </div>
                <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg">
                  {providerRequests.length} {language === 'ar' ? 'طلب معلق' : 'Pending'}
                </div>
              </div>

              {providerRequests.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto opacity-20">
                    <CheckCircle2 size={40} />
                  </div>
                  <p className="font-black text-slate-400 uppercase tracking-widest text-sm">
                    {language === 'ar' ? 'لا توجد طلبات جديدة حالياً' : 'All caught up! No pending requests.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                  {providerRequests.map(req => (
                    <div key={req.id} className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-4 group">
                      <div className="flex justify-between items-start">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl border flex items-center justify-center overflow-hidden shadow-sm">
                          {req.photo ? (
                            <img src={req.photo} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="opacity-20" />
                          )}
                        </div>
                        <span className="text-[8px] font-black opacity-30 uppercase tracking-tighter">{new Date(req.created_at).toLocaleDateString()}</span>
                      </div>

                      <div>
                        <h4 className="font-black text-xl leading-tight mb-1">{req.business_name}</h4>
                        <div className="flex gap-2 items-center text-[10px] font-bold opacity-60">
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md uppercase">{req.service_type}</span>
                          <span>•</span>
                          <span>{req.cr_number}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-black p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <Users size={14} className="opacity-40" />
                        <span>{req.contact_number}</span>
                      </div>

                      <div className="pt-4 flex gap-2">
                        <button
                          onClick={() => {
                            // Approve Logic: Convert Request to Provider
                            const newProv: Provider = {
                              id: `prov_${Date.now()}`,
                              user_id: `user_${Date.now()}`,
                              business_name: req.business_name,
                              service_type: req.service_type as any,
                              city: 'Jeddah',
                              status: 'active',
                              is_online: true,
                              rating: 4.8,
                              debt_balance: 0,
                              credit_limit: 500,
                              cr_number: req.cr_number,
                              image_url: req.photo || 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=300',
                              services_list: [{ id: '1', name: 'خدمة أساسية', price: 150 }]
                            };
                            addProvider(newProv);
                            // Remove from requests
                            useStore.setState((state) => ({
                              providerRequests: state.providerRequests.filter(r => r.id !== req.id)
                            }));
                            triggerSaveFeedback();
                          }}
                          className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-green-500/20 hover:scale-[1.02] transition-all"
                        >
                          {language === 'ar' ? 'قبول وتفعيل' : 'Approve & Activate'}
                        </button>
                        <button
                          onClick={() => {
                            useStore.setState((state) => ({
                              providerRequests: state.providerRequests.filter(r => r.id !== req.id)
                            }));
                            triggerSaveFeedback();
                          }}
                          className="px-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase hover:bg-red-100 transition-colors"
                        >
                          {language === 'ar' ? 'رفض' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* Persistence Feedback Overlays */}
      {
        isSaving && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-blue-500/30 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-black text-sm uppercase tracking-widest">{language === 'ar' ? 'جاري الحفظ والتطبيق...' : 'Saving & Applying...'}</p>
            </div>
          </div>
        )
      }

      {
        saveSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 duration-500">
            <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white/20">
              <CheckCircle2 size={24} />
              <span className="font-black uppercase tracking-widest text-xs">
                {language === 'ar' ? 'تم الحفظ والتحديث على الموقع بنجاح' : 'Saved & Updated Globally Successfully'}
              </span>
            </div>
          </div>
        )
      }

      {
        activeTab === 'debts' && (
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
        )
      }

      {/* Coupons Tab Management */}
      {
        activeTab === 'coupons' && (
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
                    <button onClick={() => {
                      toggleCoupon(c.id);
                      triggerSaveFeedback();
                    }} className="hover:scale-110 transition-transform">
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
        )
      }
    </div >
  );
};

export default AdminDashboard;
