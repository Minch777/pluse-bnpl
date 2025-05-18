'use client';

import { useState, useContext, useEffect } from 'react';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
  DocumentIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  PlusIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { SidebarContext } from '@/app/merchant/layout';
import applicationService, { Application, ApplicationMetrics } from '@/api/services/applicationService';
import merchantService from '@/api/services/merchantService';

// Modern color palette - matching link page
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

// Обновляем тип, добавляя произвольный период
type Period = 'today' | 'yesterday' | 'week' | 'month' | 'custom';

// Stat Card component
function StatCard({ 
  title, 
  value, 
  icon, 
  highlight = false 
}: { 
  title: string; 
  value: string; 
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
      </div>
    </div>
  );
}

// Добавляем компонент модального окна для выбора дат
function DatePickerModal({
  isOpen,
  onClose,
  onApply,
}: {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: string, endDate: string) => void;
}) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white w-full max-w-md rounded-xl p-6 shadow-xl transition-all transform animate-fadeIn">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-medium text-slate-800">Выберите период</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Начальная дата
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border-slate-300 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Конечная дата
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border-slate-300 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(startDate, endDate);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all"
              disabled={!startDate || !endDate}
            >
              Применить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MerchantDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');
  const router = useRouter();
  const { isMobile } = useContext(SidebarContext);
  const [currentPage, setCurrentPage] = useState(1);
  // State for applications and metrics
  const [applications, setApplications] = useState<Application[]>([]);
  const [metrics, setMetrics] = useState<ApplicationMetrics>({
    totalAmount: 0,
    averageAmount: 0,
    totalApplications: 0
  });
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noApplications, setNoApplications] = useState(false);
  
  // Pagination state
  const [limit] = useState(10);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  
  // Добавляем состояния для работы с произвольным периодом
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{start: string, end: string}>({
    start: '', 
    end: ''
  });

  const [merchant, setMerchant] = useState<any>(null);

  // Function to load application data
  const loadApplicationsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setNoApplications(false);
      
      console.log('Fetching applications from API...');
      
      // Fetch applications with pagination and filters
      const applicationsData = await applicationService.getApplications({
        page: currentPage,
        limit,
        status: statusFilter
      });
      
      console.log('Applications data received:', applicationsData);
      
      // Set empty applications by default
      if (!applicationsData || !applicationsData.applications) {
        console.log('No applications data received or invalid format');
        setNoApplications(true);
        setApplications([]);
        setTotalCount(0);
        return;
      }
      
      setApplications(applicationsData.applications);
      setTotalCount(applicationsData.total || 0);
      
      // If we got data but there are no applications, set the noApplications flag
      if (applicationsData.applications.length === 0) {
        console.log('Applications array is empty');
        setNoApplications(true);
      }
      
      // Fetch metrics for the dashboard
      console.log('Fetching metrics from API...');
      const metricsData = await applicationService.getApplicationMetrics();
      console.log('Metrics data received:', metricsData);
      setMetrics(metricsData);
      
    } catch (err: any) {
      console.error('Failed to fetch application data:', err);
      
      // Always show the empty state instead of an error message
      // Since we want a nicer UX when there are no applications
      setNoApplications(true);
      setApplications([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to fetch merchant data and application link
  const fetchMerchantData = async () => {
    try {
      const merchantData = await merchantService.getCurrentMerchant();
      setMerchant(merchantData);
    } catch (err) {
      console.error('Error fetching merchant data:', err);
    }
  };
  
  // Function to get application link
  const getApplicationLink = () => {
    if (!merchant) return '/public';
    
    return `${process.env.NEXT_PUBLIC_FRONTEND_URL}/public/${merchant.slug}`;
  };
  
  // Load data on component mount and when filters/pagination change
  useEffect(() => {
    loadApplicationsData();
    fetchMerchantData();
  }, [currentPage, limit, statusFilter, selectedPeriod]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };

  const getPeriodLabel = () => {
    switch(selectedPeriod) {
      case 'today': return 'Сегодня';
      case 'yesterday': return 'Вчера';
      case 'week': return 'За неделю';
      case 'month': return 'За месяц';
      case 'custom': return `${customDateRange.start} - ${customDateRange.end}`;
      default: return 'За период';
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage * limit < totalCount) {
    setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  // Обработчик для применения произвольного диапазона дат
  const handleApplyDateRange = (startDate: string, endDate: string) => {
    setCustomDateRange({ start: startDate, end: endDate });
    setSelectedPeriod('custom');
  };

  // Handle refresh button click
  const handleRefresh = () => {
    loadApplicationsData();
  };

  const getStatusDisplay = (status: string) => {
    console.log('Processing status:', status);
    
    // Преобразуем в нижний регистр для обработки в switch
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case 'issued':
      case 'approved':
      case 'одобрено':
        return (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium">
            <CheckCircleIcon className="w-3.5 h-3.5" />
            <span>Выдано</span>
          </div>
        );
      case 'pending': 
      case 'на рассмотрении':
      case 'created':
        return (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-medium">
            <ClockIcon className="w-3.5 h-3.5" />
            <span>В обработке</span>
          </div>
        );
      case 'rejected':
      case 'отказано':
        return (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium">
            <XCircleIcon className="w-3.5 h-3.5" />
            <span>Отклонено</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium">
            <DocumentIcon className="w-3.5 h-3.5" />
            <span>{status}</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Ваши заявки
        </h1>
        <p className="text-lg text-gray-600">
          Управляйте всеми заявками на рассрочку и отслеживайте статусы
        </p>
      </div>

      {/* Action row - Period filter and CTA Button */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        {/* Period filter tabs - left side */}
        <div className="inline-flex rounded-full border border-slate-200 p-1">
          <button
            onClick={() => setSelectedPeriod('today')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedPeriod === 'today' 
                ? 'bg-sky-50 text-sky-600' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Сегодня
          </button>
          <button
            onClick={() => setSelectedPeriod('yesterday')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedPeriod === 'yesterday' 
                ? 'bg-sky-50 text-sky-600' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Вчера
          </button>
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedPeriod === 'week' 
                ? 'bg-sky-50 text-sky-600' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Неделя
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedPeriod === 'month' 
                ? 'bg-sky-50 text-sky-600' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Месяц
          </button>
          <button
            onClick={() => setIsDatePickerOpen(true)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              selectedPeriod === 'custom' 
                ? 'bg-sky-50 text-sky-600' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
            title="Выбрать диапазон дат"
          >
            <CalendarDaysIcon className="h-4 w-4" />
            {selectedPeriod === 'custom' && (
              <span className="hidden sm:inline">
                {customDateRange.start.split('-').reverse().join('.')} - {customDateRange.end.split('-').reverse().join('.')}
              </span>
            )}
          </button>
        </div>
        
        {/* Action button - right side */}
        <button 
          className="flex items-center gap-2 px-4 h-10 bg-transparent border border-sky-500 text-sky-600 rounded-lg text-sm font-medium hover:bg-sky-50 transition-colors"
          onClick={() => window.open(getApplicationLink(), '_blank')}
        >
          <PlusIcon className="w-5 h-5" />
          <span>Подать заявку</span>
        </button>
      </div>

      {/* Stats cards with clean design */}
      <div className="mb-8">
        {/* Grid of metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Approved Applications Card - HIGHLIGHT THIS ONE */}
          <StatCard 
            title="Выдано"
            value={`₸${formatAmount(metrics.totalAmount)}`}
            icon={<CurrencyDollarIcon className="w-5 h-5" />}
            highlight={true}
          />
          
          {/* Average Application Card */}
          <StatCard 
            title="Средний чек"
            value={`₸${formatAmount(metrics.averageAmount)}`}
            icon={<ChartBarIcon className="w-5 h-5" />}
          />
          
          {/* Applications Count Card */}
          <StatCard 
            title="Кол-во заявок"
            value={metrics.totalApplications.toString()}
            icon={<DocumentTextIcon className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Applications Table Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <h2 className="text-xl font-semibold text-slate-800">Заявки</h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">{getPeriodLabel()}</span>
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
            
            <button 
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
              onClick={handleRefresh}
            >
              <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Error message - hide it always in favor of empty state */}
        {error && !noApplications && (
          <div className="p-4 mx-6 my-4 bg-red-50 border border-red-100 rounded-md text-red-600">
            {error}
          </div>
        )}
        
        {/* Loading state */}
        {isLoading && !error && (
          <div className="p-12 flex justify-center">
            <ArrowPathIcon className="w-8 h-8 animate-spin text-sky-600" />
          </div>
        )}
        
        {/* Empty state for no applications */}
        {!isLoading && noApplications && (
          <div className="p-16 flex justify-center">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-6 p-4 rounded-full bg-slate-100 w-16 h-16 flex items-center justify-center">
                <DocumentTextIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-800 mb-3">У вас еще нет заявок</h3>
              <p className="text-slate-500 mb-8">Создайте вашу первую заявку на рассрочку, чтобы начать работу с платформой</p>
              <button 
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors mx-auto"
                onClick={() => window.open(getApplicationLink(), '_blank')}
              >
                <PlusIcon className="w-5 h-5" />
                <span>Подать заявку</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Applications Table */}
        {!isLoading && !noApplications && applications.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Клиент</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Сумма (₸)</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Дата</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {applications.map((application) => (
                <tr key={application.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-500">{application.id}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-800">{application.customerName}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">{formatAmount(application.amount)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{application.date}</td>
                  <td className="px-6 py-4">
                      {getStatusDisplay(application.status)}
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
        )}
        
        {/* Pagination */}
        {!isLoading && !error && applications.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-t border-slate-200">
          <span className="text-sm text-slate-500 mb-4 sm:mb-0">
              Показано {applications.length} из {totalCount} заявок (стр. {currentPage} из {totalPages || 1})
          </span>
          
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
            <div className="flex items-center gap-1.5">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                  currentPage === 1 
                    ? 'text-slate-400 border border-slate-200 cursor-not-allowed' 
                    : 'text-sky-600 hover:bg-sky-50 border border-sky-200'
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              
                {/* Generate page buttons dynamically */}
                {[...Array(Math.min(totalPages, 3))].map((_, index) => {
                  const page = index + 1;
                  return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all font-medium ${
                    currentPage === page
                      ? 'bg-sky-600 text-white font-bold shadow-md'
                      : 'text-slate-700 hover:bg-sky-50 border border-slate-200'
                  }`}
                >
                  {page}
                </button>
                  );
                })}
              
              <button
                onClick={goToNextPage}
                  disabled={currentPage >= totalPages}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                    currentPage >= totalPages 
                      ? 'text-slate-400 border border-slate-200 cursor-not-allowed' 
                      : 'text-sky-600 hover:bg-sky-50 border border-sky-200'
                  }`}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Модальное окно выбора периода */}
      <DatePickerModal 
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onApply={handleApplyDateRange}
      />
    </div>
  );
}

// Add fadeIn animation to global.css
// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }
// 
// .animate-fadeIn {
//   animation: fadeIn 0.5s ease-out;
// }