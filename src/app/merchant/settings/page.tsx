'use client';

import { useState } from 'react';
import { 
  UserCircleIcon, 
  KeyIcon, 
  BellIcon, 
  CheckIcon, 
  ShieldCheckIcon, 
  GlobeAltIcon, 
  BuildingOfficeIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  DevicePhoneMobileIcon,
  NewspaperIcon,
  ArrowPathIcon,
  CreditCardIcon,
  Square3Stack3DIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

export default function MerchantSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setSaving(false);
    setSuccess(true);
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Simplified header */}
      <header className="pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Настройки аккаунта</h1>
        <p className="text-lg text-gray-600">
          Управление профилем, безопасностью и предпочтениями вашего аккаунта
        </p>
      </header>

      {/* Tabs navigation - styled like terms page */}
      <div className="flex mb-8 bg-slate-50 rounded-lg p-1 max-w-fit">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'profile' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Профиль компании
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'password' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Безопасность
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'notifications' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Уведомления
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'payments' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Способы оплаты
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'integrations' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Интеграции
        </button>
      </div>

      {/* Content area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {activeTab === 'profile' && (
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-slate-800">Профиль компании</h2>
                <p className="text-sm text-slate-500">Обновите информацию о вашей компании</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormGroup
                icon={<SparklesIcon className="w-4 h-4 text-sky-600" />}
                label="Бренд"
                defaultValue="Pluse"
                placeholder="Название вашего бренда"
              />
              
              <FormGroup
                icon={<BuildingOfficeIcon className="w-4 h-4 text-sky-600" />}
                label="Название компании"
                defaultValue="ИП Предприниматель"
                placeholder="Юридическое название"
              />
              
              <FormGroup
                icon={<GlobeAltIcon className="w-4 h-4 text-sky-600" />}
                label="Сайт"
                defaultValue="https://example.com"
                placeholder="URL вашего сайта"
              />
              
              <FormGroup
                icon={<EnvelopeIcon className="w-4 h-4 text-sky-600" />}
                label="Email"
                defaultValue="merchant@example.com"
                placeholder="Ваш контактный email"
                type="email"
              />
              
              <FormGroup
                icon={<PhoneIcon className="w-4 h-4 text-sky-600" />}
                label="Телефон"
                defaultValue="+7 (777) 123-45-67"
                placeholder="Контактный телефон"
                type="tel"
              />
              
              <FormGroup
                icon={<MapPinIcon className="w-4 h-4 text-sky-600" />}
                label="Адрес"
                defaultValue="ул. Абая 150, Алматы"
                placeholder="Юридический адрес"
                textarea
                rows={3}
              />
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Последнее обновление: 15 марта 2024
              </div>
              <SaveButton 
                onClick={handleSave} 
                saving={saving} 
                success={success} 
              />
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-slate-800">Безопасность</h2>
                <p className="text-sm text-slate-500">Обновите ваш пароль для безопасности аккаунта</p>
              </div>
            </div>

            <div className="space-y-6 max-w-md">
              <FormGroup
                icon={<KeyIcon className="w-4 h-4 text-sky-600" />}
                label="Текущий пароль"
                defaultValue=""
                placeholder="Введите текущий пароль"
                type="password"
              />
              
              <FormGroup
                icon={<KeyIcon className="w-4 h-4 text-sky-600" />}
                label="Новый пароль"
                defaultValue=""
                placeholder="Введите новый пароль"
                type="password"
              />
              
              <FormGroup
                icon={<KeyIcon className="w-4 h-4 text-sky-600" />}
                label="Подтвердите новый пароль"
                defaultValue=""
                placeholder="Введите новый пароль снова"
                type="password"
              />
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700 flex items-start gap-3 mt-8">
                <div className="mt-0.5 flex-shrink-0">
                  <ShieldCheckIcon className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium mb-1">Рекомендации для безопасности:</p>
                  <ul className="space-y-1 list-disc list-inside ml-1">
                    <li>Используйте как минимум 8 символов</li>
                    <li>Используйте комбинацию букв, цифр и спецсимволов</li>
                    <li>Не используйте один и тот же пароль для разных сервисов</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleSave}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium 
                  ${saving || success 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500'
                  } transition-all`}
                disabled={saving || success}
              >
                {saving && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                {success && <CheckIcon className="w-4 h-4" />}
                {saving ? 'Обновление...' : success ? 'Пароль обновлен' : 'Обновить пароль'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                <BellIcon className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-slate-800">Настройки уведомлений</h2>
                <p className="text-sm text-slate-500">Выберите, какие уведомления вы хотите получать</p>
              </div>
            </div>

            <div className="space-y-6">
              <NotificationSetting
                icon={<EnvelopeIcon className="w-5 h-5 text-sky-600" />}
                title="Email-уведомления"
                description="Получать уведомления о новых заявках и их статусах по email"
                defaultChecked={true}
              />
              
              <NotificationSetting
                icon={<DevicePhoneMobileIcon className="w-5 h-5 text-sky-600" />}
                title="SMS-уведомления"
                description="Получать важные уведомления по SMS"
                defaultChecked={false}
              />
              
              <NotificationSetting
                icon={<NewspaperIcon className="w-5 h-5 text-sky-600" />}
                title="Маркетинговые рассылки"
                description="Получать новости о продуктах и акциях"
                defaultChecked={true}
              />
              
              <div className="bg-gray-50 rounded-lg p-5 text-sm text-gray-600 mt-4">
                <p className="mb-4 font-medium text-gray-700">Как часто вы хотите получать дайджест?</p>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="digest" value="daily" className="h-4 w-4 text-sky-600" />
                    <span>Ежедневно</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="digest" value="weekly" className="h-4 w-4 text-sky-600" defaultChecked />
                    <span>Еженедельно</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="digest" value="monthly" className="h-4 w-4 text-sky-600" />
                    <span>Ежемесячно</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <SaveButton 
                onClick={handleSave} 
                saving={saving} 
                success={success} 
                text="Сохранить настройки"
              />
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                <CreditCardIcon className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-slate-800">Способы оплаты</h2>
                <p className="text-sm text-slate-500">Управление платежными реквизитами</p>
              </div>
            </div>

            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">Этот раздел находится в разработке</p>
              <button className="px-5 py-2.5 bg-sky-50 text-sky-600 rounded-lg font-medium">
                Подключить позже
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'integrations' && (
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                <Square3Stack3DIcon className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-slate-800">Интеграции</h2>
                <p className="text-sm text-slate-500">Настройка API и внешних сервисов</p>
              </div>
            </div>

            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">Этот раздел находится в разработке</p>
              <button className="px-5 py-2.5 bg-sky-50 text-sky-600 rounded-lg font-medium">
                Подключить API
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Form group with icon
interface FormGroupProps {
  icon: React.ReactNode;
  label: string;
  defaultValue?: string;
  placeholder: string;
  textarea?: boolean;
  type?: string;
  rows?: number;
}

function FormGroup({ 
  icon, 
  label, 
  defaultValue = "", 
  placeholder, 
  textarea = false, 
  type = "text", 
  rows = 3 
}: FormGroupProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative rounded-lg">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        {textarea ? (
          <textarea
            defaultValue={defaultValue}
            placeholder={placeholder}
            rows={rows}
            className="block w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm text-gray-700"
          />
        ) : (
          <input
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className="block w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm text-gray-700"
          />
        )}
      </div>
    </div>
  );
}

// Notification setting with toggle
interface NotificationSettingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  defaultChecked: boolean;
}

function NotificationSetting({ icon, title, description, defaultChecked }: NotificationSettingProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-sky-50 rounded-lg flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          className="sr-only peer"
        />
        <div
          className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-sky-400/30 
            peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] 
            after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 
            after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
            peer-checked:bg-sky-600"
        ></div>
      </label>
    </div>
  );
}

// Save button with loading and success states
interface SaveButtonProps {
  onClick: () => void;
  saving: boolean;
  success: boolean;
  text?: string;
}

function SaveButton({ onClick, saving, success, text = "Сохранить изменения" }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium 
        ${saving || success 
          ? (success ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500 cursor-not-allowed') 
          : 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500'
        } transition-all`}
      disabled={saving}
    >
      {saving && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
      {success && <CheckIcon className="w-4 h-4" />}
      {saving ? 'Сохранение...' : success ? 'Сохранено!' : text}
    </button>
  );
} 