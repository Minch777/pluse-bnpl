'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DebugPage() {
  const [token, setToken] = useState<string | null>(null);
  const [guide, setGuide] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Проверяем текущий токен при загрузке
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    
    // Загружаем руководство по отладке
    fetch('/api/debug-guide')
      .then(res => res.json())
      .then(data => setGuide(data))
      .catch(err => console.error('Error loading debug guide:', err));
  }, []);

  const clearToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 bg-blue-600 text-white">
            <h1 className="text-3xl font-bold">Инструменты отладки авторизации</h1>
            <p className="mt-2 text-blue-100">Диагностика и решение проблем с авторизацией и API</p>
          </div>
          
          <div className="p-6">
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h2 className="font-medium text-blue-800 mb-2">Текущий статус токена:</h2>
              {token ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <p className="text-green-700 font-medium">Токен присутствует</p>
                  </div>
                  <div className="text-sm text-blue-600">
                    <span className="font-medium">Формат:</span> {token.startsWith('Bearer ') ? 'С префиксом Bearer' : 'Без префикса Bearer'}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <p className="text-red-700 font-medium">Токен отсутствует</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Link 
                href="/test-token"
                className="bg-white border border-gray-200 p-5 rounded-xl hover:shadow-md transition-shadow flex flex-col"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Тестирование токена</h3>
                <p className="text-gray-600 mb-4">Проверка и управление JWT-токеном авторизации</p>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <span className="text-blue-600 font-medium">Открыть инструмент →</span>
                </div>
              </Link>
              
              <Link 
                href="/test-login"
                className="bg-white border border-gray-200 p-5 rounded-xl hover:shadow-md transition-shadow flex flex-col"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Тестирование логина</h3>
                <p className="text-gray-600 mb-4">Проверка процесса логина и получения токена</p>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <span className="text-blue-600 font-medium">Открыть инструмент →</span>
                </div>
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push('/merchant/link')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Перейти на страницу ссылок
              </button>
              
              <button
                onClick={clearToken}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Удалить токен
              </button>
              
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Страница логина
              </button>
            </div>
          </div>
        </div>
        
        {guide && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">{guide.title}</h2>
              <p className="mt-2 text-gray-600">{guide.description}</p>
            </div>
            
            <div className="p-6">
              {guide.debugSteps.map((step: any) => (
                <div key={step.id} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {step.id}. {step.title}
                  </h3>
                  {step.description && (
                    <p className="text-gray-600 mb-3">{step.description}</p>
                  )}
                  
                  {step.steps && (
                    <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                      {step.steps.map((subStep: string, idx: number) => (
                        <li key={idx}>{subStep}</li>
                      ))}
                    </ol>
                  )}
                  
                  {step.items && (
                    <div className="bg-gray-50 p-4 rounded-lg mt-3">
                      {step.items.map((item: any, idx: number) => (
                        <div key={idx} className="mb-3 last:mb-0">
                          <p className="font-medium text-red-600">{item.problem}</p>
                          <p className="text-gray-700">{item.solution}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 