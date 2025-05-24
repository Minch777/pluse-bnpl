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
    console.log('Making request to:', (config.baseURL || '') + (config.url || ''));
    console.log('Request method:', config.method?.toUpperCase());
    console.log('Request params:', config.params);
    console.log('Request data:', config.data ? {
      ...config.data,
      password: config.data.password ? '*'.repeat(config.data.password.length) : undefined
    } : 'No data');
    
    // Здесь можно добавить токен авторизации, если пользователь залогинен
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'No token');
      
      if (token) {
        // Обеспечиваем, что формат токена правильный: Bearer токен
        const finalToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        config.headers.Authorization = finalToken;
        
        console.log('Authorization header set:', finalToken);
      } else {
        console.log('No auth token found in localStorage');
        // НЕ делаем автоматический редирект при отсутствии токена
        // Пусть сервер решает, нужна ли авторизация для конкретного запроса
      }
    }
    
    // Логируем все заголовки запроса
    console.log('Request headers:', {
      ...config.headers,
      Authorization: typeof config.headers.Authorization === 'string' 
        ? `${config.headers.Authorization.substring(0, 20)}...` 
        : 'none'
    });
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Интерцептор для ответов - будет выполняться после каждого ответа
axiosClient.interceptors.response.use(
  (response) => {
    console.log('Response received from API:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      dataType: typeof response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
      isArray: Array.isArray(response.data)
    });
    
    // Если это массив мерчантов, логируем первый элемент
    if (response.config.url?.includes('/merchant/admin/all') && Array.isArray(response.data)) {
      console.log('Merchants response is array, length:', response.data.length);
      if (response.data.length > 0) {
        console.log('First merchant from API:', response.data[0]);
      }
    }
    
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Authentication error detected, redirecting to login');
      // Очищаем токен
      localStorage.removeItem('token');
      
      // Определяем правильную страницу логина в зависимости от текущего URL
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const isAdminPage = currentPath.startsWith('/admin');
        const loginPage = isAdminPage ? '/admin/login' : '/login';
        
        // Перенаправляем на соответствующую страницу логина, если мы не уже на ней
        if (currentPath !== loginPage) {
          window.location.href = loginPage;
        }
      }
    }
    
    // Обработка ошибок
    let errorMessage = '';
    const errorData = error.response?.data;
    
    // Выводим в консоль для отладки
    console.log('Error data from server:', errorData);

    // Проверяем все возможные места, где может быть сообщение об ошибке
    if (errorData) {
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      } else if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        errorMessage = errorData.errors[0];
      }
    }

    // Если после всех проверок сообщение не найдено, используем общее
    if (!errorMessage) {
      errorMessage = 'Произошла ошибка при выполнении запроса';
    }

    const customError = {
      message: errorMessage,
      status: error.response?.status || 500,
      data: errorData || null,
    };

    return Promise.reject(customError);
  }
);

export default axiosClient; 