'use client';

import { useState, useContext, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ChevronDownIcon,
  CalendarIcon,
  MapPinIcon,
  FolderIcon,
  PlusIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { SidebarContext } from '@/app/merchant/layout';
import { ApplicationStatus } from '@/utils/statusMappings';
import StatusBadge from '@/components/StatusBadge';
import applicationService from '@/api/services/applicationService';

type Period = 'today' | 'week' | 'month' | 'all';

type Application = {
  id: string;
  customerName: string;
  amount: number;
  status: ApplicationStatus;
  date: string;
  storeId: string;
  storeName: string;
};

type Store = {
  id: string;
  name: string;
};

// Mock data
const mockStores: Store[] = [
  { id: '1', name: 'Главный магазин' },
  { id: '2', name: 'Онлайн-магазин' },
];

const mockApplications: Application[] = [
  {
    id: '1',
    customerName: 'Иван Иванов',
    amount: 50000,
    status: 'approved',
    date: '2024-03-15',
    storeId: '1',
    storeName: 'Главный магазин',
  },
  {
    id: '2',
    customerName: 'Петр Петров',
    amount: 30000,
    status: 'pending',
    date: '2024-03-14',
    storeId: '2',
    storeName: 'Онлайн-магазин',
  },
];

export default function MerchantApplications() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const { isMobile } = useContext(SidebarContext);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    applicationService.getApplications().then((data) => {
      setApplications(data.applications);
      setLoading(false);
    });
  }, []);

  // Filter applications based on selected store
  const filteredApplications = selectedStore === 'all'
    ? applications
    : applications.filter(app => app.storeId === selectedStore);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ₸';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getStatusBadgeClasses = (status: ApplicationStatus) => {
    const baseClasses = 'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-[#F5F5F7] text-green-700`;
      case 'rejected':
        return `${baseClasses} bg-[#F5F5F7] text-red-700`;
      default:
        return `${baseClasses} bg-[#F5F5F7] text-yellow-700`;
    }
  };

  const getStatusText = (status: string) => {
    try {
      return <StatusBadge status={status as ApplicationStatus} size="sm" />;
    } catch {
      return <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  const getPeriodText = (period: Period) => {
    switch (period) {
      case 'today':
        return 'За сегодня';
      case 'week':
        return 'За неделю';
      case 'month':
        return 'За месяц';
      case 'all':
        return 'За всё время';
    }
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Header */}
      <header className="pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Заявки</h1>
        <p className="mt-2 text-lg text-gray-600">
          Все заявки на рассрочку
        </p>
      </header>

      {/* Primary action row */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Create application button */}
        <button 
          onClick={() => router.push('/public/store123')}
          className="w-full sm:w-auto border-2 border-[#8335ff] text-[#8335ff] px-4 py-2 rounded-md text-sm hover:bg-[#f6efff] inline-flex items-center justify-center sm:justify-start gap-2 transition-all"
        >
          <PlusIcon className="h-4 w-4" />
          Подать заявку
        </button>

        {/* Filter toggle on mobile */}
        {isMobile && (
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="w-full bg-white border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-50 inline-flex items-center justify-center gap-2"
          >
            <FunnelIcon className="h-4 w-4 text-gray-500" />
            Фильтры
          </button>
        )}
      </div>

      {/* Filters - Two-row layout */}
      <div className={`space-y-3 ${isMobile && !isFilterExpanded ? 'hidden' : 'block'}`}>
        <div className="grid grid-cols-2 gap-2">
          {/* Store Filter */}
          <div className="relative">
            <button
              onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
              className="w-full inline-flex items-center justify-between gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2 truncate">
                <MapPinIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">
              {selectedStore === 'all' ? 'Все точки' : mockStores.find(s => s.id === selectedStore)?.name}
                </span>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </button>

            {isStoreDropdownOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSelectedStore('all');
                      setIsStoreDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Все точки
                  </button>
                  {mockStores.map((store) => (
                    <button
                      key={store.id}
                      onClick={() => {
                        setSelectedStore(store.id);
                        setIsStoreDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {store.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Period Filter */}
          <div className="relative">
            <button
              onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
              className="w-full inline-flex items-center justify-between gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2 truncate">
                <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{getPeriodText(selectedPeriod)}</span>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </button>

            {isPeriodDropdownOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  {(['today', 'week', 'month', 'all'] as Period[]).map((period) => (
                    <button
                      key={period}
                      onClick={() => {
                        setSelectedPeriod(period);
                        setIsPeriodDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {getPeriodText(period)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>

          {/* Export Button */}
        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border px-4 py-1.5 rounded-md text-sm hover:bg-gray-50">
            <FolderIcon className="h-4 w-4 text-gray-400" />
            Выгрузить
          </button>
      </div>

      {/* Applications - Table for Desktop, Cards for Mobile */}
      {filteredApplications.length > 0 ? (
        <div>
          {/* Mobile: Card View */}
          <div className="md:hidden space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{application.customerName}</h3>
                    <p className="text-sm text-gray-500">{formatDate(application.date)}</p>
                  </div>
                  <span className={getStatusBadgeClasses(application.status)}>
                    {getStatusText(application.status)}
                  </span>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Сумма:</span>
                    <span className="text-sm font-medium">{formatAmount(application.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Точка продаж:</span>
                    <span className="text-sm">{application.storeName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table View */}
          <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-medium text-gray-600 px-4 py-2">Клиент</th>
                <th className="text-left text-sm font-medium text-gray-600 px-4 py-2">Сумма</th>
                <th className="text-left text-sm font-medium text-gray-600 px-4 py-2">Статус</th>
                <th className="text-left text-sm font-medium text-gray-600 px-4 py-2">Точка продаж</th>
                <th className="text-left text-sm font-medium text-gray-600 px-4 py-2">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td className="px-4 py-2 text-sm text-gray-900">{application.customerName}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{formatAmount(application.amount)}</td>
                  <td className="px-4 py-2">
                    <span className={getStatusBadgeClasses(application.status)}>
                      {getStatusText(application.status)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{application.storeName}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{formatDate(application.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-2">😐 Пока нет заявок на рассрочку</p>
          <p className="text-sm text-gray-500">
            Нажмите «Подать заявку», чтобы создать первую
          </p>
        </div>
      )}
    </div>
  );
} 