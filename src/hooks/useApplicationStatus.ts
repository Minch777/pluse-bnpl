import { useMemo } from 'react';
import { ApplicationStatus, statusMappings } from '@/utils/statusMappings';

interface UseApplicationStatusProps {
  status: ApplicationStatus;
}

interface UseApplicationStatusReturn {
  label: string;
  isInitial: boolean;
  isProcessing: boolean;
  isCompleted: boolean;
  isRejected: boolean;
  isAwaitingUserAction: boolean;
  statusOrder: number;
}

export function useApplicationStatus({ status }: UseApplicationStatusProps): UseApplicationStatusReturn {
  return useMemo(() => {
    const statusInfo = statusMappings[status];
    
    // Группировка статусов по этапам процесса
    const isInitial = status === 'CREATED';
    
    const processingStatuses: ApplicationStatus[] = [
      'IN_PROGRESS',
      'STATEMENT_UPLOADED',
      'STATEMENT_SENT_TO_BANK',
      'STATEMENT_VERIFIED_OK',
      'APPLICATION_SENT_TO_BANK'
    ];
    
    const completedStatuses: ApplicationStatus[] = [
      'AGREEMENT_SIGNED',
      'BANK_APPROVED'
    ];
    
    const rejectedStatuses: ApplicationStatus[] = [
      'STATEMENT_VERIFIED_FAIL',
      'BANK_REJECTED'
    ];
    
    const userActionStatuses: ApplicationStatus[] = [
      'AGREEMENT_OTP_SENT',
      'BANK_OTHER_RESPONSE'
    ];
    
    return {
      label: statusInfo.label,
      isInitial,
      isProcessing: processingStatuses.includes(status),
      isCompleted: completedStatuses.includes(status),
      isRejected: rejectedStatuses.includes(status),
      isAwaitingUserAction: userActionStatuses.includes(status),
      statusOrder: statusInfo.order
    };
  }, [status]);
} 