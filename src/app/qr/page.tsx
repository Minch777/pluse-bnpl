'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import merchantService from '@/api/services/merchantService';

export default function QRRedirect() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  useEffect(() => {
    const redirectToQRPage = async () => {
      try {
        const startTime = new Date();
        console.log('QR Redirect page loaded at:', startTime.toISOString());
        
        // Извлекаем токен вручную для отладки
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        console.log('Token available:', !!token);
        
        // Проверяем, есть ли сохраненный slug в localStorage
        const savedSlug = localStorage.getItem('merchantSlug');
        console.log('Saved merchantSlug in localStorage:', savedSlug);
        
        if (savedSlug) {
          console.log('Using saved slug from localStorage:', savedSlug);
          setDebugInfo({
            source: 'localStorage', 
            merchantSlug: savedSlug,
            hasToken: !!token,
            tokenPreview: token ? `${token.substring(0, 20)}...` : null,
            timestamp: startTime.toISOString()
          });
          
          // Используем сохраненный slug и делаем ЖЕСТКИЙ редирект через window.location
          // вместо router.replace для отладки
          console.log('Redirecting to:', `/merchant/qr/${savedSlug}`);
          window.location.href = `/merchant/qr/${savedSlug}`;
          return;
        }
        
        // Если нет сохраненного slug, получаем данные мерчанта
        console.log('Attempting to get merchant data from API...');
        const merchantData = await merchantService.getCurrentMerchant();
        console.log('API response for merchant data:', merchantData);
        
        // Сохраняем отладочную информацию
        setDebugInfo({
          source: 'API',
          hasMerchantData: !!merchantData,
          merchantSlug: merchantData?.slug,
          merchantId: merchantData?.merchantId,
          apiResponseKeys: merchantData ? Object.keys(merchantData) : [],
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 20)}...` : null,
          timestamp: startTime.toISOString()
        });
        
        if (merchantData && merchantData.slug) {
          console.log('Received slug from API:', merchantData.slug);
          
          // Сохраняем slug в localStorage для будущего использования
          localStorage.setItem('merchantSlug', merchantData.slug);
          
          // Перенаправляем на страницу QR с ID мерчанта через ЖЕСТКИЙ редирект
          console.log('Redirecting to:', `/merchant/qr/${merchantData.slug}`);
          window.location.href = `/merchant/qr/${merchantData.slug}`;
          return;
        }
        
        // Если не смогли получить slug через API, пробуем создать тестовую ссылку
        try {
          console.log('Attempting to create application link to extract slug...');
          // Создаем тестовую ссылку, чтобы получить slug
          // Используем правильное значение merchantSlug, если оно доступно где-то еще
          const defaultSlug = 'default-slug';
          const applicationData = await merchantService.createApplicationLink(defaultSlug, 0);
          console.log('Application link response:', applicationData);
          
          // Из ответа API извлекаем slug из redirectUrl
          let extractedSlug = null;
          if (applicationData && applicationData.redirectUrl) {
            console.log('Redirect URL from application link:', applicationData.redirectUrl);
            const matches = applicationData.redirectUrl.match(/\/public\/([^\/]+)\//)
            if (matches && matches[1]) {
              extractedSlug = matches[1];
              console.log('Extracted slug from redirect URL:', extractedSlug);
              
              // Сохраняем slug в localStorage
              localStorage.setItem('merchantSlug', extractedSlug);
              
              // Перенаправляем с жестким редиректом
              console.log('Redirecting to:', `/merchant/qr/${extractedSlug}`);
              window.location.href = `/merchant/qr/${extractedSlug}`;
              return;
            }
          }
          
          setError('Не удалось получить идентификатор мерчанта');
        } catch (innerError) {
          console.error('Error creating application link:', innerError);
          setError('Не удалось создать тестовую ссылку для получения slug');
        }
      } catch (err: any) {
        console.error('Error getting merchant data:', err);
        setError(err.message || 'Произошла ошибка при перенаправлении');
      }
    };
    
    redirectToQRPage();
  }, [router]);
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-xl font-medium text-red-600 mb-4">Ошибка</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          {debugInfo && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left text-sm overflow-auto max-w-md mx-auto">
              <p className="font-medium mb-2">Отладочная информация:</p>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
          
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => router.push('/merchant/link')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Вернуться на страницу ссылок
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Перенаправление...</p>
        
        {debugInfo && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left text-sm">
            <p className="font-medium mb-2">Отладочная информация:</p>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 