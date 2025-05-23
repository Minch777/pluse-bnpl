'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import merchantService from '@/api/services/merchantService';
import { SparklesIcon, ShieldCheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function OutletPage({ params }: { params: { slug: string; outletIndex: string } }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const processApplication = async () => {
      try {
        console.log('Processing application with slug and outlet:', params.slug, params.outletIndex);
        
        // Use slug and outlet index from the URL
        const merchantSlug = params.slug;
        const outletIndex = parseInt(params.outletIndex) || 0;
        
        console.log(`Using merchantSlug: ${merchantSlug}, outletIndex: ${outletIndex}`);
        
        // Create application link
        const applicationLink = await merchantService.createApplicationLink(merchantSlug, outletIndex);
        
        // Redirect to the application URL
        window.location.href = applicationLink.redirectUrl;
      } catch (err) {
        console.error('Error creating application:', err);
        setError('Произошла ошибка при создании заявки. Пробуем снова...');
        
        // Auto-retry after 3 seconds, but limit number of retries
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            setError(null);
            setIsProcessing(true);
          }, 3000);
        } else {
          setError('Не удалось создать заявку. Пожалуйста, попробуйте позже или обратитесь в службу поддержки.');
          setIsProcessing(false);
        }
      }
    };

    if (isProcessing) {
      processApplication();
    }
  }, [params.slug, params.outletIndex, router, isProcessing, retryCount]);

  const handleManualRetry = () => {
    setError(null);
    setIsProcessing(true);
    setRetryCount(0);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/pluse-logo.png"
                alt="Pluse"
                width={100}
                height={28}
                className="w-auto h-6"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                {isProcessing ? (
                  <>
                    <div className="w-16 h-16 mb-6 rounded-full bg-[#f7faff] flex items-center justify-center">
                      <div className="w-10 h-10 border-2 border-t-sky-600 border-sky-100 rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Создание заявки...</h2>
                    <p className="text-gray-600 mb-6">
                      Пожалуйста, подождите. Мы создаем вашу заявку на финансирование.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mb-6 rounded-full bg-red-50 flex items-center justify-center">
                      <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Произошла ошибка</h2>
                    <p className="text-gray-600 mb-6">
                      {error || 'Не удалось создать заявку. Пожалуйста, попробуйте позже.'}
                    </p>
                    <button 
                      onClick={handleManualRetry}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <ArrowPathIcon className="w-4 h-4 mr-2" />
                      Попробовать снова
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Trust information footer */}
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-sky-100 flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Безопасность данных</h4>
                  <p className="text-sm text-gray-600">
                    Ваши данные защищены. Все транзакции проходят по защищенным каналам связи.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 