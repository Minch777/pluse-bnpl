'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { 
  UsersIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowPathIcon,
  EyeIcon,
  ShieldExclamationIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  PlusIcon,
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BanknotesIcon,
  ArrowUpIcon,
  GlobeAltIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import merchantService, { AdminMerchant } from '@/api/services/merchantService';

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

// Merchant status types based on API data
type MerchantStatus = 'Активен' | 'Заблокирован';

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

export default function AdminMerchants() {
  // Check token on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Current token on merchants page:', token);
  }, []);

  // Fetch merchants data using React Query
  const { 
    data: merchants = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['admin-merchants'],
    queryFn: async () => {
      const response = await merchantService.getAllMerchants();
      console.log('Merchants response:', response);
      return response;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Debug log
  console.log('Merchants data in component:', merchants);
  console.log('Loading state:', isLoading);
  console.log('Error state:', error);
  
  // Summary statistics
  const statistics = {
    total: merchants.length,
    active: merchants.filter(m => !m.isBlocked).length,
    blocked: merchants.filter(m => m.isBlocked).length,
  };
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<MerchantStatus | 'Все'>('Все');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<AdminMerchant | null>(null);
  
  // Filter merchants based on criteria
  const filteredMerchants = merchants.filter((merchant) => {
    // Status filter
    const merchantStatus = merchant.isBlocked ? 'Заблокирован' : 'Активен';
    if (statusFilter !== 'Все' && merchantStatus !== statusFilter) return false;
    
    // Search query (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchFields = [
        merchant.companyName,
        merchant.directorName,
        merchant.contactEmail,
        merchant.publicId,
        merchant.bin,
        merchant.website
      ].filter(Boolean); // Remove null/undefined values
      
      // Check if any field includes the search query
      const matchesSearch = searchFields.some(field => 
        field?.toLowerCase().includes(query)
      );
      
      if (!matchesSearch) return false;
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const createdDate = new Date(merchant.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          if (createdDate.toDateString() !== now.toDateString()) return false;
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (createdDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (createdDate < monthAgo) return false;
          break;
      }
    }
    
    return true;
  });
  
  // Sort merchants
  const sortedMerchants = [...filteredMerchants].sort((a, b) => {
    let aValue: any = a[sortField as keyof AdminMerchant];
    let bValue: any = b[sortField as keyof AdminMerchant];
    
    // Handle null/undefined values
    if (aValue === null || aValue === undefined) aValue = '';
    if (bValue === null || bValue === undefined) bValue = '';
    
    // Convert dates to timestamps for comparison
    if (sortField === 'createdAt' || sortField === 'updatedAt' || sortField === 'blockedAt') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }
    
    // Convert to lowercase for string comparison
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedMerchants.length / itemsPerPage);
  const paginatedMerchants = sortedMerchants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing merchants:', error);
    } finally {
      setIsRefreshing(false);
    }
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
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fadeIn pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Предприниматели
          </h1>
          <p className="text-lg text-gray-600">
            Управление партнерами платформы и анализ их активности
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <ArrowPathIcon className="w-8 h-8 animate-spin text-sky-600" />
          <span className="ml-2 text-slate-600">Загрузка данных...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 animate-fadeIn pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Предприниматели
          </h1>
          <p className="text-lg text-gray-600">
            Управление партнерами платформы и анализ их активности
          </p>
        </div>
        <div className="flex items-center justify-center py-12 text-red-600">
          <XCircleIcon className="w-8 h-8 mr-2" />
          <span>Ошибка при загрузке данных. Попробуйте обновить страницу.</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Предприниматели
        </h1>
        <p className="text-lg text-gray-600">
            Управление партнерами платформы и анализ их активности
          </p>
      </div>

      {/* Stats cards with clean design */}
      <div className="mb-8">
        {/* Grid of metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard 
            title="Всего предпринимателей"
            value={statistics.total}
            icon={<UsersIcon className="w-5 h-5" />}
          />
          
          <StatCard 
            title="Активные предприниматели"
            value={statistics.active}
            icon={<CheckCircleIcon className="w-5 h-5" />}
            highlight={true}
          />
          
          <StatCard 
            title="Заблокированные"
            value={statistics.blocked}
            icon={<XCircleIcon className="w-5 h-5" />}
          />
        </div>
      </div>
      
      {/* Merchants list section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <h2 className="text-xl font-semibold text-slate-800">Список предпринимателей</h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Всего: {statistics.total}
            </span>
          </div>
        </div>
        
        {/* Filters */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Поиск по названию, директору, email, ID, БИН или веб-сайту"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="Все">Все статусы</option>
                  <option value="Активен">Активен</option>
                  <option value="Заблокирован">Заблокирован</option>
                </select>
                <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="all">Все время</option>
                  <option value="today">Сегодня</option>
                  <option value="week">За неделю</option>
                  <option value="month">За месяц</option>
                </select>
                <CalendarDaysIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <DocumentTextIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          {/* Display info about the filter results */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Найдено {sortedMerchants.length} предпринимателей
              {statusFilter !== 'Все' && ` со статусом "${statusFilter}"`}
              {dateFilter !== 'all' && ` за ${dateFilter === 'today' ? 'сегодня' : dateFilter === 'week' ? 'неделю' : 'месяц'}`}
              {searchQuery && ` по запросу "${searchQuery}"`}
            </div>
            
            {(statusFilter !== 'Все' || dateFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('Все');
                  setDateFilter('all');
                  setSearchQuery('');
                }}
                className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700"
              >
                <XMarkIcon className="w-4 h-4" />
                Сбросить фильтры
              </button>
            )}
          </div>
        </div>
        
        {/* Table view */}
        <div className="overflow-x-auto">
          {merchants.length === 0 ? (
            <div className="py-16 text-center">
              <div className="bg-slate-50 rounded-xl p-8 max-w-md mx-auto">
                <UsersIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  В системе еще нет предпринимателей
                </h3>
                <p className="text-slate-600 mb-6">
                  Добавьте первого предпринимателя, чтобы начать работу с платформой
                </p>
                <Link
                  href="/admin/merchants/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Добавить предпринимателя</span>
                </Link>
              </div>
            </div>
          ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('bin')}
                    className="flex items-center gap-1 hover:text-slate-700"
                  >
                    БИН
                    <ArrowsUpDownIcon className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('companyName')}
                    className="flex items-center gap-1 hover:text-slate-700"
                  >
                    Компания
                    <ArrowsUpDownIcon className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-1 hover:text-slate-700"
                  >
                    Дата регистрации
                    <ArrowsUpDownIcon className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('isBlocked')}
                    className="flex items-center gap-1 hover:text-slate-700"
                  >
                    Статус
                    <ArrowsUpDownIcon className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedMerchants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    <UsersIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    Предприниматели не найдены
                  </td>
                </tr>
              ) : (
                paginatedMerchants.map((merchant) => {
                  const merchantStatus = merchant.isBlocked ? 'Заблокирован' : 'Активен';
                  return (
                    <tr key={merchant.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-900">
                        <div className="font-mono text-xs bg-slate-100 px-2 py-1 rounded inline-block">
                          {merchant.bin}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 font-medium">
                            {merchant.companyName[0]}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{merchant.companyName}</div>
                            {merchant.website && (
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <GlobeAltIcon className="w-3 h-3" />
                                {merchant.website}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="space-y-1">
                          <div className="text-xs">
                            {formatDate(merchant.createdAt)}
                          </div>
                          {merchant.updatedAt !== merchant.createdAt && (
                            <div className="text-xs text-slate-500">
                              Обновлен: {formatDate(merchant.updatedAt)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${
                            merchantStatus === 'Активен' 
                              ? 'bg-emerald-50 text-emerald-600' 
                              : 'bg-red-50 text-red-600'
                          }`}>
                            {merchantStatus === 'Активен' && <CheckCircleIcon className="w-3.5 h-3.5" />}
                            {merchantStatus === 'Заблокирован' && <XCircleIcon className="w-3.5 h-3.5" />}
                            <span>{merchantStatus}</span>
                          </div>
                          {merchant.isBlocked && merchant.blockedAt && (
                            <div className="text-xs text-slate-500">
                              С {formatDate(merchant.blockedAt)}
                            </div>
                          )}
                          {merchant.isBlocked && merchant.blockReason && (
                            <div className="text-xs text-red-600" title={merchant.blockReason}>
                              {merchant.blockReason.length > 20 
                                ? merchant.blockReason.substring(0, 20) + '...' 
                                : merchant.blockReason
                              }
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => {
                            setSelectedMerchant(merchant);
                            setShowModal(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                          title="Действия"
                        >
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>
      
      {/* Pagination */}
      {merchants.length > 0 && (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-t border-slate-200">
        <span className="text-sm text-slate-500 mb-4 sm:mb-0">
          Показано {paginatedMerchants.length} из {sortedMerchants.length} предпринимателей
        </span>
        
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border ${
                currentPage === 1
                  ? 'text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            
            {/* Page numbers */}
            {(() => {
              const pages = [];
              const maxPagesToShow = 5;
              let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
              let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
              
              if (endPage - startPage < maxPagesToShow - 1) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
              }
              
              if (startPage > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-700 hover:bg-sky-50 border border-slate-200"
                  >
                    1
                  </button>
                );
                if (startPage > 2) {
                  pages.push(<span key="dots1" className="px-2">...</span>);
                }
              }
              
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all font-medium ${
                      i === currentPage
                        ? 'bg-sky-600 text-white font-bold shadow-md'
                        : 'text-slate-700 hover:bg-sky-50 border border-slate-200'
                    }`}
                  >
                    {i}
                  </button>
                );
              }
              
              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pages.push(<span key="dots2" className="px-2">...</span>);
                }
                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-700 hover:bg-sky-50 border border-slate-200"
                  >
                    {totalPages}
                  </button>
                );
              }
              
              return pages;
            })()}
            
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border ${
                currentPage === totalPages
                  ? 'text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'text-sky-600 hover:bg-sky-50 border border-sky-200 transition-colors'
              }`}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      )}
      
      {/* Modal for merchant details */}
      {showModal && selectedMerchant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Информация о мерчанте</h3>
                  <p className="text-sm text-slate-500 mt-1">ID: {selectedMerchant.publicId}</p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedMerchant(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedMerchant.isBlocked 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {selectedMerchant.isBlocked ? (
                    <>
                      <NoSymbolIcon className="w-4 h-4" />
                      Заблокирован
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      Активен
                    </>
                  )}
                </div>
                <span className="text-sm text-slate-500">
                  Зарегистрирован {formatDate(selectedMerchant.createdAt)}
                </span>
              </div>

              {/* Basic Info Section */}
              <div className="bg-slate-50 rounded-xl p-5">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BuildingOfficeIcon className="w-5 h-5 text-slate-600" />
                  Основная информация
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">БИН</label>
                    <p className="text-slate-900 font-medium">{selectedMerchant.bin}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Компания</label>
                    <p className="text-slate-900 font-medium">{selectedMerchant.companyName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Директор</label>
                    <p className="text-slate-900">{selectedMerchant.directorName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Адрес</label>
                    <p className="text-slate-900">{selectedMerchant.address || 'Не указан'}</p>
                  </div>
                </div>
              </div>
              
              {/* Contact Info Section */}
              <div className="bg-slate-50 rounded-xl p-5">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5 text-slate-600" />
                  Контактная информация
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Email</label>
                    <p className="text-slate-900 flex items-center gap-2">
                      <EnvelopeIcon className="w-4 h-4 text-slate-400" />
                      {selectedMerchant.contactEmail}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Телефон</label>
                    <p className="text-slate-900 flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-slate-400" />
                      {selectedMerchant.phoneNumber}
                    </p>
                  </div>
                  {selectedMerchant.website && (
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Веб-сайт</label>
                      <p className="text-slate-900 flex items-center gap-2">
                        <GlobeAltIcon className="w-4 h-4 text-slate-400" />
                        <a href={selectedMerchant.website.startsWith('http') ? selectedMerchant.website : `https://${selectedMerchant.website}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-sky-600 hover:text-sky-700 hover:underline"
                        >
                          {selectedMerchant.website}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bank Details Section */}
              <div className="bg-slate-50 rounded-xl p-5">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BanknotesIcon className="w-5 h-5 text-slate-600" />
                  Банковские реквизиты
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Название банка</label>
                    <p className="text-slate-900">{selectedMerchant.bankName || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">БИК банка</label>
                    <p className="text-slate-900 font-mono">{selectedMerchant.bankBik || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Расчетный счет</label>
                    <p className="text-slate-900 font-mono text-sm">{selectedMerchant.bankAccount || 'Не указано'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Код бенефициара</label>
                    <p className="text-slate-900 font-mono">{selectedMerchant.bankBeneficiaryCode || 'Не указано'}</p>
                  </div>
                </div>
              </div>

              {/* Block Info Section if blocked */}
              {selectedMerchant.isBlocked && selectedMerchant.blockedAt && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <ShieldExclamationIcon className="w-5 h-5 text-red-700" />
                    Информация о блокировке
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-red-700 uppercase tracking-wider mb-1">Дата блокировки</label>
                      <p className="text-red-900">{new Date(selectedMerchant.blockedAt).toLocaleString('ru-RU')}</p>
                    </div>
                    {selectedMerchant.blockReason && (
                      <div>
                        <label className="block text-xs font-medium text-red-700 uppercase tracking-wider mb-1">Причина</label>
                        <p className="text-red-900">{selectedMerchant.blockReason}</p>
                      </div>
                    )}
                    {selectedMerchant.blockedBy && (
                      <div>
                        <label className="block text-xs font-medium text-red-700 uppercase tracking-wider mb-1">Заблокировал</label>
                        <p className="text-red-900">{selectedMerchant.blockedBy}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Section */}
              <div className="border-t border-slate-200 pt-6">
                <div className="bg-slate-50 rounded-xl p-5">
                  <h4 className="font-semibold text-slate-900 mb-3">Действия</h4>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      {selectedMerchant.isBlocked 
                        ? 'Разблокировать мерчанта для возобновления работы' 
                        : 'Заблокировать мерчанта для прекращения доступа'
                      }
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          if (selectedMerchant.isBlocked) {
                            // Unblock merchant
                            await merchantService.unblockMerchant(selectedMerchant.id);
                            console.log('Merchant unblocked successfully');
                            await refetch();
                          } else {
                            // Block merchant
                            const reason = window.prompt('Укажите причину блокировки:');
                            if (reason) {
                              await merchantService.blockMerchant(selectedMerchant.id, reason);
                              console.log('Merchant blocked successfully');
                              await refetch();
                            }
                          }
                          setShowModal(false);
                          setSelectedMerchant(null);
                        } catch (error) {
                          console.error('Error updating merchant status:', error);
                          alert('Ошибка при изменении статуса мерчанта');
                        }
                      }}
                      className={`px-5 py-2.5 rounded-lg font-medium transition-colors inline-flex items-center gap-2 ${
                        selectedMerchant.isBlocked
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      <ShieldExclamationIcon className="w-5 h-5" />
                      {selectedMerchant.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 