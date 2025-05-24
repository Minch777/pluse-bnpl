import axiosClient from '../axiosClient';

// Типы для данных регистрации и входа
export interface RegisterData {
  email: string;
  password: string;
  companyName: string;
  bin: string;
  phoneNumber: string;
  address: string;
  directorName: string;
  website?: string; // Optional field since it's not required in validation
}

export interface LoginData {
  email: string;
  password: string;
}

// Интерфейс ответа при успешном логине
export interface LoginResponse {
  token?: string;
  accessToken?: string;
  role: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

// Функция для получения текущего токена - полезно для отладки
export const getCurrentToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

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
    console.log('Attempting login with:', { email: data.email, passwordLength: data.password?.length });
    try {
      const response = await axiosClient.post<LoginResponse>('/auth/login', data);
      
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      // Проверяем структуру ответа
      const responseData = response.data || response;
      
      // Подробное логирование
      console.log('Login response received:', {
        success: true,
        hasData: !!response.data,
        responseData: responseData,
        hasToken: !!(responseData.token || responseData.accessToken),
        tokenPreview: responseData.token ? `${responseData.token.slice(0, 15)}...` : 
                     responseData.accessToken ? `${responseData.accessToken.slice(0, 15)}...` : 'No token',
        role: responseData.role,
        userId: responseData.user?.id
      });
      
      // Сохраняем токен в localStorage, если он есть в ответе
      // Используем token или accessToken, в зависимости от того, что вернул сервер
      const responseToken = responseData.token || responseData.accessToken;
      
      if (responseToken) {
        // Убедимся, что токен имеет префикс Bearer, если нет - добавим его
        const tokenToStore = responseToken.startsWith('Bearer ') 
          ? responseToken 
          : `Bearer ${responseToken}`;
        
        localStorage.setItem('token', tokenToStore);
        console.log('Token saved to localStorage:', tokenToStore.slice(0, 20) + '...');
        
        // Проверка сохранения
        const savedToken = localStorage.getItem('token');
        console.log('Verification - token from localStorage:', savedToken ? `${savedToken.slice(0, 20)}...` : 'No token found');
      } else {
        console.error('Warning: Login successful but no token received from server');
      }
      
      return responseData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Выход (очистка токена)
  logout: () => {
    console.log('Logging out, removing token from localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('redirectAfterLogin');
  },

  // Проверка авторизации (наличие токена)
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    console.log('Authentication check:', token ? 'Token exists' : 'No token found');
    return !!token;
  },
  
  // Получить URL для перенаправления после логина (если такой сохранен)
  getRedirectUrl: () => {
    if (typeof window === 'undefined') return null;
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    console.log('Redirect URL from localStorage:', redirectUrl || 'No redirect URL found');
    if (redirectUrl) {
      localStorage.removeItem('redirectAfterLogin');
      return redirectUrl;
    }
    return null;
  }
};

export default authService; 