'use client';

import { useState } from 'react';
import { CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentCheckIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Card from '@/components/Card';

type Period = 'today' | 'week' | 'month' | 'all' | 'custom';
type Product = 'all' | 'credits' | 'installments';

type DashboardMetric = {
  title: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
};

type MonthlyData = {
  month: string;
  credits: number;
  installments: number;
};

// Mock data for monthly stats
const monthlyData: MonthlyData[] = [
  {
    month: 'Февраль',
    credits: 12000000,
    installments: 4000000,
  },
  {
    month: 'Март',
    credits: 15000000,
    installments: 5000000,
  },
  {
    month: 'Апрель',
    credits: 18000000,
    installments: 6000000,
  },
];

const metrics: DashboardMetric[] = [
  { 
    title: 'Всего заявок', 
    value: 1854, 
    change: '+18%',
    icon: DocumentCheckIcon
  },
  { 
    title: 'Одобрено', 
    value: 1243, 
    change: '+15%',
    icon: ArrowTrendingUpIcon
  },
  { 
    title: 'Отказано', 
    value: 428, 
    change: '+4%',
    icon: XCircleIcon
  },
  { 
    title: 'Выдано (₸)', 
    value: '89,600,000', 
    change: '+12%',
    icon: CurrencyDollarIcon
  },
  { 
    title: 'Кредиты', 
    value: 943, 
    change: '+8%',
    icon: CreditCardIcon
  },
  { 
    title: 'Рассрочки', 
    value: 300, 
    change: '+5%',
    icon: ClockIcon
  },
  { 
    title: 'Средний чек', 
    value: '85,000', 
    change: '+3%',
    icon: ChartBarIcon
  },
  { 
    title: 'Доход (₸)', 
    value: '1,120,000', 
    change: '+15%',
    icon: CurrencyDollarIcon
  },
];

export default function AdminDashboardStats() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');
  const [selectedProduct, setSelectedProduct] = useState<Product>('all');

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };

  const calculateTotal = (credits: number, installments: number) => {
    return credits + installments;
  };

  const calculateIncome = (total: number) => {
    return total * 0.05; // 5% commission
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Period Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setSelectedPeriod('today')}
            className={`text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 whitespace-nowrap ${
              selectedPeriod === 'today'
                ? 'bg-blue-50 text-blue-700 border-blue-600 font-medium'
                : ''
            }`}
          >
            Сегодня
          </button>
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 whitespace-nowrap ${
              selectedPeriod === 'week'
                ? 'bg-blue-50 text-blue-700 border-blue-600 font-medium'
                : ''
            }`}
          >
            Неделя
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 whitespace-nowrap ${
              selectedPeriod === 'month'
                ? 'bg-blue-50 text-blue-700 border-blue-600 font-medium'
                : ''
            }`}
          >
            Месяц
          </button>
          <button
            onClick={() => setSelectedPeriod('all')}
            className={`text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 whitespace-nowrap ${
              selectedPeriod === 'all'
                ? 'bg-blue-50 text-blue-700 border-blue-600 font-medium'
                : ''
            }`}
          >
            Всё время
          </button>
          <button
            onClick={() => setSelectedPeriod('custom')}
            className={`text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2 whitespace-nowrap ${
              selectedPeriod === 'custom'
                ? 'bg-blue-50 text-blue-700 border-blue-600 font-medium'
                : ''
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            Выбрать даты
          </button>
        </div>

        {/* Product Filter */}
        <div className="relative">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value as Product)}
            className="appearance-none bg-white text-sm px-3 py-1.5 pr-8 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все продукты</option>
            <option value="credits">Кредиты</option>
            <option value="installments">Рассрочки</option>
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-gray-900">
                      {typeof metric.value === 'string' ? metric.value : new Intl.NumberFormat('ru-RU').format(metric.value)}
                      {metric.title.includes('₸') ? ' ₸' : ''}
                    </span>
                    <span className={`text-sm font-medium ${
                      metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Monthly Stats Table */}
      <Card>
        <div className="space-y-4">
          <h2 className="font-medium text-gray-900">Выдано и заработано по месяцам</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">Месяц</th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">Кредиты</th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">Рассрочки</th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">Всего</th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">Доход</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlyData.map((data) => {
                  const total = calculateTotal(data.credits, data.installments);
                  const income = calculateIncome(total);
                  return (
                    <tr key={data.month}>
                      <td className="py-3 text-sm text-gray-900">{data.month}</td>
                      <td className="py-3 text-sm text-gray-900 text-right tabular-nums">
                        {formatAmount(data.credits)} ₸
                      </td>
                      <td className="py-3 text-sm text-gray-900 text-right tabular-nums">
                        {formatAmount(data.installments)} ₸
                      </td>
                      <td className="py-3 text-sm font-medium text-gray-900 text-right tabular-nums">
                        {formatAmount(total)} ₸
                      </td>
                      <td className="py-3 text-sm text-gray-900 text-right tabular-nums">
                        {formatAmount(income)} ₸
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t border-gray-200">
                <tr>
                  <td className="pt-3 text-sm font-medium text-gray-900">Итого</td>
                  <td className="pt-3 text-sm font-medium text-gray-900 text-right tabular-nums">
                    {formatAmount(monthlyData.reduce((sum, data) => sum + data.credits, 0))} ₸
                  </td>
                  <td className="pt-3 text-sm font-medium text-gray-900 text-right tabular-nums">
                    {formatAmount(monthlyData.reduce((sum, data) => sum + data.installments, 0))} ₸
                  </td>
                  <td className="pt-3 text-sm font-medium text-gray-900 text-right tabular-nums">
                    {formatAmount(monthlyData.reduce((sum, data) => sum + data.credits + data.installments, 0))} ₸
                  </td>
                  <td className="pt-3 text-sm font-medium text-gray-900 text-right tabular-nums">
                    {formatAmount(monthlyData.reduce((sum, data) => sum + (data.credits + data.installments) * 0.05, 0))} ₸
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </Card>

      {/* Commission Block */}
      <Card>
        <div className="space-y-2">
          <h2 className="font-medium text-gray-900">Заработано по комиссиям</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-gray-900">1,120,000 ₸</span>
            <span className="text-sm font-medium text-green-600">+15%</span>
          </div>
          <p className="text-sm text-gray-600">
            Общая сумма комиссий по выданным продуктам за выбранный период
          </p>
        </div>
      </Card>
    </div>
  );
} 