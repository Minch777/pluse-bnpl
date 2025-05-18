'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import applicationService from '@/api/services/applicationService';

export default function ApplicationPage({ 
  params 
}: { 
  params: { 
    slug: string; 
    outletIndex: string;
    applicationId: string;
  } 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState<any>(null);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setLoading(true);
        // Here you would typically fetch the application data based on the ID
        // For now, we'll just use what we have in the URL
        setApplicationData({
          id: params.applicationId,
          merchantSlug: params.slug,
          outletIndex: params.outletIndex,
          status: 'PENDING'
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching application data:', err);
        setError('Не удалось загрузить данные заявки');
        setLoading(false);
      }
    };

    fetchApplicationData();
  }, [params.applicationId, params.slug, params.outletIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Загрузка заявки...</h2>
          <p className="text-gray-600">
            Пожалуйста, подождите, мы загружаем данные вашей заявки.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <svg 
            className="h-16 w-16 text-red-500 mx-auto mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Ошибка</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Image 
              src="/pluse-logo.png" 
              alt="Pluse" 
              width={100} 
              height={30} 
              className="h-8 w-auto" 
            />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 sm:p-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ваша заявка на рассрочку</h1>
          <p className="text-gray-600 mb-6">ID заявки: {applicationData?.id}</p>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Магазин</p>
                <p className="mt-1 text-lg text-gray-900">{params.slug}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Торговая точка</p>
                <p className="mt-1 text-lg text-gray-900">№{params.outletIndex}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Статус</p>
                <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  В обработке
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Заполните контактные данные</h2>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">ФИО</label>
              <input
                type="text"
                id="fullName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                placeholder="Иванов Иван Иванович"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Телефон</label>
              <input
                type="tel"
                id="phone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                placeholder="+7 (___) ___-__-__"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                placeholder="example@mail.com"
              />
            </div>
            
            <div className="pt-4">
              <button
                type="button"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Продолжить
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 