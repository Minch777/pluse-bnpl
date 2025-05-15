'use client';

import { useState } from 'react';
import { 
  Cog6ToothIcon,
  UserIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  ArrowPathIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  ServerIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  
  // Симуляция сохранения настроек
  const handleSave = () => {
    setSaveStatus('saving');
    
    // Имитация задержки сохранения
    setTimeout(() => {
      setSaveStatus('success');
      
      // Сбросить статус через некоторое время
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }, 1000);
  };
  
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Настройки
        </h1>
        <p className="text-lg text-gray-600">
          Управление основными настройками платформы и системными параметрами
        </p>
      </div>
      
      {/* Settings area with tabs */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar with tabs */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                  <Cog6ToothIcon className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">Настройки</h3>
                  <p className="text-xs text-slate-500">Управление системой</p>
                </div>
              </div>
            </div>
            
            {/* Settings tabs */}
            <div className="p-1.5">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left rounded-md transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-sky-50 text-sky-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UserCircleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Профиль администратора</span>
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left rounded-md transition-colors ${
                  activeTab === 'security' 
                    ? 'bg-sky-50 text-sky-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheckIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Безопасность</span>
              </button>
              
              <button
                onClick={() => setActiveTab('system')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left rounded-md transition-colors ${
                  activeTab === 'system' 
                    ? 'bg-sky-50 text-sky-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ServerIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Системные настройки</span>
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left rounded-md transition-colors ${
                  activeTab === 'notifications' 
                    ? 'bg-sky-50 text-sky-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BellIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Уведомления</span>
              </button>
              
              <button
                onClick={() => setActiveTab('logs')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left rounded-md transition-colors ${
                  activeTab === 'logs' 
                    ? 'bg-sky-50 text-sky-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ClockIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Логи системы</span>
              </button>
            </div>
            
            <div className="p-4 mt-2 border-t border-slate-200">
              <button 
                className="w-full flex items-center gap-2 px-3 py-2 text-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Выйти из системы</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            {/* Profile settings */}
            {activeTab === 'profile' && (
              <div>
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800">Профиль администратора</h2>
                  <p className="text-sm text-slate-500 mt-1">Управление данными профиля администратора системы</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 text-xl font-bold">
                        АС
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800">Администратор системы</h3>
                        <p className="text-sm text-slate-500">Основной администратор платформы</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Имя</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-slate-400" />
                          </div>
                          <input 
                            type="text" 
                            className="block w-full pl-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            placeholder="Введите имя" 
                            defaultValue="Администратор" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Фамилия</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-slate-400" />
                          </div>
                          <input 
                            type="text" 
                            className="block w-full pl-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            placeholder="Введите фамилию" 
                            defaultValue="Системы" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                          </div>
                          <input 
                            type="email" 
                            className="block w-full pl-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            placeholder="Введите email" 
                            defaultValue="admin@pluse.kz" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Телефон</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <PhoneIcon className="h-5 w-5 text-slate-400" />
                          </div>
                          <input 
                            type="tel" 
                            className="block w-full pl-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            placeholder="+7 (___) ___-____" 
                            defaultValue="+7 (777) 888-9999" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        <span>Сохранение...</span>
                      </>
                    ) : saveStatus === 'success' ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>Сохранено</span>
                      </>
                    ) : (
                      <span>Сохранить изменения</span>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* Security settings */}
            {activeTab === 'security' && (
              <div>
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800">Безопасность</h2>
                  <p className="text-sm text-slate-500 mt-1">Управление паролем и настройками безопасности</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-slate-800 mb-3">Изменение пароля</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Текущий пароль</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <LockClosedIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input 
                              type="password" 
                              className="block w-full pl-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                              placeholder="••••••••" 
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Новый пароль</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <LockClosedIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input 
                              type="password" 
                              className="block w-full pl-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                              placeholder="••••••••" 
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Подтверждение пароля</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <LockClosedIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input 
                              type="password" 
                              className="block w-full pl-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                              placeholder="••••••••" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-6">
                      <h3 className="font-medium text-slate-800 mb-3">Двухфакторная аутентификация</h3>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="2fa"
                            type="checkbox"
                            className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="2fa" className="text-sm font-medium text-slate-700">
                            Включить двухфакторную аутентификацию
                          </label>
                          <p className="text-sm text-slate-500">
                            Повысьте безопасность аккаунта с помощью дополнительного кода подтверждения при входе
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        <span>Сохранение...</span>
                      </>
                    ) : saveStatus === 'success' ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>Сохранено</span>
                      </>
                    ) : (
                      <span>Сохранить изменения</span>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* System settings */}
            {activeTab === 'system' && (
              <div>
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800">Системные настройки</h2>
                  <p className="text-sm text-slate-500 mt-1">Управление основными параметрами платформы</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-slate-800 mb-3">Общие настройки</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Название платформы</label>
                          <input 
                            type="text" 
                            className="block w-full py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            defaultValue="Pluse" 
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">URL системы</label>
                          <input 
                            type="url" 
                            className="block w-full py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            defaultValue="https://pluse.kz" 
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Контактный email администрации</label>
                          <input 
                            type="email" 
                            className="block w-full py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            defaultValue="admin@pluse.kz" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-6">
                      <h3 className="font-medium text-slate-800 mb-3">Комиссии и параметры рассрочки</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Комиссия по умолчанию (%)</label>
                          <input 
                            type="number" 
                            className="block w-full py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            defaultValue="5" 
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Минимальная сумма рассрочки (₸)</label>
                          <input 
                            type="number" 
                            className="block w-full py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            defaultValue="10000" 
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Максимальная сумма рассрочки (₸)</label>
                          <input 
                            type="number" 
                            className="block w-full py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            defaultValue="1000000" 
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Срок рассрочки по умолчанию (мес.)</label>
                          <select 
                            className="block w-full py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                          >
                            <option value="3">3 месяца</option>
                            <option value="6" selected>6 месяцев</option>
                            <option value="12">12 месяцев</option>
                            <option value="24">24 месяца</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        <span>Сохранение...</span>
                      </>
                    ) : saveStatus === 'success' ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>Сохранено</span>
                      </>
                    ) : (
                      <span>Сохранить изменения</span>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* Notifications settings */}
            {activeTab === 'notifications' && (
              <div>
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800">Уведомления</h2>
                  <p className="text-sm text-slate-500 mt-1">Настройка системных уведомлений и оповещений</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-slate-800 mb-3">Уведомления по email</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="notify_new_merchant"
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="notify_new_merchant" className="text-sm font-medium text-slate-700">
                              Новые предприниматели
                            </label>
                            <p className="text-sm text-slate-500">
                              Получать уведомления при регистрации новых предпринимателей
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="notify_new_application"
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="notify_new_application" className="text-sm font-medium text-slate-700">
                              Новые заявки
                            </label>
                            <p className="text-sm text-slate-500">
                              Получать уведомления о новых заявках на рассрочку
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="notify_system_error"
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="notify_system_error" className="text-sm font-medium text-slate-700">
                              Системные ошибки
                            </label>
                            <p className="text-sm text-slate-500">
                              Получать уведомления о критических ошибках в системе
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-6">
                      <h3 className="font-medium text-slate-800 mb-3">Настройки уведомлений для мерчантов</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="merchant_notify_approval"
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="merchant_notify_approval" className="text-sm font-medium text-slate-700">
                              Уведомления об одобрении заявок
                            </label>
                            <p className="text-sm text-slate-500">
                              Уведомлять мерчантов об одобрении заявок на рассрочку
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="merchant_notify_rejection"
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="merchant_notify_rejection" className="text-sm font-medium text-slate-700">
                              Уведомления об отклонении заявок
                            </label>
                            <p className="text-sm text-slate-500">
                              Уведомлять мерчантов об отклонении заявок на рассрочку
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="merchant_notify_payout"
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="merchant_notify_payout" className="text-sm font-medium text-slate-700">
                              Уведомления о выплатах
                            </label>
                            <p className="text-sm text-slate-500">
                              Уведомлять мерчантов о переводе средств на их счет
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        <span>Сохранение...</span>
                      </>
                    ) : saveStatus === 'success' ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>Сохранено</span>
                      </>
                    ) : (
                      <span>Сохранить изменения</span>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* System logs */}
            {activeTab === 'logs' && (
              <div>
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800">Логи системы</h2>
                  <p className="text-sm text-slate-500 mt-1">Просмотр логов и журналов системных событий</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-slate-800">Последние события</h3>
                        <p className="text-sm text-slate-500">Журнал недавних системных событий</p>
                      </div>
                      
                      <button 
                        className="px-3 py-1.5 text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors text-sm font-medium"
                      >
                        Обновить
                      </button>
                    </div>
                    
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-50 text-left">
                              <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Дата и время</th>
                              <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Тип</th>
                              <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Сообщение</th>
                              <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">IP</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            <tr className="hover:bg-slate-50">
                              <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">2023-11-21 14:32:05</td>
                              <td className="px-6 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                                  Успех
                                </span>
                              </td>
                              <td className="px-6 py-3 text-sm text-slate-800">Пользователь admin успешно авторизовался</td>
                              <td className="px-6 py-3 text-sm text-slate-600">192.168.1.100</td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                              <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">2023-11-21 14:30:15</td>
                              <td className="px-6 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-600">
                                  Информация
                                </span>
                              </td>
                              <td className="px-6 py-3 text-sm text-slate-800">Новый мерчант зарегистрирован: ИП "ТехноЛайф"</td>
                              <td className="px-6 py-3 text-sm text-slate-600">95.47.158.200</td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                              <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">2023-11-21 13:45:22</td>
                              <td className="px-6 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
                                  Предупреждение
                                </span>
                              </td>
                              <td className="px-6 py-3 text-sm text-slate-800">Попытка доступа к неавторизованному ресурсу</td>
                              <td className="px-6 py-3 text-sm text-slate-600">45.78.209.147</td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                              <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">2023-11-21 12:17:33</td>
                              <td className="px-6 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                                  Ошибка
                                </span>
                              </td>
                              <td className="px-6 py-3 text-sm text-slate-800">Ошибка соединения с платежным шлюзом</td>
                              <td className="px-6 py-3 text-sm text-slate-600">192.168.1.105</td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                              <td className="px-6 py-3 text-sm text-slate-600 whitespace-nowrap">2023-11-21 11:04:12</td>
                              <td className="px-6 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                                  Успех
                                </span>
                              </td>
                              <td className="px-6 py-3 text-sm text-slate-800">Заявка #1234 успешно одобрена</td>
                              <td className="px-6 py-3 text-sm text-slate-600">192.168.1.100</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-500">
                        Показано 5 из 245 записей
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 border border-slate-200 cursor-not-allowed"
                          disabled
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        
                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-600 text-white font-medium"
                        >
                          1
                        </button>
                        
                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
                        >
                          2
                        </button>
                        
                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
                        >
                          3
                        </button>
                        
                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-sky-600 hover:bg-sky-50 border border-sky-200"
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-6">
                      <div>
                        <h3 className="font-medium text-slate-800 mb-3">Экспорт логов</h3>
                        <div className="flex items-center gap-3">
                          <button className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2">
                            <DocumentTextIcon className="w-4 h-4" />
                            <span>Экспорт в CSV</span>
                          </button>
                          
                          <button className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2">
                            <DocumentTextIcon className="w-4 h-4" />
                            <span>Экспорт в PDF</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 