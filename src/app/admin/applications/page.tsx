'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  UserIcon,
  PhoneIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  CheckIcon,
  NoSymbolIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  ArrowsUpDownIcon,
  EllipsisHorizontalIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';
import { ApplicationStatus } from '@/utils/statusMappings';
import StatusBadge from '@/components/StatusBadge';
import applicationService from '@/api/services/applicationService';

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

// Application type
type Application = {
  id: string;
  clientName: string;
  amount: string;
  date: string;
  status: ApplicationStatus;
  phone: string;
  merchant: string;
  merchantId: string;
};

// Stat Card component - matches merchant dashboard style
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

// Format number consistently for both server and client rendering
const formatAmount = (amount: string) => {
  // Extract just the digits
  const numericValue = amount.replace(/\D/g, '');
  
  // Format with spaces for thousands
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(parseInt(numericValue)) + ' ₸';
};

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getApplications().then((data) => {
      setApplications(data.applications);
      setLoading(false);
    });
  }, []);

  // Calculate summary statistics with memoization to prevent re-calculation
  const stats = useMemo(() => {
    return {
      total: applications.length,
      approved: applications.filter(app => app.status === 'Одобрено').length,
      rejected: applications.filter(app => app.status === 'Отказано').length,
      pending: applications.filter(app => app.status === 'На рассмотрении').length,
      totalAmount: applications.reduce((sum, app) => sum + parseInt(app.amount), 0),
    };
  }, [applications]);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'Все'>('Все');
  const [merchantFilter, setMerchantFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Get unique merchants for filter dropdown
  const merchants = useMemo(() => {
    return Array.from(new Set(applications.map(app => app.merchant))).map(
    merchantName => ({
      name: merchantName,
      id: applications.find(app => app.merchant === merchantName)?.merchantId || ''
    })
  );
  }, [applications]);
  
  // Filter applications based on criteria
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
    // Status filter
    if (statusFilter !== 'Все' && app.status !== statusFilter) return false;
    
    // Merchant filter
    if (merchantFilter && app.merchantId !== merchantFilter) return false;
    
    // Date filter
    if (dateFilter && app.date !== dateFilter) return false;
    
    // Search query (case insensitive)
    if (searchQuery && 
        !app.clientName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !app.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !app.phone.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  }, [applications, statusFilter, merchantFilter, dateFilter, searchQuery]);
  
  // Pagination
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplications, currentPage]);
  
  const pageCount = useMemo(() => {
    return Math.ceil(filteredApplications.length / itemsPerPage);
  }, [filteredApplications]);
  
  const handleNextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  // Render status badge with appropriate styles
  const renderStatusBadge = (status: string) => {
    // Если статус распознан, используем StatusBadge, иначе показываем текстом
    try {
      return <StatusBadge status={status as ApplicationStatus} size="sm" />;
    } catch {
      return <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };
  
  // Display action menu for a row
  const ActionMenu = ({ status }: { status: ApplicationStatus }) => {
    const [showMenu, setShowMenu] = useState(false);
    
    return (
      <div className="relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-slate-100 transition-all"
          title="Действия"
        >
          <EllipsisHorizontalIcon className="w-5 h-5" />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 w-48">
            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              <EyeIcon className="w-4 h-4 text-slate-500" />
              <span>Просмотреть</span>
            </button>
            
            {status === 'На рассмотрении' && (
              <>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-emerald-600" />
                  <span>Одобрить</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <NoSymbolIcon className="w-4 h-4 text-red-600" />
                  <span>Отклонить</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Заявки
        </h1>
        <p className="text-lg text-gray-600">
          Просмотр и управление всеми заявками в системе
        </p>
      </div>

      {/* Stats cards with clean design */}
      <div className="mb-8">
        {/* Grid of metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
            title="Всего заявок"
            value={stats.total}
            icon={<DocumentTextIcon className="w-5 h-5" />}
          />
          
          <StatCard 
            title="Одобрено"
            value={stats.approved}
            icon={<CheckCircleIcon className="w-5 h-5" />}
            highlight={true}
          />
          
          <StatCard 
            title="На рассмотрении"
            value={stats.pending}
            icon={<ClockIcon className="w-5 h-5" />}
          />
          
          <StatCard 
            title="Отказано"
            value={stats.rejected}
            icon={<XCircleIcon className="w-5 h-5" />}
          />
        </div>
      </div>
      
      {/* Applications section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <h2 className="text-xl font-semibold text-slate-800">Список заявок</h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Всего: {stats.total}
            </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh} 
              className="flex items-center gap-2 px-4 h-10 bg-transparent border border-sky-500 text-sky-600 rounded-lg text-sm font-medium hover:bg-sky-50 transition-colors"
          >
            <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Обновить</span>
          </button>
          
          <button 
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className={`flex items-center gap-2 px-4 h-10 ${
              isFilterExpanded 
                  ? 'bg-sky-600 text-white' 
                  : 'bg-transparent border border-sky-500 text-sky-600 hover:bg-sky-50'
              } rounded-lg text-sm font-medium transition-colors`}
          >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            <span>Фильтры</span>
          </button>
          </div>
        </div>
        
        {/* Search bar - always visible */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
              </div>
            <input
              type="text"
              placeholder="Поиск по имени, ID или телефону"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          
            <div className="relative min-w-[180px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="Все">Все статусы</option>
              <option value="Одобрено">Одобрено</option>
              <option value="Отказано">Отказано</option>
              <option value="На рассмотрении">На рассмотрении</option>
            </select>
              <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          </div>
          
        {/* Advanced filters that expand/collapse */}
        {isFilterExpanded && (
            <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
              Предприниматель
            </label>
                <div className="relative">
            <select
              value={merchantFilter}
              onChange={(e) => setMerchantFilter(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">Все предприниматели</option>
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>{merchant.name}</option>
              ))}
            </select>
                    <BuildingStorefrontIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
          </div>
          
              <div className="md:w-48">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
              Дата
            </label>
                <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                  />
                    <CalendarDaysIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setStatusFilter('Все');
                    setMerchantFilter('');
                    setDateFilter('');
                    setSearchQuery('');
                  }}
                    className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                >
                  Сбросить фильтры
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Filter summary */}
          <div className="mt-4 text-sm text-slate-500">
            Найдено {filteredApplications.length} заявок
            {statusFilter !== 'Все' && <span className="ml-2 px-2 py-0.5 bg-sky-50 text-sky-600 rounded-full text-xs font-medium">{statusFilter}</span>}
            {merchantFilter && <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded-full text-xs font-medium">{merchants.find(m => m.id === merchantFilter)?.name}</span>}
            {dateFilter && <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded-full text-xs font-medium">{dateFilter}</span>}
            {searchQuery && <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded-full text-xs font-medium">"{searchQuery}"</span>}
          </div>
        </div>
        
        {/* Applications table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Клиент</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Предприниматель</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Дата</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Сумма</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                    <DocumentTextIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-base font-medium mb-1">Заявки не найдены</p>
                    <p className="text-sm">Попробуйте изменить параметры поиска</p>
                  </td>
                </tr>
              ) : (
                paginatedApplications.map((application) => (
                  <tr 
                    key={application.id} 
                    className="hover:bg-slate-50 transition-all cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 font-medium">
                          {application.clientName[0]}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{application.clientName}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{application.id} • {application.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {application.merchant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatDate(application.date)}
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-base font-semibold text-slate-800">
                        {formatAmount(application.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ActionMenu status={application.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-t border-slate-200">
          <span className="text-sm text-slate-500 mb-4 sm:mb-0">
            Показано {paginatedApplications.length} из {filteredApplications.length} заявок
          </span>
          
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
            <div className="flex items-center gap-1.5">
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 border border-slate-200 cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            
              {Array.from({ length: Math.min(3, pageCount) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all font-medium ${
                      currentPage === pageNum
                        ? 'bg-sky-600 text-white font-bold shadow-md'
                        : 'text-slate-700 hover:bg-sky-50 border border-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            
            <button 
              onClick={handleNextPage}
              disabled={currentPage === pageCount || pageCount === 0}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-sky-600 hover:bg-sky-50 border border-sky-200 transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Analytics section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Status distribution chart */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-50 rounded-lg">
                <ChartBarIcon className="w-5 h-5 text-sky-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Статистика заявок</h3>
            </div>
            <div className="text-sm font-medium bg-sky-50 text-sky-600 px-3 py-1 rounded-lg">
                {new Intl.NumberFormat('ru-RU', {
                  style: 'decimal',
                  useGrouping: true,
                  maximumFractionDigits: 0,
                }).format(stats.totalAmount)} ₸
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-sky-600"></div>
                    <span className="text-sm font-medium text-slate-700">Одобрено</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">{stats.approved}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-sky-600 h-full rounded-full" 
                    style={{ width: `${(stats.approved / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-medium text-slate-700">На рассмотрении</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">{stats.pending}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full" 
                    style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium text-slate-700">Отказано</span>
                  </div>
                  <span className="text-sm font-medium text-slate-800">{stats.rejected}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-red-500 h-full rounded-full" 
                    style={{ width: `${(stats.rejected / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Merchant activity */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-50 rounded-lg">
                <BuildingStorefrontIcon className="w-5 h-5 text-sky-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Активность предпринимателей</h3>
            </div>
            <button className="flex items-center gap-1 text-xs bg-sky-50 hover:bg-sky-100 text-sky-600 px-3 py-1.5 rounded-lg transition-all">
                <ArrowsUpDownIcon className="w-3.5 h-3.5" />
                <span>Сортировать</span>
              </button>
          </div>
          
          <div className="p-5">
            <div className="h-[220px] overflow-y-auto pr-1 space-y-3">
              {merchants.map((merchant) => {
                const merchantApps = applications.filter(app => app.merchantId === merchant.id);
                const approvedCount = merchantApps.filter(app => app.status === 'Одобрено').length;
                const percent = merchantApps.length ? Math.round((approvedCount / merchantApps.length) * 100) : 0;
                
                return (
                  <div key={merchant.id} className="p-3.5 rounded-lg border border-slate-200 hover:border-sky-300 hover:shadow-sm transition-all bg-white">
                    <div className="flex justify-between items-center mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                          <BuildingStorefrontIcon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-800">{merchant.name}</span>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 bg-sky-50 text-sky-600 rounded-lg">
                        {merchantApps.length} заявок
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-sky-600 h-full rounded-full" 
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-sky-600">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 