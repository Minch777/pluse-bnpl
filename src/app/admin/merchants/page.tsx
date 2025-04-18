'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

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
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<MerchantStatus | 'Все'>('Все');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Предприниматели</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Управление партнерами на платформе
          </p>
        </div>
        
        <Button>Добавить предпринимателя</Button>
      </div>
      
      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Поиск
            </label>
            <input
              id="search"
              type="text"
              placeholder="Поиск по имени, ID или email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Статус
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Все">Все статусы</option>
              <option value="Активен">Активен</option>
              <option value="На модерации">На модерации</option>
              <option value="Заблокирован">Заблокирован</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Город
            </label>
            <select
              id="location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">Все города</option>
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Владелец
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Контакты
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Город
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Заявки
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    Предприниматели не найдены
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((merchant) => (
                  <tr key={merchant.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                      {merchant.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                      {merchant.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {merchant.owner}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      <div>{merchant.email}</div>
                      <div>{merchant.phone}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {merchant.location}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {merchant.applications}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                        merchant.status === 'Активен' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : merchant.status === 'Заблокирован'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {merchant.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Просмотр
                        </Button>
                        <Button variant={merchant.status === 'Заблокирован' ? 'primary' : 'outline'} size="sm">
                          {merchant.status === 'Заблокирован' ? 'Разблокировать' : 'Блокировать'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Показано {filteredMerchants.length} из {mockMerchants.length} предпринимателей
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Назад
            </Button>
            <Button variant="outline" size="sm" disabled>
              Вперед
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 