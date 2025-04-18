'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function MerchantSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6 mt-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Настройки</h1>
        <p className="mt-2 text-slate-600">
          Управление настройками вашего аккаунта
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeTab === 'profile'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Профиль компании
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeTab === 'password'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Изменить пароль
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeTab === 'notifications'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Уведомления
          </button>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900">Профиль компании</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Обновите информацию о вашей компании
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Бренд
                    </label>
                    <input
                      type="text"
                      defaultValue="Pluse"
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Название компании
                    </label>
                    <input
                      type="text"
                      defaultValue="ИП Предприниматель"
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Сайт
                    </label>
                    <input
                      type="url"
                      defaultValue="https://example.com"
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="merchant@example.com"
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      defaultValue="+7 (777) 123-45-67"
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Адрес
                    </label>
                    <textarea
                      defaultValue="ул. Абая 150, Алматы"
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    Сохранить изменения
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'password' && (
            <Card>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900">Изменить пароль</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Обновите ваш пароль для безопасности
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Текущий пароль
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Новый пароль
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Подтвердите новый пароль
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    Обновить пароль
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900">Настройки уведомлений</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Выберите, какие уведомления вы хотите получать
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Email-уведомления</h4>
                      <p className="mt-1 text-sm text-slate-600">
                        Получать уведомления о новых заявках и их статусах по email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">SMS-уведомления</h4>
                      <p className="mt-1 text-sm text-slate-600">
                        Получать важные уведомления по SMS
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Маркетинговые рассылки</h4>
                      <p className="mt-1 text-sm text-slate-600">
                        Получать новости о продуктах и акциях
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <Button>
                    Сохранить настройки
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 