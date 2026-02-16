
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { translations } from '../translations';
import { ArrowRight, Upload, Briefcase, FileText, Image as ImageIcon, Camera } from 'lucide-react';
import { ProviderRequest } from '../types';

const ProviderSignup: React.FC = () => {
  const { language, submitProviderRequest } = useStore();
  const navigate = useNavigate();
  const t = translations[language];

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    cr_number: '',
    service_type: 'Tow',
    contact_number: ''
  });
  const [photo, setPhoto] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const request: ProviderRequest = {
      id: `req_${Date.now()}`,
      ...formData,
      photo: photo || undefined,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    submitProviderRequest(request);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <FileText size={48} />
        </div>
        <h2 className="text-3xl font-black">{t.ar ? 'تم استلام طلبك!' : 'Request Received!'}</h2>
        <p className="text-slate-500 max-w-md">
          {t.ar
            ? 'سيقوم فريق JedDrive بمراجعة بياناتك والرد عليك خلال 24 ساعة لتفعيل حسابك.'
            : 'The JedDrive team will review your data and respond within 24 hours to activate your account.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold"
        >
          {t.ar ? 'العودة للرئيسية' : 'Back to Home'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600">
        <ArrowRight size={18} className={language === 'ar' ? '' : 'rotate-180'} /> {t.ar ? 'عودة' : 'Back'}
      </button>

      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black">{t.joinAsProvider}</h2>
        <p className="opacity-50">{t.ar ? 'انضم لأكبر شبكة خدمات سيارات في جدة' : 'Join the largest car service network in Jeddah'}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold opacity-60 px-1">{t.businessName}</label>
            <input
              required
              type="text"
              placeholder="مثلاً: ورشة الأمانة"
              className="w-full p-4 rounded-2xl border dark:bg-slate-900 dark:border-slate-700"
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold opacity-60 px-1">{t.crNumber}</label>
            <input
              required
              type="text"
              placeholder="1010XXXXXX"
              className="w-full p-4 rounded-2xl border dark:bg-slate-900 dark:border-slate-700"
              value={formData.cr_number}
              onChange={(e) => setFormData({ ...formData, cr_number: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold opacity-60 px-1">{t.ar ? 'نوع الخدمة' : 'Service Type'}</label>
            <select
              className="w-full p-4 rounded-2xl border dark:bg-slate-900 dark:border-slate-700"
              value={formData.service_type}
              onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
            >
              <option value="Tow">{t.towing}</option>
              <option value="Wash">{t.wash}</option>
              <option value="Repair">{t.repair}</option>
              <option value="Tinting">{t.tinting}</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold opacity-60 px-1">{t.ar ? 'رقم التواصل' : 'Contact Number'}</label>
            <input
              required
              type="tel"
              placeholder="05XXXXXXXX"
              className="w-full p-4 rounded-2xl border dark:bg-slate-900 dark:border-slate-700"
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold opacity-60 px-1">{t.uploadPhoto}</label>
          <input
            type="file"
            accept="image/*"
            id="cr-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="cr-upload"
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-10 flex flex-col items-center gap-4 hover:border-blue-500 transition-colors cursor-pointer group relative overflow-hidden"
          >
            {photo ? (
              <>
                <img src={photo} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="uploaded-preview" />
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center relative z-10 shadow-lg">
                  <ImageIcon size={30} />
                </div>
                <p className="text-sm font-black text-green-600 relative z-10">{language === 'ar' ? 'تم اختيار الصورة' : 'Photo Selected'}</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Upload />
                </div>
                <p className="text-sm font-bold opacity-40">{t.ar ? 'اضغط لرفع صورة السجل والمركز' : 'Click to upload CR and Business photo'}</p>
              </>
            )}
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-black py-5 rounded-3xl shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-1"
        >
          {t.submitRequest}
        </button>
      </form>
    </div>
  );
};

export default ProviderSignup;
