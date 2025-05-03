'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import { ChevronDownIcon, ChevronUpIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

type Period = 'today' | 'week' | 'month' | 'all' | 'custom';

// Mock data for recent applications
const recentApplications = [
  {
    id: '#1234',
    customerName: 'Айгуль Нурланова',
    amount: 45000,
    status: 'issued',
    date: '15.03.2024'
  },
  {
    id: '#1230',
    customerName: 'Азамат Сериков',
    amount: 120000,
    status: 'issued',
    date: '14.03.2024'
  },
  {
    id: '#1228',
    customerName: 'Динара Касымова',
    amount: 67000,
    status: 'issued',
    date: '14.03.2024'
  }
];

export default function MerchantDashboard() {
  const [isTipsOpen, setIsTipsOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');
  const router = useRouter();

  // В реальном приложении эти данные будут получаться с бэкенда
  const metrics = {
    applications: { value: 127, change: 12 },
    approved: { value: 82, change: 8 },
    rejected: { value: 23, change: 4 },
    totalAmount: { value: 3690000, change: 15 },
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };

  return (
    <div className="space-y-6 mt-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Показатели</h1>
        <p className="mt-2 text-gray-600">
          Обзор ваших показателей и последних заявок
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedPeriod('today')}
            className={`text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 ${
              selectedPeriod === 'today'
                ? 'bg-blue-50 text-blue-700 border-blue-600 font-medium'
                : ''
            }`}
          >
            Сегодня
          </button>
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 ${
              selectedPeriod === 'week'
                ? 'bg-blue-50 text-blue-700 border-blue-600 font-medium'
                : ''
            }`}
          >
            Неделя
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 ${
              selectedPeriod === 'month'
                ? 'bg-blue-50 text-blue-700 border-blue-600 font-medium'
                : ''
            }`}
          >
            Месяц
          </button>
          <button
            onClick={() => setSelectedPeriod('all')}
            className={`text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 ${
              selectedPeriod === 'all'
                ? 'bg-blue-50 text-blue-700 border-blue-600 font-medium'
                : ''
            }`}
          >
            Всё время
          </button>
          <button
            onClick={() => setSelectedPeriod('custom')}
            className={`text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2 ${
              selectedPeriod === 'custom'
                ? 'bg-blue-50 text-blue-700 border-blue-600 font-medium'
                : ''
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            Выбрать даты
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">Всего заявок</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900">{metrics.applications.value}</span>
              <span className={`text-sm font-medium ${metrics.applications.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.applications.change >= 0 ? '+' : ''}{metrics.applications.change}%
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">Одобрено</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900">{metrics.approved.value}</span>
              <span className={`text-sm font-medium ${metrics.approved.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.approved.change >= 0 ? '+' : ''}{metrics.approved.change}%
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">Отказано</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900">{metrics.rejected.value}</span>
              <span className={`text-sm font-medium ${metrics.rejected.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {metrics.rejected.change >= 0 ? '+' : ''}{metrics.rejected.change}%
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">Выдано (₸)</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900">{formatAmount(metrics.totalAmount.value)} ₸</span>
              <span className={`text-sm font-medium ${metrics.totalAmount.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.totalAmount.change >= 0 ? '+' : ''}{metrics.totalAmount.change}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Tips Accordion */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsTipsOpen(!isTipsOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <h2 className="font-medium text-gray-900">
              Как повысить % одобрения
            </h2>
          </div>
          {isTipsOpen ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {isTipsOpen && (
          <div className="px-4 pb-4">
            <ul className="space-y-2 text-gray-600 ml-11">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                Прикрепляйте выписку из Kaspi или Halyk Bank — это повышает шанс одобрения
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                Проверяйте корректность ИИН клиента перед отправкой
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                Не отправляйте повторные заявки на одного клиента
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Recent Applications */}
      <Card>
        <div className="space-y-4">
          <h2 className="font-medium text-gray-900">Последние выданные заявки</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">ID</th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">Клиент</th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">Сумма</th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">Статус</th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentApplications.map((application) => (
                  <tr key={application.id}>
                    <td className="py-3 text-sm text-gray-600">{application.id}</td>
                    <td className="py-3 text-sm text-gray-900">{application.customerName}</td>
                    <td className="py-3 text-sm text-gray-900">{formatAmount(application.amount)} ₸</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        Выдано
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{application.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
            <span>Показаны последние {recentApplications.length} из {metrics.applications.value} заявок</span>
            <button
              onClick={() => router.push('/merchant/applications')}
              className="text-sm text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-gray-50 rounded-md px-3 py-1.5"
            >
              Смотреть все заявки
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
} 