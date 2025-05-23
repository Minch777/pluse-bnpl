// Типы статусов заявок с бэкенда
export type ApplicationStatus = 
  | 'CREATED'
  | 'IN_PROGRESS'
  | 'STATEMENT_UPLOADED'
  | 'STATEMENT_SENT_TO_BANK'
  | 'STATEMENT_VERIFIED_OK'
  | 'STATEMENT_VERIFIED_FAIL'
  | 'AGREEMENT_OTP_SENT'
  | 'AGREEMENT_SIGNED'
  | 'APPLICATION_SENT_TO_BANK'
  | 'BANK_APPROVED'
  | 'BANK_REJECTED'
  | 'BANK_OTHER_RESPONSE';

// Интерфейс для отображения статуса на фронтенде
export interface StatusDisplay {
  label: string;        // Текстовое представление
  color: string;        // Цвет для отображения (для бейджей и т.д.)
  icon?: string;        // Опциональная иконка (может быть названием или SVG)
  order: number;        // Для сортировки в последовательности процесса
}

// Сопоставление статусов бэкенда с отображением на фронтенде
export const statusMappings: Record<ApplicationStatus, StatusDisplay> = {
  'CREATED': {
    label: 'Создана',
    color: 'indigo',
    order: 1
  },
  'IN_PROGRESS': {
    label: 'Создана',
    color: 'indigo',
    order: 2
  },
  'STATEMENT_UPLOADED': {
    label: 'Выписка загружена',
    color: 'amber',
    order: 3
  },
  'STATEMENT_SENT_TO_BANK': {
    label: 'Выписка отправлена',
    color: 'amber',
    order: 4
  },
  'STATEMENT_VERIFIED_OK': {
    label: 'Выписка подтверждена',
    color: 'blue',
    order: 5
  },
  'STATEMENT_VERIFIED_FAIL': {
    label: 'Ошибка верификации',
    color: 'red',
    order: 6
  },
  'AGREEMENT_OTP_SENT': {
    label: 'СМС-подтверждение',
    color: 'violet',
    order: 7
  },
  'AGREEMENT_SIGNED': {
    label: 'Соглашение подписано',
    color: 'emerald',
    order: 8
  },
  'APPLICATION_SENT_TO_BANK': {
    label: 'На рассмотрении',
    color: 'blue',
    order: 9
  },
  'BANK_APPROVED': {
    label: 'Одобрено',
    color: 'emerald',
    order: 10
  },
  'BANK_REJECTED': {
    label: 'Отказ',
    color: 'red',
    order: 11
  },
  'BANK_OTHER_RESPONSE': {
    label: 'Требуется уточнение',
    color: 'purple',
    order: 12
  }
};

// Цветовые коды для Tailwind CSS
export const statusColors = {
  gray: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-100'
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-100'
  },
  blue: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-100'
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-100'
  },
  violet: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-100'
  },
  green: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-100'
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-100'
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-100'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-100'
  }
};

// Получить отображаемый текст статуса
export function getStatusLabel(status: ApplicationStatus): string {
  return statusMappings[status]?.label || status;
}

// Получить цветовую схему для статуса
export function getStatusColor(status: ApplicationStatus): {bg: string, text: string, border: string} {
  const colorName = statusMappings[status]?.color || 'gray';
  return statusColors[colorName as keyof typeof statusColors];
}

// Получить полную информацию о статусе
export function getStatusInfo(status: ApplicationStatus): StatusDisplay & {colorClasses: {bg: string, text: string, border: string}} {
  return {
    ...statusMappings[status],
    colorClasses: getStatusColor(status)
  };
} 