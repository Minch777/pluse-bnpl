'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import Card from '@/components/Card';

type Merchant = {
  id: string;
  name: string;
  city: string;
  totalApplications: number;
  approved: number;
  approvalRate: number;
  totalAmount: number;
  income: number;
  change: number;
  status: 'active' | 'inactive';
};

const merchants: Merchant[] = [
  {
    id: '1',
    name: 'PlusePhone',
    city: 'Алматы',
    totalApplications: 84,
    approved: 60,
    approvalRate: 71,
    totalAmount: 3200000,
    income: 85000,
    change: -35,
    status: 'active',
  },
  {
    id: '2',
    name: 'XStore',
    city: 'Шымкент',
    totalApplications: 150,
    approved: 140,
    approvalRate: 93,
    totalAmount: 6300000,
    income: 175000,
    change: 27,
    status: 'active',
  },
  {
    id: '3',
    name: 'TechnoMart',
    city: 'Астана',
    totalApplications: 120,
    approved: 100,
    approvalRate: 83,
    totalAmount: 5100000,
    income: 145000,
    change: 15,
    status: 'active',
  },
  {
    id: '4',
    name: 'GadgetPro',
    city: 'Алматы',
    totalApplications: 75,
    approved: 65,
    approvalRate: 87,
    totalAmount: 3800000,
    income: 95000,
    change: 12,
    status: 'active',
  },
  {
    id: '5',
    name: 'DigiWorld',
    city: 'Караганда',
    totalApplications: 45,
    approved: 30,
    approvalRate: 67,
    totalAmount: 1500000,
    income: 42000,
    change: -28,
    status: 'inactive',
  },
];

const cities = [...new Set(merchants.map(m => m.city))];

type SortField = keyof Merchant;
type SortDirection = 'asc' | 'desc';

export default function MerchantTable() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [minApplications, setMinApplications] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('totalApplications');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredMerchants = useMemo(() => {
    return merchants.filter(merchant => {
      if (searchQuery && !merchant.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedStatus !== 'all' && merchant.status !== selectedStatus) return false;
      if (selectedCity !== 'all' && merchant.city !== selectedCity) return false;
      if (minApplications && merchant.totalApplications < parseInt(minApplications)) return false;
      return true;
    }).sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue as string) * modifier;
      }
      return ((aValue as number) - (bValue as number)) * modifier;
    });
  }, [searchQuery, selectedStatus, selectedCity, minApplications, sortField, sortDirection]);

  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по названию"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[150px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="appearance-none w-full bg-white text-sm px-3 py-2 pr-8 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* City Filter */}
          <div className="relative min-w-[150px]">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="appearance-none w-full bg-white text-sm px-3 py-2 pr-8 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все города</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Min Applications Filter */}
          <div className="min-w-[200px]">
            <input
              type="number"
              placeholder="Мин. кол-во заявок"
              value={minApplications}
              onChange={(e) => setMinApplications(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th 
                  className="pb-3 text-left text-sm font-medium text-gray-600 cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Мерчант
                    <ChevronUpDownIcon className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="pb-3 text-left text-sm font-medium text-gray-600 cursor-pointer"
                  onClick={() => handleSort('city')}
                >
                  <div className="flex items-center gap-1">
                    Город
                    <ChevronUpDownIcon className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="pb-3 text-right text-sm font-medium text-gray-600 cursor-pointer"
                  onClick={() => handleSort('totalApplications')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Всего заявок
                    <ChevronUpDownIcon className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="pb-3 text-right text-sm font-medium text-gray-600 cursor-pointer"
                  onClick={() => handleSort('approved')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Одобрено
                    <ChevronUpDownIcon className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="pb-3 text-right text-sm font-medium text-gray-600 cursor-pointer"
                  onClick={() => handleSort('approvalRate')}
                >
                  <div className="flex items-center justify-end gap-1">
                    % Одобрения
                    <ChevronUpDownIcon className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="pb-3 text-right text-sm font-medium text-gray-600 cursor-pointer"
                  onClick={() => handleSort('totalAmount')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Выдано (₸)
                    <ChevronUpDownIcon className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="pb-3 text-right text-sm font-medium text-gray-600 cursor-pointer"
                  onClick={() => handleSort('income')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Доход (₸)
                    <ChevronUpDownIcon className="w-4 h-4" />
                  </div>
                </th>
                <th 
                  className="pb-3 text-right text-sm font-medium text-gray-600 cursor-pointer"
                  onClick={() => handleSort('change')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Изменение
                    <ChevronUpDownIcon className="w-4 h-4" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-sm text-gray-500">
                    Ничего не найдено
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((merchant) => (
                  <tr 
                    key={merchant.id}
                    onClick={() => router.push(`/admin/merchants/${merchant.id}`)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="py-3 text-sm font-medium text-gray-900">{merchant.name}</td>
                    <td className="py-3 text-sm text-gray-600">{merchant.city}</td>
                    <td className="py-3 text-sm text-right text-gray-900">{formatAmount(merchant.totalApplications)}</td>
                    <td className="py-3 text-sm text-right text-gray-900">{formatAmount(merchant.approved)}</td>
                    <td className="py-3 text-sm text-right text-gray-900">{merchant.approvalRate}%</td>
                    <td className="py-3 text-sm text-right text-gray-900">{formatAmount(merchant.totalAmount)} ₸</td>
                    <td className="py-3 text-sm text-right text-gray-900">{formatAmount(merchant.income)} ₸</td>
                    <td className="py-3 text-sm text-right">
                      <span className={`inline-flex items-center gap-1 ${merchant.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {merchant.change >= 0 ? '📈' : '📉'} {Math.abs(merchant.change)}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
} 