'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getCurrentToken } from '@/api/services/authService';

export default function TestTokenPage() {
  const [token, setToken] = useState<string>('');
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenFormat, setTokenFormat] = useState<{
    hasBearer: boolean;
    isJWT: boolean;
    length: number;
    preview: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Получаем токен из localStorage при загрузке страницы
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      analyzeToken(storedToken);
    }
  }, []);

  const handleTokenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newToken = e.target.value;
    setToken(newToken);
    if (newToken) {
      analyzeToken(newToken);
    } else {
      setTokenFormat(null);
    }
  };

  // Функция для анализа формата токена
  const analyzeToken = (tkn: string) => {
    const hasBearer = tkn.trim().startsWith('Bearer ');
    // Упрощенная проверка на JWT формат (3 части, разделенные точками)
    const tokenParts = hasBearer ? tkn.substring(7).split('.') : tkn.split('.');
    const isJWT = tokenParts.length === 3;

    setTokenFormat({
      hasBearer,
      isJWT,
      length: tkn.length,
      preview: tkn.substring(0, 30) + '...'
    });
  };

  const saveToken = () => {
    if (token.trim()) {
      // Добавляем 'Bearer ' если нужно
      const formattedToken = token.trim().startsWith('Bearer ') 
        ? token.trim() 
        : `Bearer ${token.trim()}`;
      
      localStorage.setItem('token', formattedToken);
      setToken(formattedToken);
      analyzeToken(formattedToken);
      setError(null);
      setTestResult(null);
      alert('Токен сохранен с префиксом Bearer!');
    } else {
      setError('Пожалуйста, введите токен');
    }
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    setToken('');
    setTestResult(null);
    setError(null);
    setTokenFormat(null);
    alert('Токен удален!');
  };

  const testToken = async () => {
    const currentToken = token || localStorage.getItem('token');
    if (!currentToken) {
      setError('Токен не найден');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Тестируем токен на локальном API
      const response = await axios.get('/api/test-token', {
        headers: {
          Authorization: currentToken.startsWith('Bearer ') 
            ? currentToken 
            : `Bearer ${currentToken}`
        }
      });
      
      console.log('Test token response:', response.data);
      setTestResult(response.data);
    } catch (err: any) {
      console.error('Error testing token:', err);
      setError(err.response?.data?.error || err.message || 'Ошибка при проверке токена');
    } finally {
      setLoading(false);
    }
  };

  const testApiCall = async () => {
    const currentToken = token || localStorage.getItem('token');
    if (!currentToken) {
      setError('Токен не найден');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Тестируем токен на внешнем API
      const response = await axios.get('http://localhost:4010/merchant/me', {
        headers: {
          Authorization: currentToken.startsWith('Bearer ') 
            ? currentToken 
            : `Bearer ${currentToken}`
        }
      });
      
      console.log('API test response:', response.data);
      setTestResult(response.data);
    } catch (err: any) {
      console.error('Error calling API:', err);
      setError(err.response?.data?.error || err.message || 'Ошибка при вызове API');
    } finally {
      setLoading(false);
    }
  };

  // Примеры токенов из скриншота
  const setExampleToken = () => {
    const exampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiVGVzdCBVc2VyIiwicm9sZSI6Im1lcmNoYW50In0.7bHQI2CmTCgQuV3PJeVgGlsafKH5hEtO-3o4NZP5bh0';
    setToken(`Bearer ${exampleToken}`);
    analyzeToken(`Bearer ${exampleToken}`);
  };

  const setExampleToken2 = () => {
    // Пример из скриншота API запроса
    const exampleToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMTIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9';
    setToken(`Bearer ${exampleToken}`);
    analyzeToken(`Bearer ${exampleToken}`);
  };
  
  const setCurlExampleToken = () => {
    // Токен из curl запроса
    const exampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiVGVzdCBVc2VyIiwicm9sZSI6Im1lcmNoYW50In0.7bHQI2CmTCgQuV3PJeVgGlsafKH5hEtO-3o4NZP5bh0';
    const fullToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiVGVzdCBVc2VyIiwicm9sZSI6Im1lcmNoYW50In0.7bHQI2CmTCgQuV3PJeVgGlsafKH5hEtO-3o4NZP5bh0.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiVGVzdCBVc2VyIiwicm9sZSI6Im1lcmNoYW50In0.7bHQI2CmTCgQuV3PJeVgGlsafKH5hEtO-3o4NZP5bh0';
    setToken(`Bearer ${fullToken}`);
    analyzeToken(`Bearer ${fullToken}`);
  };
  
  const setAdminToken = () => {
    // Токен из скриншота curl запроса к /applications
    const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTY5ODIzNzY5OX0.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTY5ODIzNzY5OX0.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTY5ODIzNzY5OX0';
    setToken(`Bearer ${adminToken}`);
    analyzeToken(`Bearer ${adminToken}`);
  };
  
  const setWorkingMerchantToken = () => {
    // Рабочий токен для мерчанта с ID bfa2bcad-2090-4ef8-8b39-642a179aef5c
    const merchantToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MzlhZWI5LWRmMTgtNDFmMi04Njg5LWU0ZjUwY2RjMDFkNCIsImVtYWlsIjoidGVzdC0xQHBsdXNlLmt6Iiwicm9sZSI6Ik1FUkNIQU5UIiwibWVyY2hhbnRJZCI6ImJmYTJiY2FkLTIwOTAtNGVmOC04YjM5LTY0MmExNzlhZWY1YyIsImlhdCI6MTc0NzMzOTkwOSwiZXhwIjoxNzQ3OTQ0NzA5fQ.MCtjAC_vwixd6JIkp3iw0EyTErudKdcIDYQk2PaBDII';
    setToken(`Bearer ${merchantToken}`);
    analyzeToken(`Bearer ${merchantToken}`);
    
    // Автоматически сохраняем токен в localStorage
    localStorage.setItem('token', `Bearer ${merchantToken}`);
    alert('Токен сохранен в localStorage! Теперь можно перейти на страницу дашборда');
  };
  
  const setApplicationsCurlToken = () => {
    // Токен из скриншота curl запроса к /applications 
    const exactApplicationsToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTY5ODIzNzY5OX0.eyJJbVZ0WVdsVGpvaWRHVnpkRWRXbHNaR1ZTSWl3aWNtOXNaU0k2SW1Ga2JXbHVJbjAuSW1KWFZsSVkyaG9ZbTVTU2twRFNVWkpUV3BUVkVwMk5qUmhjMmhoU0c1NmRFMUdiRTFVU2w5SFdsVjVUbUZwVERsaGRHUkRSbEZLY1RCd2JFUmtJbjAuSXdPVEF0TkdWbU9DVmFqN2lWdDVXeXNJam9pZCttTVRndE5JaXdJZCBoNVJWbW1zSERxenJyX3Mtc3pEdktzdGVzZmF3dnhwREc3djJnQ1VUOCIsImlhdCI6MTY5MTYyODcwMCwiZXhwIjoxNjkxNjMyMzAwfQ.IXN4YXRzYWRmQCM_JSQmKl4-SGhSVm1tc0hEcXpycl9zLXN6RHZLc3Rlc2Zhd3Z4cERHN3YyZ0NVVDg';
    
    // Точный токен из скриншота curl запроса к /applications
    const actualCurlToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyMTIzQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.eyJKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpFeU16UTFOamM0T1RBaUxDSnVZVzFsSWpvaVZHVnpkQ0JWYzJWeUlpd2ljbTlzWlNJNkltMWxjbU5vWVc1MElsMHVOM2xLU0doaVl5NSJTZ3BHYlU1aU5VWmFTbFoxTmsxQlVFZEVRMGxhVFdwRGQwVldhWGxEYlVJM05sRmxOMnRXYjBOWlduTXJXRlo0YWtsUFpYcFVhMGhIZEd0SVNuUTVVek5EVjJWQ1RVWmxZUzgwVTFVNGJuVktkMlUzWVVvNFZuYzNkV1Z1Y2tGMVRscGxjRE5sY2xkeFVXVmFkRVJUU21SVFdrZ3hjRmhHTUVWCk9XVlJSMU5GVDJoalVYWnRVbTlHVWtoYWJYbEhZV1pVVDFoRWJWcFBUV0l3TlVsNUswbG1jbk5tTVhWR2JFVkZWVmxRVEhWS2FVRnUKWkRsMFF6UllSMnROTTNCUk9TdHBMekIxYVdzMU5UVmxPR0ZyUkVGbmNFVnhJaXcKJmFtJl4q-HhRVm1tc0hEcXpycl9zLXN6RHZLc3Rlc2Zhd3Z4cERHN3YyZ0NVVDg=';
    
    setToken(`Bearer ${actualCurlToken}`);
    analyzeToken(`Bearer ${actualCurlToken}`);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6">Тестирование токена авторизации</h1>
        
        <div className="space-y-6">
          {tokenFormat && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-700 mb-2">Анализ текущего токена:</h3>
              <ul className="space-y-1 text-sm">
                <li><span className="font-medium">Формат:</span> {tokenFormat.hasBearer ? 'Включает префикс Bearer' : 'Без префикса Bearer'}</li>
                <li><span className="font-medium">Структура JWT:</span> {tokenFormat.isJWT ? 'Правильная (три части)' : 'Неправильная'}</li>
                <li><span className="font-medium">Длина:</span> {tokenFormat.length} символов</li>
                <li><span className="font-medium">Начало:</span> {tokenFormat.preview}</li>
              </ul>
            </div>
          )}
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-medium text-yellow-700 mb-2">Как используется токен на странице мерчанта:</h3>
            <ol className="space-y-2 text-sm list-decimal pl-4">
              <li>
                <strong>Авторизация:</strong> Токен должен быть сохранен в localStorage как <code>token</code> 
                и иметь формат <code>Bearer JWT-TOKEN</code>
              </li>
              <li>
                <strong>API запросы:</strong> Токен автоматически извлекается из localStorage и добавляется 
                в заголовок <code>Authorization</code> для всех API запросов через axiosClient
              </li>
              <li>
                <strong>Проверка доступа:</strong> Если токен отсутствует или неверен, 
                пользователь перенаправляется на страницу логина
              </li>
              <li>
                <strong>Важно:</strong> Если на странице мерчанта вы видите ошибку "Authorization header is required", 
                это означает, что токен не был правильно сохранен или применен
              </li>
            </ol>
          </div>
        
          <div>
            <label className="block text-gray-700 font-medium mb-2">JWT Токен</label>
            <textarea
              value={token}
              onChange={handleTokenChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              placeholder="Введите JWT токен здесь..."
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={saveToken}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Сохранить токен
            </button>
            
            <button
              onClick={clearToken}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Удалить токен
            </button>
            
            <button
              onClick={setExampleToken}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Тестовый токен 1
            </button>
            
            <button
              onClick={setExampleToken2}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Тестовый токен 2
            </button>
            
            <button
              onClick={testToken}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Проверка...' : 'Проверить токен'}
            </button>
            
            <button
              onClick={testApiCall}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Тестирование...' : 'Тест API-вызова'}
            </button>
            
            <button
              onClick={() => router.push('/merchant/link')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Перейти на страницу ссылок
            </button>
          </div>
          
          <div className="flex space-x-2 mt-2">
            <button
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              onClick={setExampleToken}
            >
              Тестовый токен
            </button>
            <button
              className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
              onClick={setExampleToken2}
            >
              Тестовый JWT токен
            </button>
            <button
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              onClick={setCurlExampleToken}
            >
              Merchant токен (curl)
            </button>
            <button
              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
              onClick={setAdminToken}
            >
              Admin токен
            </button>
            <button
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              onClick={setApplicationsCurlToken}
            >
              Точный Token из curl
            </button>
          </div>
          
          <div className="mt-2">
            <button
              className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 shadow-md"
              onClick={setWorkingMerchantToken}
            >
              Установить рабочий токен мерчанта 🚀
            </button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
              <p className="font-medium">Ошибка:</p>
              <p>{error}</p>
            </div>
          )}
          
          {testResult && (
            <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-100">
              <p className="font-medium mb-2">Результат проверки:</p>
              <pre className="bg-white p-4 rounded-lg overflow-auto max-h-[400px] text-sm">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 