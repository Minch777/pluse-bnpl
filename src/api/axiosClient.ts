import axios from 'axios';

// Базовый URL API из переменных окружения (с возможностью переопределения)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4010';
console.log('API URL configured as:', API_URL);

// Проверяет, выполняется ли код на стороне браузера
const isBrowser = typeof window !== 'undefined';

// Создаем экземпляр Axios с базовой конфигурацией
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Устанавливаем таймаут для запросов
  timeout: 15000
});

// Интерцептор для запросов - будет выполняться перед каждым запросом
axiosClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    // Здесь можно добавить токен авторизации, если пользователь залогинен
    if (isBrowser) {
      const token = localStorage.getItem('token');
      if (token) {
        // Обеспечиваем, что формат токена правильный: Bearer токен
        // Важно: сервер ожидает конкретно такой формат
        config.headers['Authorization'] = token.startsWith('Bearer ') 
          ? token 
          : `Bearer ${token}`;
        
        console.log('Authorization header set:', config.headers['Authorization'].substring(0, 20) + '...');
        // Для отладки - вывести полный токен
        console.log('FULL TOKEN:', config.headers['Authorization']);
      } else {
        console.log('No auth token found in localStorage');
      }
    }
    
    console.log('Final request headers:', JSON.stringify(config.headers));
    return config;
  },
  (error) => {
    console.error('Request error interceptor:', error);
    return Promise.reject(error);
  }
);

// Интерцептор для ответов - будет выполняться после каждого ответа
axiosClient.interceptors.response.use(
  (response) => {
    console.log('Response received from API:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url
    });
    // Успешный ответ - возвращаем данные
    return response.data;
  },
  (error) => {
    console.error('Response error interceptor:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });

    // Если ошибка 401 (Unauthorized) или 403 (Forbidden), перенаправляем на страницу логина
    if (isBrowser && (error.response?.status === 401 || error.response?.status === 403)) {
      console.log('Authentication error detected, redirecting to login');
      // Очищаем токен
      localStorage.removeItem('token');
      
      // Перенаправляем на страницу логина, если мы не уже на ней
      if (window.location.pathname !== '/login') {
        // Сохраняем текущий URL для возможного редиректа после успешной авторизации
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = '/login';
      }
    }
    
    // Обработка ошибок
    const customError = {
      message: error.response?.data?.message || 'Что-то пошло не так',
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };
    return Promise.reject(customError);
  }
);

export default axiosClient; 