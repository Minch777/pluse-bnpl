'use client';

import ApplicationTable from '@/components/ApplicationTable';

export default function ApplicationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Заявки</h1>
        <p className="mt-2 text-gray-600">
          Управление всеми заявками по кредитам и рассрочкам
        </p>
      </div>

      <ApplicationTable />
    </div>
  );
} 