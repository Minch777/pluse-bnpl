'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Square3Stack3DIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  IdentificationIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import Modal from '@/components/Modal';
import merchantService, { MerchantProfile, UpdateMerchantProfileRequest } from '@/api/services/merchantService';

export default function MerchantSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Merchant profile state
  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile | null>(null);
  
  const [formData, setFormData] = useState({
    companyName: '',
    bin: '',
    directorName: '',
    contactEmail: '',
    phoneNumber: '',
    website: '',
    address: '',
    bankBik: '',
    bankName: '',
    bankAccount: '',
    // Password fields
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Load merchant profile on component mount
  useEffect(() => {
    loadMerchantProfile();
  }, []);

  // Validation functions
  const validateBik = (bik: string): string | null => {
    if (!bik) return null;
    if (bik.length !== 8) return 'БИК должен содержать 8 символов';
    return null;
  };

  const validateBankAccount = (account: string): string | null => {
    if (!account) return null;
    if (account.length !== 20) return 'ИИК должен содержать 20 символов';
    if (!/^[A-Z0-9]+$/.test(account)) return 'ИИК должен содержать только заглавные буквы и цифры';
    return null;
  };

  const validateFields = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    // Validate БИК
    const bikError = validateBik(formData.bankBik);
    if (bikError) errors.bankBik = bikError;
    
    // Validate ИИК
    const accountError = validateBankAccount(formData.bankAccount);
    if (accountError) errors.bankAccount = accountError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const loadMerchantProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading merchant profile...');
      
      const profile = await merchantService.getMerchantProfile();
      console.log('Profile loaded:', profile);
      
      if (profile) {
        setMerchantProfile(profile);
        
        // Update form data with loaded profile
        setFormData(prev => ({
          ...prev,
          companyName: profile.companyName || '',
          bin: profile.bin || '',
          directorName: profile.directorName || '',
          contactEmail: profile.contactEmail || '',
          phoneNumber: profile.phoneNumber || '',
          website: profile.website || '',
          address: profile.address || '',
          bankBik: profile.bankBik || '',
          bankName: profile.bankName || '',
          bankAccount: profile.bankAccount || ''
        }));
      } else {
        console.log('Profile not available, using default form values');
        // Keep default form data - no need to show error
      }
      
    } catch (err: any) {
      // This should rarely happen now since merchantService returns null on errors
      console.error('Unexpected error in loadMerchantProfile:', err);
      // Don't show error to user, just use defaults
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate fields before saving
    if (!validateFields()) {
      return;
    }

    setSaving(true);
    setSuccess(false);
    setError(null);
    
    try {
      console.log('Saving merchant profile...');
      
      // Prepare profile data for API
      const profileData: UpdateMerchantProfileRequest = {
        companyName: formData.companyName,
        bin: formData.bin,
        directorName: formData.directorName,
        contactEmail: formData.contactEmail,
        phoneNumber: formData.phoneNumber,
        website: formData.website,
        address: formData.address,
        bankBik: formData.bankBik,
        bankName: formData.bankName,
        bankAccount: formData.bankAccount
      };
      
      console.log('Profile data to save:', profileData);
      
      const updatedProfile = await merchantService.updateMerchantProfile(profileData);
      console.log('Profile updated successfully:', updatedProfile);
      
      setMerchantProfile(updatedProfile);
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err: any) {
      console.error('Failed to save merchant profile:', err);
      setError('Не удалось сохранить изменения. Попробуйте еще раз.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear previous validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Real-time validation for specific fields
    if (name === 'bankBik') {
      const error = validateBik(value);
      if (error) {
        setValidationErrors(prev => ({ ...prev, [name]: error }));
      }
    } else if (name === 'bankAccount') {
      const error = validateBankAccount(value);
      if (error) {
        setValidationErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Here will be the logic to change password
    console.log('Changing password');
    setShowPasswordModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Simplified header */}
      <header className="pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Настройки аккаунта</h1>
        <p className="text-lg text-gray-600">
          Управление профилем и настройками вашего аккаунта
        </p>
      </header>

      {/* Tabs navigation */}
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
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'security' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Безопасность
        </button>
        <button
          onClick={() => setActiveTab('requisites')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'requisites' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Реквизиты
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
        {/* Loading state */}
        {loading && (
          <div className="p-12 flex justify-center">
            <div className="flex flex-col items-center gap-4">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-sky-600" />
              <p className="text-slate-600">Загрузка данных...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-center">
              <p className="font-medium">{error}</p>
              <button 
                onClick={loadMerchantProfile}
                className="mt-3 text-sm text-red-700 hover:text-red-800 underline"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        )}

        {/* Content when loaded */}
        {!loading && !error && (
          <>
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
                    icon={<BuildingOfficeIcon className="w-4 h-4 text-sky-600" />}
                    label="Название компании"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    name="companyName"
                    placeholder="Юридическое название"
                  />

                  <FormGroup
                    icon={<BuildingLibraryIcon className="w-4 h-4 text-sky-600" />}
                    label="БИН"
                    value={formData.bin}
                    onChange={handleInputChange}
                    name="bin"
                    placeholder="12 цифр"
                  />

                  <FormGroup
                    icon={<IdentificationIcon className="w-4 h-4 text-sky-600" />}
                    label="ФИО руководителя"
                    value={formData.directorName}
                    onChange={handleInputChange}
                    name="directorName"
                    placeholder="ФИО руководителя компании"
                  />
                  
                  <FormGroup
                    icon={<GlobeAltIcon className="w-4 h-4 text-sky-600" />}
                    label="Сайт"
                    value={formData.website}
                    onChange={handleInputChange}
                    name="website"
                    placeholder="URL вашего сайта"
                  />
                  
                  <FormGroup
                    icon={<EnvelopeIcon className="w-4 h-4 text-sky-600" />}
                    label="Email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    name="contactEmail"
                    placeholder="Ваш контактный email"
                    type="email"
                  />
                  
                  <FormGroup
                    icon={<PhoneIcon className="w-4 h-4 text-sky-600" />}
                    label="Телефон"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    name="phoneNumber"
                    placeholder="Контактный телефон"
                    type="tel"
                  />
                  
                  <FormGroup
                    icon={<MapPinIcon className="w-4 h-4 text-sky-600" />}
                    label="Адрес"
                    value={formData.address}
                    onChange={handleInputChange}
                    name="address"
                    placeholder="Юридический адрес"
                  />
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-end">
                  <SaveButton 
                    onClick={handleSave} 
                    saving={saving} 
                    success={success} 
                  />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
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
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    name="currentPassword"
                    placeholder="Введите текущий пароль"
                    type="password"
                  />
                  
                  <FormGroup
                    icon={<KeyIcon className="w-4 h-4 text-sky-600" />}
                    label="Новый пароль"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    name="newPassword"
                    placeholder="Введите новый пароль"
                    type="password"
                  />
                  
                  <FormGroup
                    icon={<KeyIcon className="w-4 h-4 text-sky-600" />}
                    label="Подтвердите новый пароль"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    name="confirmPassword"
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
                    onClick={() => setShowPasswordModal(true)}
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

            {activeTab === 'requisites' && (
              <div className="p-6 space-y-8">
                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                    <CreditCardIcon className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-slate-800">Реквизиты</h2>
                    <p className="text-sm text-slate-500">Управление банковскими реквизитами</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormGroup
                    icon={<CreditCardIcon className="w-4 h-4 text-sky-600" />}
                    label="БИК"
                    value={formData.bankBik}
                    onChange={handleInputChange}
                    name="bankBik"
                    placeholder="БИК банка (8 цифр)"
                    error={validationErrors.bankBik}
                  />

                  <FormGroup
                    icon={<BuildingLibraryIcon className="w-4 h-4 text-sky-600" />}
                    label="Банк"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    name="bankName"
                    placeholder="Название банка"
                  />

                  <FormGroup
                    icon={<BuildingLibraryIcon className="w-4 h-4 text-sky-600" />}
                    label="ИИК"
                    value={formData.bankAccount}
                    onChange={handleInputChange}
                    name="bankAccount"
                    placeholder="ИИК счета (20 символов)"
                    error={validationErrors.bankAccount}
                  />
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <SaveButton 
                    onClick={handleSave} 
                    saving={saving} 
                    success={success} 
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'integrations' && (
              <div className="p-6">
                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                    <Square3Stack3DIcon className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-slate-800">Интеграции</h2>
                    <p className="text-sm text-slate-500">Подключение внешних сервисов и API</p>
                  </div>
                </div>

                <div className="mt-12 max-w-xl mx-auto text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Интеграция с вашим сервисом
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Подключите BNPL к вашему сайту или вашему сервису через API для автоматизации рассрочки
                  </p>

                  <a
                    href="https://wa.me/77474288095?text=Добрый%20день!%20Меня%20интересует%20интеграция%20вашего%20сервиса%20–%20расскажите%20подробнее."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Написать в WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Password Change Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Изменение пароля</h3>
            <button
              onClick={() => setShowPasswordModal(false)}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Текущий пароль
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Новый пароль
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подтвердите новый пароль
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Подтверждение выхода</h3>
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              Вы действительно хотите выйти из системы? Все несохраненные данные будут потеряны.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={confirmLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Form group with icon
interface FormGroupProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  name: string;
  placeholder: string;
  textarea?: boolean;
  type?: string;
  rows?: number;
  error?: string;
}

function FormGroup({ 
  icon, 
  label, 
  value, 
  onChange,
  name,
  placeholder, 
  textarea = false, 
  type = "text", 
  rows = 3,
  error
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
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`block w-full pl-10 pr-3 py-2 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm text-gray-700 ${
              error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
            }`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`block w-full pl-10 pr-3 py-2 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-sm text-gray-700 ${
              error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
            }`}
          />
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
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