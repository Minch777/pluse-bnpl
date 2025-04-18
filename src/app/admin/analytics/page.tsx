'use client';

import { useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import MerchantAnalytics from '@/components/MerchantAnalytics';
import MerchantTable from '@/components/MerchantTable';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Аналитика по мерчантам</h1>
        <button
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <CalendarIcon className="w-4 h-4" />
          Выбрать период
        </button>
      </div>

      <MerchantAnalytics />
      <MerchantTable />
    </div>
  );
} 