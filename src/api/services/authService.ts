import axiosClient from '../axiosClient';

// Типы для данных регистрации и входа
export interface RegisterData {
  email: string;
  password: string;
  companyName: string;
  bin: string;
  phoneNumber: string;
  address: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Сервис авторизации
const authService = {
  // Регистрация нового мерчанта
  register: async (data: RegisterData) => {
    try {
      const response = await axiosClient.post('/auth/register', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Вход мерчанта
  login: async (data: LoginData) => {
    try {
      const response = await axiosClient.post('/auth/login', data);
      
      // Сохраняем токен в localStorage, если он есть в ответе
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Выход (очистка токена)
  logout: () => {
    localStorage.removeItem('token');
  },

  // Проверка авторизации (наличие токена)
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }
};

export default authService; 