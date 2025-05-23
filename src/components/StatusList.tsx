import React from 'react';
import { ApplicationStatus, statusMappings } from '@/utils/statusMappings';
import StatusBadge from './StatusBadge';

const StatusList: React.FC = () => {
  // Получаем все статусы, сортируем по порядку
  const statuses = Object.keys(statusMappings) as ApplicationStatus[];
  const sortedStatuses = [...statuses].sort(
    (a, b) => statusMappings[a].order - statusMappings[b].order
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Статусы заявок</h2>
      
      <div className="space-y-4">
        {sortedStatuses.map((status) => (
          <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-gray-600 w-52">
                {status}
              </div>
              <div className="text-sm text-gray-500 w-32">
                <StatusBadge status={status} />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Порядок: {statusMappings[status].order}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusList; 