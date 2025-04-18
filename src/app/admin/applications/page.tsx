'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';

// Application status types
type ApplicationStatus = 'Одобрено' | 'Отказано' | 'На рассмотрении';

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

export default function AdminApplications() {
  // Mock applications data
  const mockApplications: Application[] = [
    { 
      id: 'APP-1234', 
      clientName: 'Айгуль Нурланова', 
      amount: '45 000 ₸', 
      date: '2023-11-01', 
      status: 'Одобрено',
      phone: '+7 (701) 234-5678',
      merchant: 'ИП "Электроника"',
      merchantId: 'M-1001',
    },
    { 
      id: 'APP-1235', 
      clientName: 'Самат Исмаилов', 
      amount: '78 000 ₸', 
      date: '2023-11-01', 
      status: 'На рассмотрении',
      phone: '+7 (702) 345-6789',
      merchant: 'ТОО "МебельПлюс"',
      merchantId: 'M-1002',
    },
    { 
      id: 'APP-1236', 
      clientName: 'Марат Алимов', 
      amount: '23 000 ₸', 
      date: '2023-10-31', 
      status: 'Отказано',
      phone: '+7 (705) 456-7890',
      merchant: 'ИП Сагитов',
      merchantId: 'M-1003',
    },
    { 
      id: 'APP-1237', 
      clientName: 'Дина Сагитова', 
      amount: '56 000 ₸', 
      date: '2023-10-30', 
      status: 'Одобрено',
      phone: '+7 (707) 567-8901',
      merchant: 'ИП "Электроника"',
      merchantId: 'M-1001',
    },
    { 
      id: 'APP-1238', 
      clientName: 'Амир Касимов', 
      amount: '120 000 ₸', 
      date: '2023-10-29', 
      status: 'Отказано',
      phone: '+7 (700) 678-9012',
      merchant: 'ИП "Модный Дом"',
      merchantId: 'M-1005',
    },
    { 
      id: 'APP-1239', 
      clientName: 'Жанна Ибраева', 
      amount: '67 000 ₸', 
      date: '2023-10-28', 
      status: 'Одобрено',
      phone: '+7 (777) 789-0123',
      merchant: 'ТОО "МебельПлюс"',
      merchantId: 'M-1002',
    },
    { 
      id: 'APP-1240', 
      clientName: 'Асхат Муратов', 
      amount: '95 000 ₸', 
      date: '2023-10-28', 
      status: 'На рассмотрении',
      phone: '+7 (702) 890-1234',
      merchant: 'ИП "Электроника"',
      merchantId: 'M-1001',
    },
    { 
      id: 'APP-1241', 
      clientName: 'Карина Абдулова', 
      amount: '42 000 ₸', 
      date: '2023-10-27', 
      status: 'Одобрено',
      phone: '+7 (705) 901-2345',
      merchant: 'ИП "ТехноМир"',
      merchantId: 'M-1006',
    },
  ];
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'Все'>('Все');
  const [merchantFilter, setMerchantFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Get unique merchants for filter dropdown
  const merchants = Array.from(new Set(mockApplications.map(app => app.merchant))).map(
    merchantName => ({
      name: merchantName,
      id: mockApplications.find(app => app.merchant === merchantName)?.merchantId || ''
    })
  );
  
  // Filter applications based on criteria
  const filteredApplications = mockApplications.filter((app) => {
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
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Заявки</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Просмотр и управление всеми заявками в системе
        </p>
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
              placeholder="Поиск по имени, ID или телефону"
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
              <option value="Одобрено">Одобрено</option>
              <option value="Отказано">Отказано</option>
              <option value="На рассмотрении">На рассмотрении</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="merchant" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Предприниматель
            </label>
            <select
              id="merchant"
              value={merchantFilter}
              onChange={(e) => setMerchantFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">Все предприниматели</option>
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>{merchant.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Дата
            </label>
            <input
              id="date"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
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
                  Клиент
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Телефон
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Предприниматель
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Дата
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
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    Заявки не найдены
                  </td>
                </tr>
              ) : (
                filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                      {application.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {application.clientName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {application.phone}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {application.amount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {application.merchant}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {application.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                        application.status === 'Одобрено' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : application.status === 'Отказано'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Просмотр
                        </Button>
                        {application.status === 'На рассмотрении' && (
                          <>
                            <Button variant="primary" size="sm">
                              Одобрить
                            </Button>
                            <Button variant="outline" size="sm">
                              Отклонить
                            </Button>
                          </>
                        )}
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
            Показано {filteredApplications.length} из {mockApplications.length} заявок
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