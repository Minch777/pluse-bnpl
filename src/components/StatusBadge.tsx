import React from 'react';
import { ApplicationStatus, getStatusInfo } from '@/utils/statusMappings';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className = '',
  size = 'md'
}) => {
  const statusInfo = getStatusInfo(status);
  const { bg, text, border } = statusInfo.colorClasses;
  
  const sizeClasses = {
    sm: 'text-xs px-3 py-1',
    md: 'text-sm px-4 py-1.5',
    lg: 'text-base px-5 py-2'
  };
  
  return (
    <div 
      className={`
        inline-flex items-center gap-2 justify-center rounded-full
        font-medium ${bg} ${text} ${border} border shadow-sm
        ${sizeClasses[size]} ${className}
      `}
    >
      {statusInfo.label}
    </div>
  );
};

export default StatusBadge; 