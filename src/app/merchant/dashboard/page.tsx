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
  BanknotesIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  XMarkIcon,
  UserCircleIcon,
  PhoneIcon,
  IdentificationIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { SidebarContext } from '@/app/merchant/layout';
import applicationService, { Application, ApplicationMetrics, ApplicationFilterParams, SingleApplication } from '@/api/services/applicationService';
import merchantService from '@/api/services/merchantService';
import StatusBadge from '@/components/StatusBadge';
import { ApplicationStatus, statusMappings } from '@/utils/statusMappings';
import Link from 'next/link';

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
type Period = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom';

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
  startDateValue,
  endDateValue
}: {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: string, endDate: string) => void;
  startDateValue: string;
  endDateValue: string;
}) {
  // Функция для получения сегодняшней даты в формате YYYY-MM-DD
  const getTodayDate = (): string => {
    const today = new Date();
    return formatDateForInput(today);
  };
  
  // Функция для получения даты месяц назад в формате YYYY-MM-DD
  const getMonthAgoDate = (): string => {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return formatDateForInput(monthAgo);
  };
  
  // Форматирует дату для input type="date"
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState(startDateValue || getMonthAgoDate());
  const [endDate, setEndDate] = useState(endDateValue || getTodayDate());
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Если даты не были выбраны ранее, устанавливаем дефолтные значения
      setStartDate(startDateValue || getMonthAgoDate());
      setEndDate(endDateValue || getTodayDate());
      setError('');
    }
  }, [isOpen, startDateValue, endDateValue]);

  // Валидация дат при изменении
  const validateDates = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start > end) {
        setError('Начальная дата не может быть позже конечной');
        return false;
      }
    }
    
    setError('');
    return true;
  };

  // Обработчики изменения дат
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  // Проверяем валидацию при изменении дат
  useEffect(() => {
    validateDates();
  }, [startDate, endDate]);

  if (!isOpen) return null;

  const isValid = startDate && endDate && !error;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl transition-all transform animate-fadeIn">
          <div className="flex justify-between items-center py-4 px-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">Выберите даты</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors rounded-md hover:bg-gray-100 p-1">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {/* Начальная дата с иконкой и подписью */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Начальная дата
                </label>
                <div className="relative rounded-md border border-slate-300 hover:border-sky-500 transition-all focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 bg-white overflow-hidden">
                  <input
                    id="start-date-input"
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="pl-4 pr-4 py-3 block w-full rounded-md border-0 shadow-none focus:outline-none focus:ring-0 text-base text-black h-12"
                    style={{ 
                      fontSize: '16px', 
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      backgroundImage: 'none',
                      backgroundSize: '0',
                    }}
                  />
                </div>
              </div>

              {/* Конечная дата с иконкой и подписью */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Конечная дата
                </label>
                <div className="relative rounded-md border border-slate-300 hover:border-sky-500 transition-all focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 bg-white overflow-hidden">
                  <input
                    id="end-date-input"
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="pl-4 pr-4 py-3 block w-full rounded-md border-0 shadow-none focus:outline-none focus:ring-0 text-base text-black h-12"
                    style={{ 
                      fontSize: '16px', 
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      backgroundImage: 'none',
                      backgroundSize: '0',
                    }}
                  />
                </div>
              </div>
              
              {/* Сообщение об ошибке */}
              {error && (
                <div className="bg-red-50 p-3 rounded-lg text-sm text-red-800 flex items-center">
                  <div className="p-1 rounded-md bg-red-100 mr-2">
                    <XMarkIcon className="h-4 w-4 text-red-500" />
                  </div>
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-5 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => {
                  if (validateDates()) {
                    onApply(startDate, endDate);
                    onClose();
                  }
                }}
                disabled={!isValid}
                className={`px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all ${
                  isValid 
                    ? 'bg-sky-600 hover:bg-sky-700' 
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Компонент модального окна с информацией о заявке
function ApplicationModal({
  isOpen,
  onClose,
  application
}: {
  isOpen: boolean;
  onClose: () => void;
  application: SingleApplication | null;
}) {
  if (!isOpen || !application) return null;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ₸';
  };

  const getLoanTypeText = (type: string) => {
    return type === 'LOAN' ? 'Кредит' : 'Рассрочка';
  };

  const getStatusDisplay = (status: string) => {
    if (status in statusMappings) {
      return <StatusBadge status={status as ApplicationStatus} size="md" />;
    }
    return (
      <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
        {status}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 animate-backdrop-in" 
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-xl border border-gray-200 transition-all duration-300 transform animate-modal-in">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">Заявка #{application.shortId}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-slate-500">Статус:</span>
                    {getStatusDisplay(application.status)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={onClose} 
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors rounded-lg"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Main details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Amount */}
              <div className="bg-sky-50 border border-sky-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BanknotesIcon className="h-5 w-5 text-sky-600" />
                  <span className="text-sm font-medium text-sky-700">Сумма</span>
                </div>
                <p className="text-xl font-semibold text-slate-800">{formatAmount(application.amount)}</p>
              </div>

              {/* Type */}
              <div className="bg-sky-50 border border-sky-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DocumentTextIcon className="h-5 w-5 text-sky-600" />
                  <span className="text-sm font-medium text-sky-700">Тип</span>
                </div>
                <p className="text-lg font-medium text-slate-800">{getLoanTypeText(application.loanType || application.type || '')}</p>
              </div>

              {/* Term */}
              <div className="bg-sky-50 border border-sky-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="h-5 w-5 text-sky-600" />
                  <span className="text-sm font-medium text-sky-700">Срок</span>
                </div>
                <p className="text-lg font-medium text-slate-800">{application.term} мес.</p>
              </div>
            </div>

            {/* Client information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Данные клиента</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 tracking-wider mb-1">
                      Фамилия
                    </label>
                    <p className="text-slate-800 font-medium">{application.lastName || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 tracking-wider mb-1">
                      Имя
                    </label>
                    <p className="text-slate-800 font-medium">{application.firstName || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 tracking-wider mb-1">
                      Отчество
                    </label>
                    <p className="text-slate-800 font-medium">{application.middleName || 'Не указано'}</p>
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 tracking-wider mb-1">
                      ИИН
                    </label>
                    <p className="text-slate-800 font-mono font-medium">{application.iin || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 tracking-wider mb-1">
                      Телефон
                    </label>
                    <p className="text-slate-800 font-medium">{application.phone || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 tracking-wider mb-1">
                      Дата создания
                    </label>
                    <p className="text-slate-800 font-medium">
                      {new Date(application.createdAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MerchantDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('all');
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
  
  // Add search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // Pagination state
  const [limit] = useState(10);
  
  // Добавляем состояния для работы с произвольным периодом
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{start: string, end: string}>({
    start: '', 
    end: ''
  });

  const [merchant, setMerchant] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<SingleApplication | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [loadingApplicationDetails, setLoadingApplicationDetails] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Function to get period parameter for API based on selected period
  const getPeriodParams = (): Partial<ApplicationFilterParams> => {
    switch(selectedPeriod) {
      case 'all':
        return {}; // No filters for "all" option
      case 'today':
        return { period: 'day' };
      case 'yesterday':
        return { period: 'yesterday' };
      case 'week':
        return { period: 'week' };
      case 'month':
        return { period: 'month' };
      case 'custom':
        return { 
          date_from: customDateRange.start ? `${customDateRange.start}T00:00:00Z` : undefined,
          date_to: customDateRange.end ? `${customDateRange.end}T23:59:59Z` : undefined 
        };
      default:
        return {};
    }
  };

  // Function to load application data
  const loadApplicationsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setNoApplications(false);
      
      // Get period parameters
      const periodParams = getPeriodParams();
      
      // Create params object with search parameter only if it's not empty
      const apiParams: ApplicationFilterParams = {
        page: currentPage,
        limit,
        ...periodParams,
      };
      
      // Check if search query is possibly an ID (starts with # followed by numbers only)
      const idPattern = /^#?(\d+)$/;
      const idMatch = debouncedSearchQuery.trim().match(idPattern);
      
      if (idMatch) {
        // If search is in ID format, extract the number and search by shortId
        apiParams.shortId = parseInt(idMatch[1]);
        console.log('Searching by ID:', apiParams.shortId);
      } else if (debouncedSearchQuery.trim()) {
        // Otherwise search by client name
        apiParams.client_name = debouncedSearchQuery.trim();
      }
      
      console.log('Fetching applications with params:', apiParams);
      
      // Fetch applications with pagination, filters, period and search
      const applicationsData = await applicationService.getApplications(apiParams);
      
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
      
      // Fetch metrics for the dashboard with the same period filters (without search)
      console.log('Fetching metrics from API with period:', periodParams);
      const metricsData = await applicationService.getApplicationMetrics(periodParams);
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
  }, [currentPage, limit, selectedPeriod, customDateRange.start, customDateRange.end, debouncedSearchQuery]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };

  const getPeriodLabel = () => {
    switch(selectedPeriod) {
      case 'all': return 'Все время';
      case 'today': return 'Сегодня';
      case 'yesterday': return 'Вчера';
      case 'week': return 'За неделю';
      case 'month': return 'За месяц';
      case 'custom': return `${customDateRange.start ? customDateRange.start.split('-').reverse().join('.') : ''} - ${customDateRange.end ? customDateRange.end.split('-').reverse().join('.') : ''}`;
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
    if (status in statusMappings) {
      return <StatusBadge status={status as ApplicationStatus} size="md" />;
    }
    return (
      <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
        {status}
      </span>
    );
  };
    
  // Reset all filters
  const resetFilters = () => {
    setSelectedPeriod('all');
    setCustomDateRange({ start: '', end: '' });
    setSearchQuery('');
    setDebouncedSearchQuery('');
  };

  // Check if any filter is applied
  const isFilterApplied = () => {
    return selectedPeriod !== 'all' || debouncedSearchQuery !== '';
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Функция для получения детальной информации о заявке
  const handleShowApplicationDetails = async (applicationId: string) => {
    try {
      setLoadingApplicationDetails(true);
      // Ищем заявку в списке, чтобы получить originalId
      const application = applications.find(app => app.id === applicationId);
      if (!application) {
        console.error('Application not found in list');
        return;
      }
      
      console.log('Using originalId for API request:', application.originalId);
      const applicationDetails = await applicationService.getApplication(application.originalId);
      setSelectedApplication(applicationDetails);
      setIsApplicationModalOpen(true);
    } catch (error) {
      console.error('Error fetching application details:', error);
      // Можно показать уведомление об ошибке
    } finally {
      setLoadingApplicationDetails(false);
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
        <div className="flex items-center gap-4">
        <div className="inline-flex rounded-full border border-slate-200 p-1">
            <button
              onClick={() => setSelectedPeriod('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedPeriod === 'all' 
                  ? 'bg-sky-50 text-sky-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Все
            </button>
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
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedPeriod === 'custom' 
                ? 'bg-sky-50 text-sky-600' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
            title="Выбрать диапазон дат"
          >
            Даты
            {selectedPeriod === 'custom' && customDateRange.start && customDateRange.end && (
              <span className="hidden sm:inline ml-1.5">
                ({customDateRange.start.split('-').reverse().join('.')} - {customDateRange.end.split('-').reverse().join('.')})
              </span>
            )}
          </button>
          </div>
          
          {/* Reset filters button - only shown when not on "All" */}
          {selectedPeriod !== 'all' && (
            <button 
              onClick={resetFilters}
              className="text-sm text-sky-600 hover:text-sky-800 flex items-center gap-1.5"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Сбросить</span>
            </button>
          )}
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
            icon={<BanknotesIcon className="w-5 h-5" />}
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
                placeholder="Поиск по имени клиента или ID заявки (#123)"
                className="w-full sm:w-auto pl-9 pr-3 py-2 text-sm text-black border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-500"
                  onClick={() => setSearchQuery('')}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
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
              {isFilterApplied() ? (
                <>
                  <h3 className="text-xl font-medium text-slate-800 mb-3">Нет заявок по выбранному фильтру</h3>
                  <p className="text-slate-500 mb-8">
                    Попробуйте изменить параметры фильтрации или сбросьте фильтры, чтобы увидеть все заявки
                  </p>
                  <button 
                    onClick={resetFilters}
                    className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors mx-auto"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    <span>Сбросить фильтры</span>
                  </button>
                </>
              ) : (
                <>
              <h3 className="text-xl font-medium text-slate-800 mb-3">У вас еще нет заявок</h3>
              <p className="text-slate-500 mb-8">Создайте вашу первую заявку на рассрочку, чтобы начать работу с платформой</p>
              <button 
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors mx-auto"
                onClick={() => window.open(getApplicationLink(), '_blank')}
              >
                <PlusIcon className="w-5 h-5" />
                <span>Подать заявку</span>
              </button>
                </>
              )}
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
                    <button 
                      onClick={() => handleShowApplicationDetails(application.id)}
                      disabled={loadingApplicationDetails}
                      className="text-slate-400 hover:text-sky-500 transition-colors disabled:opacity-50"
                    >
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
        startDateValue={customDateRange.start}
        endDateValue={customDateRange.end}
      />

      {/* Модальное окно с информацией о заявке */}
      <ApplicationModal 
        isOpen={isApplicationModalOpen}
        onClose={() => {
          setIsApplicationModalOpen(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
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