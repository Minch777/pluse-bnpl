'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Card from '@/components/Card';

type Status = 'issued' | 'pending' | 'rejected' | 'approved' | 'all';
type ProductType = 'credit' | 'installment' | 'all';

type Application = {
  id: string;
  client: string;
  merchant: string;
  store: string;
  productType: 'credit' | 'installment';
  amount: number;
  status: 'issued' | 'pending' | 'rejected' | 'approved';
  date: string;
};

// Mock data
const applications: Application[] = [
  {
    id: '#1250',
    client: 'Айгуль Нурланова',
    merchant: 'MegaStore',
    store: 'Онлайн-магазин',
    productType: 'credit',
    amount: 50000,
    status: 'issued',
    date: '15.03.2024',
  },
  {
    id: '#1249',
    client: 'Азамат Сериков',
    merchant: 'BestElectro',
    store: 'Главный магазин',
    productType: 'installment',
    amount: 120000,
    status: 'pending',
    date: '14.03.2024',
  },
  {
    id: '#1248',
    client: 'Диана Касымова',
    merchant: 'MegaStore',
    store: 'ТЦ "Dostyk Plaza"',
    productType: 'credit',
    amount: 67000,
    status: 'rejected',
    date: '13.03.2024',
  },
  {
    id: '#1247',
    client: 'Марат Искаков',
    merchant: 'TechnoPlus',
    store: 'ТЦ "Asia Park"',
    productType: 'installment',
    amount: 95000,
    status: 'approved',
    date: '13.03.2024',
  },
];

const merchants = [...new Set(applications.map(a => a.merchant))];
const stores = [...new Set(applications.map(a => a.store))];

const statusLabels = {
  issued: 'Выдано',
  pending: 'На рассмотрении',
  rejected: 'Отказано',
  approved: 'Одобрено',
};

const productTypeLabels = {
  credit: 'Кредит',
  installment: 'Рассрочка',
};

export default function ApplicationTable() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<Status>('all');
  const [selectedProductType, setSelectedProductType] = useState<ProductType>('all');
  const [selectedMerchant, setSelectedMerchant] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<string>('all');

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };

  const getStatusStyle = (status: Application['status']) => {
    switch (status) {
      case 'issued':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'approved':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredApplications = applications.filter(application => {
    if (selectedStatus !== 'all' && application.status !== selectedStatus) return false;
    if (selectedProductType !== 'all' && application.productType !== selectedProductType) return false;
    if (selectedMerchant !== 'all' && application.merchant !== selectedMerchant) return false;
    if (selectedStore !== 'all' && application.store !== selectedStore) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as Status)}
            className="appearance-none bg-white text-sm px-3 py-1.5 pr-8 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все статусы</option>
            <option value="issued">Выдано</option>
            <option value="pending">На рассмотрении</option>
            <option value="rejected">Отказано</option>
            <option value="approved">Одобрено</option>
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Product Type Filter */}
        <div className="relative">
          <select
            value={selectedProductType}
            onChange={(e) => setSelectedProductType(e.target.value as ProductType)}
            className="appearance-none bg-white text-sm px-3 py-1.5 pr-8 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все продукты</option>
            <option value="credit">Кредит</option>
            <option value="installment">Рассрочка</option>
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Merchant Filter */}
        <div className="relative">
          <select
            value={selectedMerchant}
            onChange={(e) => setSelectedMerchant(e.target.value)}
            className="appearance-none bg-white text-sm px-3 py-1.5 pr-8 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все мерчанты</option>
            {merchants.map(merchant => (
              <option key={merchant} value={merchant}>{merchant}</option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Store Filter */}
        <div className="relative">
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="appearance-none bg-white text-sm px-3 py-1.5 pr-8 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все точки продаж</option>
            {stores.map(store => (
              <option key={store} value={store}>{store}</option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Date Filter */}
        <button
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <CalendarIcon className="w-4 h-4" />
          Выбрать период
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-sm font-medium text-gray-600">ID</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">Клиент</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">Мерчант</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">Точка продаж</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">Тип продукта</th>
                <th className="pb-3 text-right text-sm font-medium text-gray-600">Сумма</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">Статус</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr 
                  key={application.id}
                  onClick={() => router.push(`/admin/applications/${application.id}`)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="py-3 text-sm text-gray-900">{application.id}</td>
                  <td className="py-3 text-sm text-gray-900 font-medium">{application.client}</td>
                  <td className="py-3 text-sm text-gray-900">{application.merchant}</td>
                  <td className="py-3 text-sm text-gray-900">{application.store}</td>
                  <td className="py-3 text-sm text-gray-900">{productTypeLabels[application.productType]}</td>
                  <td className="py-3 text-sm text-gray-900 text-right tabular-nums">{formatAmount(application.amount)} ₸</td>
                  <td className="py-3 text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(application.status)}`}>
                      {statusLabels[application.status]}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">{application.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 