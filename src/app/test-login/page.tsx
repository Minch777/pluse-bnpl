'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/api/services/authService';
import axios from 'axios';

export default function TestLoginPage() {
  const [email, setEmail] = useState('user123@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [responseAnalysis, setResponseAnalysis] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Проверяем текущий токен при загрузке
    const token = localStorage.getItem('token');
    setCurrentToken(token);
  }, []);

  // Функция для анализа ответа API
  const analyzeResponse = (response: any) => {
    try {
      let analysis = '';
      
      // Проверяем наличие токена в ответе
      if (response.token) {
        analysis += `✅ Ответ содержит поле token: ${response.token.slice(0, 20)}...\n`;
      } else if (response.accessToken) {
        analysis += `✅ Ответ содержит поле accessToken: ${response.accessToken.slice(0, 20)}...\n`;
      } else {
        analysis += `❌ В ответе отсутствует token или accessToken!\n`;
      }
      
      // Проверяем сохранен ли токен в localStorage
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        analysis += `✅ Токен сохранен в localStorage: ${savedToken.slice(0, 20)}...\n`;
        
        // Проверяем формат токена
        if (savedToken.startsWith('Bearer ')) {
          analysis += `✅ Токен имеет правильный префикс "Bearer"\n`;
        } else {
          analysis += `❌ Токен НЕ имеет префикса "Bearer"!\n`;
        }
      } else {
        analysis += `❌ Токен НЕ был сохранен в localStorage!\n`;
      }
      
      return analysis;
    } catch (error) {
      return `Ошибка при анализе ответа: ${error}`;
    }
  };

  // Тестовый логин через наш сервис authService
  const handleRealLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      console.log('Real login response:', response);
      setResult(response);
      
      // Обновляем текущий токен для отображения
      const token = localStorage.getItem('token');
      setCurrentToken(token);
      
      // Анализируем ответ
      setResponseAnalysis(analyzeResponse(response));
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  // Тестовый логин через тестовый API-эндпоинт
  const handleTestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/test-login', { email, password });
      console.log('Test login response:', response.data);
      
      // Сохраняем токен вручную
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      } else if (response.data.accessToken) {
        // Добавляем поддержку accessToken
        const tokenToStore = response.data.accessToken.startsWith('Bearer ')
          ? response.data.accessToken
          : `Bearer ${response.data.accessToken}`;
        localStorage.setItem('token', tokenToStore);
      }
      
      // Обновляем отображение токена
      const token = localStorage.getItem('token');
      setCurrentToken(token);
      
      setResult(response.data);
      
      // Анализируем ответ
      setResponseAnalysis(analyzeResponse(response.data));
    } catch (err: any) {
      console.error('Test login error:', err);
      setError(err.response?.data?.error || err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    setCurrentToken(null);
    setResult(null);
    setResponseAnalysis(null);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6">Тестирование процесса логина</h1>
        
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h2 className="font-medium text-blue-800 mb-2">Текущий токен в localStorage:</h2>
          {currentToken ? (
            <div>
              <pre className="bg-white p-3 rounded text-sm overflow-auto max-h-20 mb-2">
                {currentToken}
              </pre>
              <div className="text-sm text-blue-600">
                <span className="font-medium">Формат:</span> {currentToken.startsWith('Bearer ') ? 'С префиксом Bearer' : 'Без префикса Bearer'}
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-600">Токен отсутствует</p>
          )}
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleRealLogin}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : 'Реальный API логин'} 
          </button>
          
          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : 'Тестовый API логин'}
          </button>
          
          <button
            onClick={clearToken}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Удалить токен
          </button>
          
          <button
            onClick={() => router.push('/test-token')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Страница тестирования токена
          </button>
          
          <button
            onClick={() => router.push('/merchant/link')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Страница ссылок
          </button>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 mb-6">
            <p className="font-medium">Ошибка:</p>
            <p>{error}</p>
          </div>
        )}
        
        {responseAnalysis && (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-100 mb-6">
            <p className="font-medium mb-2">Анализ ответа:</p>
            <pre className="bg-white p-3 rounded text-sm overflow-auto whitespace-pre-wrap">
              {responseAnalysis}
            </pre>
          </div>
        )}
        
        {result && (
          <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-100">
            <p className="font-medium mb-2">Результат входа:</p>
            <pre className="bg-white p-4 rounded-lg overflow-auto max-h-[300px] text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 