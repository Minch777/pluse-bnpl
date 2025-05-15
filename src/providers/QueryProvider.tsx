'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

// Компонент-провайдер для React Query
export default function QueryProvider({ children }: QueryProviderProps) {
  // Создаем клиент React Query для каждого запроса (в клиентском рендеринге)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // отключаем перезапрос при фокусе окна
        retry: 1, // ограничиваем повторные попытки (по умолчанию 3)
        staleTime: 1000 * 60 * 5, // данные считаются свежими в течение 5 минут
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} 