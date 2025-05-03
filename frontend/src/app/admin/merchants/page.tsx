'use client';

import MerchantTable from '@/components/MerchantTable';

export default function MerchantsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Мерчанты</h1>
        <p className="mt-2 text-gray-600">
          Список всех подключённых магазинов и их активность
        </p>
      </div>

      <MerchantTable />
    </div>
  );
} 