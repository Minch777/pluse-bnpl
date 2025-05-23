'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import merchantService from '@/api/services/merchantService';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

// Modern color palette
const colors = {
  primary: '#0284C7',
  primaryDark: '#0369A1',
  primaryLight: '#E0F2FE',
};

export default function PublicPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const processApplication = async () => {
      try {
        const merchantSlug = params.slug;
        const outletIndex = 1;
        
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
          setError('Не удалось создать заявку. Пожалуйста, попробуйте позже.');
          setIsProcessing(false);
        }
      }
    };

    if (isProcessing) {
      processApplication();
    }
  }, [params.slug, router, isProcessing, retryCount]);

  const handleManualRetry = () => {
    setError(null);
    setIsProcessing(true);
    setRetryCount(0);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">    
      {/* Add animation for spinner */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin 1.5s linear infinite;
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <main className="flex-grow flex items-center justify-center bg-white">
        <div className="max-w-md w-full mx-auto px-6 -mt-10">
          {isProcessing ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden p-6 text-center">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-[#f7faff]"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-sky-600 animate-spin-slow" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" stroke="none"></path>
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-1">Создаем заявку</h2>
                <p className="text-sm text-gray-500">Подключаемся к сервису рассрочки</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden p-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-red-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Произошла ошибка</h2>
                <p className="text-sm text-gray-500 mb-4">Не удалось создать заявку</p>
                <button 
                  onClick={handleManualRetry}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Попробовать снова
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 