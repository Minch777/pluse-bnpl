import axios from 'axios';

// Базовый URL API из переменных окружения (с возможностью переопределения)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4010';

// Создаем экземпляр Axios с базовой конфигурацией
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для запросов - будет выполняться перед каждым запросом
axiosClient.interceptors.request.use(
  (config) => {
    // Здесь можно добавить токен авторизации, если пользователь залогинен
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для ответов - будет выполняться после каждого ответа
axiosClient.interceptors.response.use(
  (response) => {
    // Успешный ответ - возвращаем данные
    return response.data;
  },
  (error) => {
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