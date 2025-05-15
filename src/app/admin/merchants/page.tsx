'use client';

import { useState } from 'react';
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
  EllipsisHorizontalIcon,
  BanknotesIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

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

// Merchant status types
type MerchantStatus = 'Активен' | 'На модерации' | 'Заблокирован';

// Merchant type
type Merchant = {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  location: string;
  status: MerchantStatus;
  applications: number;
  joinDate: string;
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

export default function AdminMerchants() {
  // Mock merchants data
  const mockMerchants: Merchant[] = [
    { 
      id: 'M-1001', 
      name: 'ИП "Электроника"', 
      owner: 'Алексей Предприниматель', 
      email: 'merchant@example.com', 
      phone: '+7 (701) 123-4567', 
      location: 'Алматы', 
      status: 'Активен',
      applications: 124,
      joinDate: '2023-05-15',
    },
    { 
      id: 'M-1002', 
      name: 'ТОО "МебельПлюс"', 
      owner: 'Марат Касымов', 
      email: 'mebelplus@example.com', 
      phone: '+7 (702) 234-5678', 
      location: 'Астана', 
      status: 'Активен',
      applications: 98,
      joinDate: '2023-06-23',
    },
    { 
      id: 'M-1003', 
      name: 'ИП Сагитов', 
      owner: 'Руслан Сагитов', 
      email: 'sagitov@example.com', 
      phone: '+7 (705) 345-6789', 
      location: 'Шымкент', 
      status: 'Активен',
      applications: 82,
      joinDate: '2023-07-10',
    },
    { 
      id: 'M-1004', 
      name: 'ТОО "АвтоТехСервис"', 
      owner: 'Аскар Нурланов', 
      email: 'ats@example.com', 
      phone: '+7 (707) 456-7890', 
      location: 'Алматы', 
      status: 'На модерации',
      applications: 0,
      joinDate: '2023-10-30',
    },
    { 
      id: 'M-1005', 
      name: 'ИП "Модный Дом"', 
      owner: 'Асель Каримова', 
      email: 'fashion@example.com', 
      phone: '+7 (700) 567-8901', 
      location: 'Караганда', 
      status: 'Активен',
      applications: 76,
      joinDate: '2023-08-05',
    },
    { 
      id: 'M-1006', 
      name: 'ИП "ТехноМир"', 
      owner: 'Дамир Сериков', 
      email: 'technomir@example.com', 
      phone: '+7 (778) 678-9012', 
      location: 'Актау', 
      status: 'Заблокирован',
      applications: 32,
      joinDate: '2023-04-18',
    },
  ];
  
  // Summary statistics
  const statistics = {
    total: mockMerchants.length,
    active: mockMerchants.filter(m => m.status === 'Активен').length,
    pending: mockMerchants.filter(m => m.status === 'На модерации').length,
    blocked: mockMerchants.filter(m => m.status === 'Заблокирован').length,
    totalApplications: mockMerchants.reduce((sum, m) => sum + m.applications, 0)
  };
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<MerchantStatus | 'Все'>('Все');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewType, setViewType] = useState<'grid' | 'table'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get unique locations for filter dropdown
  const locations = Array.from(new Set(mockMerchants.map(merchant => merchant.location)));
  
  // Filter merchants based on criteria
  const filteredMerchants = mockMerchants.filter((merchant) => {
    // Status filter
    if (statusFilter !== 'Все' && merchant.status !== statusFilter) return false;
    
    // Location filter
    if (locationFilter && merchant.location !== locationFilter) return false;
    
    // Search query (case insensitive)
    if (searchQuery && 
        !merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !merchant.owner.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !merchant.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !merchant.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
            title="На модерации"
            value={statistics.pending}
            icon={<ClockIcon className="w-5 h-5" />}
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
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 h-10 bg-transparent border border-sky-500 text-sky-600 rounded-lg text-sm font-medium hover:bg-sky-50 transition-colors"
            >
              <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Обновить</span>
            </button>
            
            <button 
              className="flex items-center gap-2 px-4 h-10 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Добавить</span>
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
      </div>
            <input
              type="text"
              placeholder="Поиск по имени, ID или email"
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
              <option value="На модерации">На модерации</option>
              <option value="Заблокирован">Заблокирован</option>
            </select>
                <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          
            <div className="relative">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">Все города</option>
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
                <MapPinIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            
            <div className="flex">
              <button 
                onClick={() => setViewType('grid')} 
                  className={`px-3 py-2 border rounded-l-lg transition-colors ${
                  viewType === 'grid' 
                      ? 'bg-sky-600 border-sky-600 text-white' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                  title="Сетка"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/>
                </svg>
              </button>
              <button 
                onClick={() => setViewType('table')} 
                  className={`px-3 py-2 border rounded-r-lg transition-colors ${
                  viewType === 'table' 
                      ? 'bg-sky-600 border-sky-600 text-white' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                  title="Таблица"
              >
                <ArrowsUpDownIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Display info about the filter results */}
          <div className="mt-4 text-sm text-slate-500">
          Найдено {filteredMerchants.length} предпринимателей
          {statusFilter !== 'Все' && ` со статусом "${statusFilter}"`}
          {locationFilter && ` в городе ${locationFilter}`}
          {searchQuery && ` по запросу "${searchQuery}"`}
          </div>
        </div>
        
        {/* Grid view */}
        {viewType === 'grid' && (
          <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMerchants.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <UsersIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p>Предприниматели не найдены</p>
              </div>
            ) : (
              filteredMerchants.map((merchant) => (
                <div 
                  key={merchant.id}
                    className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 text-lg font-semibold">
                          {merchant.name[0]}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">{merchant.name}</h3>
                            <div className="text-sm text-slate-500">{merchant.id}</div>
                        </div>
                      </div>
                      
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                        merchant.status === 'Активен' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                          : merchant.status === 'Заблокирован'
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}>
                        {merchant.status === 'Активен' && <CheckCircleIcon className="w-3.5 h-3.5 mr-1" />}
                        {merchant.status === 'На модерации' && <ClockIcon className="w-3.5 h-3.5 mr-1" />}
                        {merchant.status === 'Заблокирован' && <XCircleIcon className="w-3.5 h-3.5 mr-1" />}
                        {merchant.status}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4 flex-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <BuildingOfficeIcon className="w-4 h-4 text-slate-400" />
                        <span>{merchant.owner}</span>
                      </div>
                      
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <EnvelopeIcon className="w-4 h-4 text-slate-400" />
                        <span>{merchant.email}</span>
                      </div>
                      
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <PhoneIcon className="w-4 h-4 text-slate-400" />
                        <span>{merchant.phone}</span>
                      </div>
                      
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPinIcon className="w-4 h-4 text-slate-400" />
                        <span>{merchant.location}</span>
                      </div>
                      
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDaysIcon className="w-4 h-4 text-slate-400" />
                        <span>С {formatDate(merchant.joinDate)}</span>
                      </div>
                    </div>
                    
                      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-100">
                        <div className="bg-sky-50 text-sky-600 rounded-lg py-2 px-4 text-center flex-1">
                        <div className="text-xl font-bold">{merchant.applications}</div>
                        <div className="text-xs">заявок</div>
                      </div>
                      
                      <div className="flex sm:flex-col gap-2">
                          <button className="flex-1 p-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                          <EyeIcon className="w-5 h-5 mx-auto" />
                        </button>
                        
                        <button className={`flex-1 p-2 rounded-lg transition-colors ${
                          merchant.status === 'Заблокирован'
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-red-600 bg-red-50 hover:bg-red-100'
                        }`}>
                          <ShieldExclamationIcon className="w-5 h-5 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>
        )}
        
        {/* Table view */}
        {viewType === 'table' && (
        <div className="overflow-x-auto">
            <table className="w-full">
            <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">ID / Название</th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Владелец</th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Контакты</th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Город</th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Заявки</th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
                  <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-slate-100">
              {filteredMerchants.length === 0 ? (
                <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      <UsersIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    Предприниматели не найдены
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((merchant) => (
                    <tr key={merchant.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 font-medium">
                            {merchant.name[0]}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{merchant.name}</div>
                            <div className="text-xs text-slate-500">{merchant.id}</div>
                          </div>
                        </div>
                    </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                      {merchant.owner}
                    </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5 mb-1">
                          <EnvelopeIcon className="w-4 h-4 text-slate-400" />
                          {merchant.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PhoneIcon className="w-4 h-4 text-slate-400" />
                          {merchant.phone}
                        </div>
                    </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPinIcon className="w-4 h-4 text-slate-400" />
                      {merchant.location}
                        </div>
                    </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center bg-sky-50 text-sky-600 rounded-lg px-3 py-1 text-sm font-medium">
                      {merchant.applications}
                        </div>
                    </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${
                        merchant.status === 'Активен' 
                            ? 'bg-emerald-50 text-emerald-600' 
                          : merchant.status === 'Заблокирован'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-amber-50 text-amber-600'
                      }`}>
                          {merchant.status === 'Активен' && <CheckCircleIcon className="w-3.5 h-3.5" />}
                          {merchant.status === 'На модерации' && <ClockIcon className="w-3.5 h-3.5" />}
                          {merchant.status === 'Заблокирован' && <XCircleIcon className="w-3.5 h-3.5" />}
                          <span>{merchant.status}</span>
                        </div>
                    </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-slate-500 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className={`p-1.5 rounded-md transition-colors ${
                            merchant.status === 'Заблокирован'
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-red-600 bg-red-50 hover:bg-red-100'
                          }`}>
                            <ShieldExclamationIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-500 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                            <EllipsisHorizontalIcon className="w-4 h-4" />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        )}
        
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-t border-slate-200">
          <span className="text-sm text-slate-500 mb-4 sm:mb-0">
            Показано {filteredMerchants.length} из {mockMerchants.length} предпринимателей
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
    </div>
  );
} 