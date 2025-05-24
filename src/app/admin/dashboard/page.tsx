'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UserIcon,
  PhoneIcon,
  BanknotesIcon,
  CreditCardIcon,
  ArrowsUpDownIcon,
  ChartBarIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import applicationService from '@/api/services/applicationService';

// Определяем доступные статусы согласно API
const APPLICATION_STATUSES = [
  'PENDING',
  'APPROVED', 
  'REJECTED',
  'BANK_APPROVED',
  'BANK_REJECTED',
  'BANK_ERROR',
  'CANCELED'
] as const;

type ApplicationStatus = typeof APPLICATION_STATUSES[number];

// Маппинг статусов для отображения
const statusDisplayMap: Record<ApplicationStatus, { label: string; color: string; icon: React.ReactNode }> = {
  'PENDING': { 
    label: 'На рассмотрении', 
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <ClockIcon className="w-4 h-4" />
  },
  'APPROVED': { 
    label: 'Одобрено', 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <CheckCircleIcon className="w-4 h-4" />
  },
  'REJECTED': { 
    label: 'Отклонено', 
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: <XCircleIcon className="w-4 h-4" />
  },
  'BANK_APPROVED': { 
    label: 'Банк одобрил', 
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: <CheckCircleIcon className="w-4 h-4" />
  },
  'BANK_REJECTED': { 
    label: 'Банк отклонил', 
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: <XCircleIcon className="w-4 h-4" />
  },
  'BANK_ERROR': { 
    label: 'Ошибка банка', 
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: <ExclamationCircleIcon className="w-4 h-4" />
  },
  'CANCELED': { 
    label: 'Отменено', 
    color: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: <NoSymbolIcon className="w-4 h-4" />
  }
};

// Тип заявки согласно API
interface AdminApplication {
  id: string;
  shortId: number;
  amount: number;
  status: ApplicationStatus;
  loanType: 'INSTALLMENT' | 'LOAN';
  term: number;
  redemptionMethod: 'ANNUITET' | 'DIFFERENT';
  createdAt: string;
  updatedAt: string;
  
  // Client info
  firstName: string;
  lastName: string;
  middleName?: string;
  iin: string;
  phone: string;
  
  // Merchant info
  merchantId: string;
  merchantName: string;
  merchantBin: string;
  
  // Calculated fields
  clientName: string;
}

// Определяем тип периода
type PeriodFilter = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom';

// Stat Card component
function StatCard({ 
  title, 
  value, 
  icon, 
  highlight = false 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-4 transition-all duration-150 shadow-sm
      ${highlight 
        ? 'bg-gradient-to-br from-sky-50 to-sky-100/70 border-sky-100 hover:shadow-md' 
        : 'bg-white border-slate-200 hover:border-sky-200 hover:shadow-md'
      }`
    }>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-sky-100 text-sky-600' : 'bg-slate-50 text-slate-500'}`}>
          {icon}
        </div>
        <div>
          <span className="text-sm font-medium text-slate-600 block">{title}</span>
          <h3 className={`text-xl font-bold text-slate-800`}>{value}</h3>
        </div>
      </div>
    </div>
  );
}

// Add helper function for date formatting
const formatDateToISO = (date: Date, isEndOfDay = false) => {
  const newDate = new Date(date);
  if (isEndOfDay) {
    newDate.setHours(23, 59, 59, 999);
  } else {
    newDate.setHours(0, 0, 0, 0);
  }
  return newDate.toISOString();
};

// Add function to get date range based on period
const getDateRange = (period: PeriodFilter): { from: string, to: string } | null => {
  console.log('Getting date range for period:', period);
  
  // Получаем текущую дату и время
  const now = new Date();
  console.log('Current date/time:', now.toISOString());
  
  // Создаем дату для начала текущего дня (00:00:00)
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  console.log('Today start:', today.toISOString());
  
  switch (period) {
    case 'today': {
      const from = today.toISOString();
      const to = new Date(now).toISOString(); // Текущий момент
      console.log('Today range:', { from, to });
      return { from, to };
    }
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const from = yesterday.toISOString();
      
      const yesterdayEnd = new Date(today);
      yesterdayEnd.setMilliseconds(-1); // Конец вчерашнего дня
      const to = yesterdayEnd.toISOString();
      
      console.log('Yesterday range:', { from, to });
      return { from, to };
    }
    case 'week': {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const from = weekAgo.toISOString();
      const to = new Date(now).toISOString(); // Текущий момент
      console.log('Week range:', { from, to });
      return { from, to };
    }
    case 'month': {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const from = monthAgo.toISOString();
      const to = new Date(now).toISOString(); // Текущий момент
      console.log('Month range:', { from, to });
      return { from, to };
    }
    default:
      return null;
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Проверка токена при загрузке страницы
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Current token on dashboard page:', token);
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Column filters
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [amountFilter, setAmountFilter] = useState({ min: '', max: '' });
  const [loanTypeFilter, setLoanTypeFilter] = useState<'all' | 'INSTALLMENT' | 'LOAN'>('all');
  const [merchantFilter, setMerchantFilter] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<AdminApplication | null>(null);

  // Add effect to log period changes
  useEffect(() => {
    console.log('Period filter changed to:', periodFilter);
  }, [periodFilter]);

  // Update the period button click handler
  const handlePeriodChange = (value: PeriodFilter) => {
    console.log('=== PERIOD CHANGE HANDLER ===');
    console.log('Changing period from:', periodFilter, 'to:', value);
    
    if (value === 'custom') {
      setShowDatePicker(!showDatePicker);
    } else {
      // Сбрасываем страницу при изменении периода
      setCurrentPage(1);
      setPeriodFilter(value);
      setShowDatePicker(false);
      setDateFrom('');
      setDateTo('');
    }
  };

  // Build query params for API
  const queryParams = useMemo(() => {
    console.log('Building query params with:', {
      periodFilter,
      currentPage,
      itemsPerPage
    });

    const params: any = {
      page: currentPage,
      limit: itemsPerPage,
    };

    // Only add parameters if they have values
    if (searchQuery) params.search = searchQuery;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (periodFilter !== 'all' && periodFilter !== 'custom') {
      params.period = periodFilter;
    } else if (periodFilter === 'custom' && dateFrom && dateTo) {
      params.date_from = formatDateToISO(new Date(dateFrom));
      params.date_to = formatDateToISO(new Date(dateTo), true);
    }
    if (amountFilter.min) params.min_amount = Number(amountFilter.min);
    if (amountFilter.max) params.max_amount = Number(amountFilter.max);
    if (loanTypeFilter !== 'all') params.loan_type = loanTypeFilter;
    if (merchantFilter) params.merchant_search = merchantFilter;

    console.log('Final params to send:', params);
    return params;
  }, [
    currentPage,
    itemsPerPage,
    searchQuery,
    statusFilter,
    periodFilter,
    dateFrom,
    dateTo,
    amountFilter,
    loanTypeFilter,
    merchantFilter
  ]);

  // Fetch applications data using React Query
  const { 
    data: response, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['admin-applications', queryParams],
    queryFn: async ({ queryKey }) => {
      // Вычисляем параметры прямо здесь
      console.log('=== QUERY FUNCTION EXECUTING ===');
      console.log('Query key:', queryKey);
      console.log('Current periodFilter:', periodFilter);
      console.log('Current page:', currentPage);
      
      const response = await applicationService.getAdminApplications(queryKey[1]);
      console.log('Response received, total:', response?.total, 'applications:', response?.applications?.length);
      return response;
    },
    retry: 1,
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  // Period filter buttons
  const periodButtons = [
    { value: 'all' as const, label: 'Все' },
    { value: 'today' as const, label: 'Сегодня' },
    { value: 'yesterday' as const, label: 'Вчера' },
    { value: 'week' as const, label: 'Неделя' },
    { value: 'month' as const, label: 'Месяц' },
    { value: 'custom' as const, label: 'Даты' },
  ];

  // Transform applications data
  const applications = response?.applications || [];
  const totalApplications = response?.total || 0;
  const totalPages = Math.ceil(totalApplications / itemsPerPage);

  // Calculate statistics from received data only
  const statistics = {
    total: totalApplications,
    approved: applications.filter(app => app?.status === 'APPROVED' || app?.status === 'BANK_APPROVED').length,
    pending: applications.filter(app => app?.status === 'PENDING').length,
    rejected: applications.filter(app => app?.status === 'REJECTED' || app?.status === 'BANK_REJECTED').length,
    totalAmount: applications.reduce((sum, app) => sum + (app?.amount || 0), 0)
  };

  // Format amount
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' ₸';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const clearFilters = () => {
    console.log('Clearing all filters');
    setSearchQuery('');
    setPeriodFilter('all');
    setDateFrom('');
    setDateTo('');
    setStatusFilter('all');
    setAmountFilter({ min: '', max: '' });
    setLoanTypeFilter('all');
    setMerchantFilter('');
    setCurrentPage(1);
    
    // Инвалидируем кеш запросов
    queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
  };

  // Page numbers generation
  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (typeof i === 'number' && i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (typeof i === 'number' && i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      if (typeof i === 'number') {
        l = i;
      }
    });

    return rangeWithDots;
  };

  const openApplicationModal = (application: AdminApplication) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const closeApplicationModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    console.log('Changing page from', currentPage, 'to', newPage);
    setCurrentPage(newPage);
  };

  // Handle custom date changes
  const handleDateFromChange = (value: string) => {
    console.log('Date from changed to:', value);
    setDateFrom(value);
    if (value && dateTo) {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
    }
  };

  const handleDateToChange = (value: string) => {
    console.log('Date to changed to:', value);
    setDateTo(value);
    if (dateFrom && value) {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
    </div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">
      <p>Ошибка: {(error as any)?.message || 'Произошла ошибка при загрузке данных'}</p>
      <button 
        onClick={() => refetch()}
        className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
      >
        Попробовать снова
      </button>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Панель управления</h1>
          <p className="mt-1 text-sm text-gray-600">
            Управление заявками и мониторинг активности
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Всего заявок"
          value={statistics.total}
          icon={<DocumentTextIcon className="w-5 h-5" />}
        />
        <StatCard 
          title="Одобрено"
          value={statistics.approved}
          icon={<CheckCircleIcon className="w-5 h-5" />}
          highlight={true}
        />
        <StatCard 
          title="На рассмотрении"
          value={statistics.pending}
          icon={<ClockIcon className="w-5 h-5" />}
        />
        <StatCard 
          title="Отклонено"
          value={statistics.rejected}
          icon={<XCircleIcon className="w-5 h-5" />}
        />
        <StatCard 
          title="Общая сумма"
          value={formatAmount(statistics.totalAmount)}
          icon={<CurrencyDollarIcon className="w-5 h-5" />}
        />
      </div>

      {/* Period Filter Buttons */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {periodButtons.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handlePeriodChange(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                (value === 'custom' && showDatePicker) || periodFilter === value
                  ? 'bg-sky-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Date Range Picker */}
        {showDatePicker && (
          <div className="mt-4 flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">От</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => handleDateFromChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">До</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => handleDateToChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Global Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по ID, клиенту, телефону, ИИН..."
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Items per page */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Показывать</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <XMarkIcon className="h-4 w-4" />
              Очистить фильтры
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col gap-2">
                    <span>ID</span>
                    <input
                      type="text"
                      placeholder="Поиск по ID"
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sky-500"
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col gap-2">
                    <span>Клиент</span>
                    <input
                      type="text"
                      placeholder="Поиск по клиенту"
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sky-500"
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col gap-2">
                    <span>Мерчант</span>
                    <input
                      type="text"
                      placeholder="Поиск по мерчанту"
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sky-500"
                      value={merchantFilter}
                      onChange={(e) => setMerchantFilter(e.target.value)}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col gap-2">
                    <span>Сумма</span>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="От"
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sky-500"
                        value={amountFilter.min}
                        onChange={(e) => setAmountFilter(prev => ({ ...prev, min: e.target.value }))}
                      />
                      <input
                        type="number"
                        placeholder="До"
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sky-500"
                        value={amountFilter.max}
                        onChange={(e) => setAmountFilter(prev => ({ ...prev, max: e.target.value }))}
                      />
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col gap-2">
                    <span>Тип/Срок</span>
                    <select
                      value={loanTypeFilter}
                      onChange={(e) => setLoanTypeFilter(e.target.value as typeof loanTypeFilter)}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="all">Все</option>
                      <option value="INSTALLMENT">Рассрочка</option>
                      <option value="LOAN">Кредит</option>
                    </select>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата создания
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex flex-col gap-2">
                    <span>Статус</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="all">Все</option>
                      {APPLICATION_STATUSES.map(status => (
                        <option key={status} value={status}>{statusDisplayMap[status].label}</option>
                      ))}
                    </select>
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!applications || applications.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    <DocumentTextIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    Заявки не найдены
                  </td>
                </tr>
              ) : (
                applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{application.shortId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{application.clientName}</div>
                        <div className="text-sm text-gray-500">{application.iin}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.merchantName}</div>
                      <div className="text-sm text-gray-500">БИН: {application.merchantBin}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatAmount(application.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{application.loanType === 'INSTALLMENT' ? 'Рассрочка' : 'Кредит'}</div>
                      <div>{application.term} мес.</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        statusDisplayMap[application.status as ApplicationStatus]?.color || 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                        {statusDisplayMap[application.status as ApplicationStatus]?.icon || null}
                        {statusDisplayMap[application.status as ApplicationStatus]?.label || application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => openApplicationModal(application)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Показано <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> -{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, totalApplications)}
                </span>{' '}
                из <span className="font-medium">{totalApplications}</span> результатов
              </div>
              
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                
                {getPageNumbers().map((number, index) => (
                  <button
                    key={index}
                    onClick={() => typeof number === 'number' && setCurrentPage(number)}
                    disabled={number === '...'}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      currentPage === number
                        ? 'z-10 bg-sky-600 border-sky-600 text-white'
                        : number === '...'
                        ? 'bg-white border-gray-300 text-gray-700 cursor-default'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Информация о заявке</h3>
                  <p className="text-sm text-slate-500 mt-1">ID: #{selectedApplication.shortId}</p>
                </div>
                <button
                  onClick={closeApplicationModal}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  statusDisplayMap[selectedApplication.status]?.color || 'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                  {statusDisplayMap[selectedApplication.status]?.icon || null}
                  {statusDisplayMap[selectedApplication.status]?.label || selectedApplication.status}
                </span>
                <span className="text-sm text-slate-500">
                  Создана {formatDate(selectedApplication.createdAt)}
                </span>
              </div>

              {/* Client Info Section */}
              <div className="bg-slate-50 rounded-xl p-5">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-slate-600" />
                  Информация о клиенте
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">ФИО</label>
                    <p className="text-slate-900 font-medium">{selectedApplication.clientName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">ИИН</label>
                    <p className="text-slate-900 font-mono">{selectedApplication.iin}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Телефон</label>
                    <p className="text-slate-900 flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-slate-400" />
                      {selectedApplication.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Loan Info Section */}
              <div className="bg-slate-50 rounded-xl p-5">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5 text-slate-600" />
                  Информация о кредите
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Сумма</label>
                    <p className="text-slate-900 font-bold text-lg">{formatAmount(selectedApplication.amount)}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Тип кредита</label>
                    <p className="text-slate-900">{selectedApplication.loanType === 'INSTALLMENT' ? 'Рассрочка' : 'Кредит'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Срок</label>
                    <p className="text-slate-900">{selectedApplication.term} месяцев</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Тип погашения</label>
                    <p className="text-slate-900">{selectedApplication.redemptionMethod === 'ANNUITET' ? 'Аннуитет' : 'Дифференцированный'}</p>
                  </div>
                </div>
              </div>

              {/* Merchant Info Section */}
              <div className="bg-slate-50 rounded-xl p-5">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BuildingOfficeIcon className="w-5 h-5 text-slate-600" />
                  Информация о мерчанте
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Компания</label>
                    <p className="text-slate-900">{selectedApplication.merchantName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">БИН</label>
                    <p className="text-slate-900 font-mono">{selectedApplication.merchantBin}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                {selectedApplication.status === 'PENDING' && (
                  <>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5" />
                      Одобрить
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2">
                      <XCircleIcon className="w-5 h-5" />
                      Отклонить
                    </button>
                  </>
                )}
                <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                  Просмотреть детали
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 