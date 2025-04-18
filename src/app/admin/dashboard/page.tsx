'use client';

import AdminDashboardStats from '@/components/AdminDashboardStats';

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Показатели</h1>
        <p className="mt-2 text-gray-600">
          Обзор ключевых метрик и активности системы
        </p>
      </div>

      <AdminDashboardStats />
    </div>
  );
} 