'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ChevronDownIcon,
  CalendarIcon,
  MapPinIcon,
  FolderIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

type ApplicationStatus = 'pending' | 'approved' | 'rejected';
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
  
  // Filter applications based on selected store
  const filteredApplications = selectedStore === 'all'
    ? mockApplications
    : mockApplications.filter(app => app.storeId === selectedStore);

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
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-700`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
    }
  };

  const getStatusText = (status: ApplicationStatus) => {
    switch (status) {
      case 'approved':
        return 'Одобрено';
      case 'rejected':
        return 'Отказано';
      default:
        return 'На рассмотрении';
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Заявки</h1>
        <p className="text-base text-gray-600">
          Все заявки на рассрочку
        </p>
      </div>

      {/* Actions Panel */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.push('/apply/store123')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 inline-flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Подать заявку
        </button>

        <div className="flex items-center gap-3">
          {/* Store Filter */}
          <div className="relative">
            <button
              onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
              className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              <MapPinIcon className="h-4 w-4 text-gray-400" />
              {selectedStore === 'all' ? 'Все точки' : mockStores.find(s => s.id === selectedStore)?.name}
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>

            {isStoreDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
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
              className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              {getPeriodText(selectedPeriod)}
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>

            {isPeriodDropdownOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
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

          {/* Export Button */}
          <button className="inline-flex items-center gap-2 bg-white border px-4 py-1.5 rounded-md text-sm hover:bg-gray-50">
            <FolderIcon className="h-4 w-4 text-gray-400" />
            Выгрузить
          </button>
        </div>
      </div>

      {/* Applications Table */}
      {filteredApplications.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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