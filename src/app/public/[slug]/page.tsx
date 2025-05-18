'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import merchantService from '@/api/services/merchantService';

export default function PublicPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processApplication = async () => {
      try {
        console.log('Processing application with slug:', params.slug);
        
        // Используем слаг целиком и outlet index = 1 по умолчанию
        const merchantSlug = params.slug;
        const outletIndex = 1;
        
        console.log(`Using merchantSlug: ${merchantSlug}, outletIndex: ${outletIndex}`);
        
        // Create application link
        const applicationLink = await merchantService.createApplicationLink(merchantSlug, outletIndex);
        
        // Redirect to the application URL
        window.location.href = applicationLink.redirectUrl;
      } catch (err) {
        console.error('Error creating application:', err);
        // В случае ошибки продолжаем показывать экран загрузки
        // но добавляем автоматический повтор через 3 секунды
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    };

    processApplication();
  }, [params.slug, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Перенаправление...</h2>
        <p className="text-gray-600">
          Пожалуйста, подождите. Мы перенаправляем вас на страницу оформления заявки.
        </p>
      </div>
    </div>
  );
} 