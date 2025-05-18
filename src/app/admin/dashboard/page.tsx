'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  EllipsisHorizontalIcon,
  MapPinIcon,
  ClockIcon,
  ArrowPathIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import applicationService from '@/api/services/applicationService';

export default function AdminDashboard() {
  const [timeframeFilter, setTimeframeFilter] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realApplicationsData, setRealApplicationsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch real applications data
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching real applications from API...');
        const applicationsData = await applicationService.getApplications();
        console.log('API response:', applicationsData);
        setRealApplicationsData(applicationsData);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to fetch applications');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  // Modern color palette - matching merchant dashboard
  const colors = {
    primary: '#0891B2', // teal-600
    primaryDark: '#0E7490', // teal-700
    primaryLight: '#E0F2FE', // sky-100
    secondary: '#0EA5E9', // sky-500
    secondaryDark: '#0284C7', // sky-600
    gradient: {
      from: '#0EA5E9', // sky-500
      to: '#0891B2', // teal-600
    },
    success: '#10B981', // emerald-500
    error: '#EF4444', // red-500
    neutral: '#F1F5F9', // slate-100
    text: {
      primary: '#0F172A', // slate-900
      secondary: '#475569', // slate-600
      tertiary: '#94A3B8' // slate-400
    }
  };
  
  // Mock data for the dashboard
  const stats = [
    { 
      label: 'Всего предпринимателей', 
      value: '248', 
      change: 12, 
      icon: <UsersIcon className="w-5 h-5" />,
    },
    { 
      label: 'Всего заявок', 
      value: '1,854', 
      change: 18, 
      icon: <DocumentTextIcon className="w-5 h-5" />,
    },
    { 
      label: 'Одобрено', 
      value: '1,243', 
      change: 15, 
      icon: <CheckCircleIcon className="w-5 h-5" />,
      highlight: true
    },
    { 
      label: 'Отказано', 
      value: '428', 
      change: 4, 
      icon: <XCircleIcon className="w-5 h-5" />,
    },
  ];
  
  const topMerchants = [
    { 
      name: 'ИП "Электроника"', 
      applications: 245, 
      amount: '12,560,000 ₸', 
      location: 'Алматы',
      growth: '+8.5%',
      status: 'active'
    },
    { 
      name: 'ТОО "МебельПлюс"', 
      applications: 187, 
      amount: '8,940,000 ₸', 
      location: 'Астана',
      growth: '+12.3%',
      status: 'active'
    },
    { 
      name: 'ИП Сагитов', 
      applications: 156, 
      amount: '7,230,000 ₸', 
      location: 'Шымкент',
      growth: '+5.7%',
      status: 'active'
    },
    { 
      name: 'ТОО "АвтоТехСервис"', 
      applications: 124, 
      amount: '6,180,000 ₸', 
      location: 'Алматы',
      growth: '+3.2%',
      status: 'pending'
    },
    { 
      name: 'ИП "Модный Дом"', 
      applications: 112, 
      amount: '5,640,000 ₸', 
      location: 'Караганда',
      growth: '+7.1%',
      status: 'active'
    },
  ];

  const recentActivity = [
    { 
      type: 'merchant_added', 
      merchant: 'ТОО "КазКомфорт"', 
      time: '2 часа назад',
      icon: <UsersIcon className="w-5 h-5" />,
    },
    { 
      type: 'application_approved', 
      merchant: 'ИП "Электроника"', 
      time: '3 часа назад',
      amount: '845,000 ₸',
      icon: <CheckCircleIcon className="w-5 h-5" />,
    },
    { 
      type: 'application_rejected', 
      merchant: 'ТОО "МебельПлюс"', 
      time: '5 часов назад',
      amount: '1,230,000 ₸',
      icon: <XCircleIcon className="w-5 h-5" />,
    },
    { 
      type: 'merchant_blocked', 
      merchant: 'ИП "АвтоМир"', 
      time: '8 часов назад',
      icon: <XCircleIcon className="w-5 h-5" />,
    },
  ];
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Fetch real data
      const applicationsData = await applicationService.getApplications();
      console.log('Refreshed applications data:', applicationsData);
      setRealApplicationsData(applicationsData);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
    
    // Keep the existing mock refresh simulation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };
  
  // Stat Card component - matches merchant dashboard style
  function StatCard({ 
    title, 
    value, 
    change, 
    icon, 
    highlight = false 
  }: { 
    title: string; 
    value: string; 
    change: number; 
    icon: React.ReactNode;
    highlight?: boolean;
  }) {
  return (
      <div className={`rounded-lg border p-6 transition-all duration-150 shadow-sm
        ${highlight 
          ? 'bg-gradient-to-br from-sky-50 to-sky-100/70 border-sky-100 hover:shadow-md' 
          : 'bg-white border-slate-200 hover:border-sky-200 hover:shadow-md'
        }`
      }>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${highlight ? 'bg-sky-100 text-sky-600' : 'bg-slate-50 text-slate-500'}`}>
            {icon}
          </div>
          <span className="text-sm font-medium text-slate-600">{title}</span>
        </div>
        
        <div className="flex items-baseline gap-2">
          <h3 className={`text-[28px] font-bold text-slate-800`}>{value}</h3>
          <div className={`flex items-center text-xs font-medium text-emerald-600`}>
            <ArrowUpIcon className="w-3 h-3 mr-0.5" />
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Статистика платформы
        </h1>
        <p className="text-lg text-gray-600">
          Просмотр ключевых показателей и мониторинг активности предпринимателей
        </p>
      </div>

      {/* Action row - Period filter and Refresh Button */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        {/* Period filter tabs - left side */}
        <div className="inline-flex rounded-full border border-slate-200 p-1">
          <button
            onClick={() => setTimeframeFilter('week')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              timeframeFilter === 'week' 
                ? 'bg-sky-50 text-sky-600' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Неделя
          </button>
          <button
            onClick={() => setTimeframeFilter('month')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              timeframeFilter === 'month' 
                ? 'bg-sky-50 text-sky-600' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Месяц
          </button>
          <button
            onClick={() => setTimeframeFilter('quarter')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              timeframeFilter === 'quarter' 
                ? 'bg-sky-50 text-sky-600' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Квартал
          </button>
          <button
            onClick={() => setTimeframeFilter('year')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              timeframeFilter === 'year' 
                ? 'bg-sky-50 text-sky-600' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Год
          </button>
        </div>

        {/* Action button - right side */}
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 h-10 bg-transparent border border-sky-500 text-sky-600 rounded-lg text-sm font-medium hover:bg-sky-50 transition-colors"
        >
          <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Обновить данные</span>
        </button>
      </div>
      
      {/* Stats cards with clean design */}
      <div className="mb-8">
        {/* Grid of metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
            <StatCard 
            key={index} 
              title={stat.label}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              highlight={stat.highlight}
            />
          ))}
                </div>
              </div>

      {/* Top merchants section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <h2 className="text-xl font-semibold text-slate-800">Топ предпринимателей</h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">По обороту</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-grow sm:flex-grow-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
              </div>
              <input 
                type="text"
                placeholder="Поиск..."
                className="w-full sm:w-auto pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            
            <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Merchants Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Название</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Локация</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Заявки</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Общая сумма</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Рост</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topMerchants.map((merchant, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 font-medium">
                        {merchant.name[0]}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{merchant.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPinIcon className="w-4 h-4 text-slate-400" />
                      {merchant.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{merchant.applications}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">{merchant.amount}</td>
                  <td className="px-6 py-4 text-sm text-emerald-600 font-medium">{merchant.growth}</td>
                  <td className="px-6 py-4">
                    {merchant.status === 'active' ? (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium">
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                        <span>Активен</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-medium">
                        <ClockIcon className="w-3.5 h-3.5" />
                        <span>На модерации</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-sky-500 transition-colors">
                      <EllipsisHorizontalIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-t border-slate-200">
          <span className="text-sm text-slate-500 mb-4 sm:mb-0">
            Показано 5 из 248 предпринимателей (стр. 1 из 50)
          </span>
          
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
            <div className="flex items-center gap-1.5">
              <button
                disabled={true}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 border border-slate-200 cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all font-medium ${
                    page === 1
                      ? 'bg-sky-600 text-white font-bold shadow-md'
                      : 'text-slate-700 hover:bg-sky-50 border border-slate-200'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                className="w-9 h-9 flex items-center justify-center rounded-lg text-sky-600 hover:bg-sky-50 border border-sky-200 transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts and activity section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1 */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-50 rounded-lg">
                <ChartBarIcon className="w-5 h-5 text-sky-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Ежемесячные заявки</h3>
            </div>
            <button className="text-slate-400 hover:text-sky-500 transition-colors">
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 rounded-lg">
              <div className="text-center px-4">
                <ChartBarIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">
                  График заявок будет здесь
            </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-50 rounded-lg">
                <ArrowTrendingUpIcon className="w-5 h-5 text-sky-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Распределение по статусам</h3>
            </div>
            <button className="text-slate-400 hover:text-sky-500 transition-colors">
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 rounded-lg">
              <div className="text-center px-4">
                <ChartBarIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">
                  Диаграмма статусов будет здесь
            </p>
            </div>
          </div>
        </div>
        </div>

        {/* Recent activity section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-50 rounded-lg">
                <ClockIcon className="w-5 h-5 text-sky-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Недавняя активность</h3>
            </div>
            <div className="flex items-center text-sm text-slate-500">
              <CalendarIcon className="w-4 h-4 mr-1" />
              Сегодня
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="p-2 bg-sky-50 rounded-lg flex-shrink-0">
                    <div className="text-sky-600">
                      {activity.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800">
                      {activity.type === 'merchant_added' && 'Новый предприниматель'}
                      {activity.type === 'application_approved' && 'Заявка одобрена'}
                      {activity.type === 'application_rejected' && 'Заявка отклонена'}
                      {activity.type === 'merchant_blocked' && 'Предприниматель заблокирован'}
                    </div>
                    <div className="text-sm text-slate-600 mt-0.5">
                      {activity.merchant}
                      {activity.amount && <span className="font-medium"> • {activity.amount}</span>}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center">
                      <ClockIcon className="w-3.5 h-3.5 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-sky-500 p-1">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 