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

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Интерфейс ответа при успешном логине
export interface LoginResponse {
  success?: boolean;
  token?: string;
  accessToken?: string;
  role?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  // Поля для ошибок
  error?: string;
  message?: string;
  statusCode?: number;
}

// Функция для получения текущего токена - полезно для отладки
export const getCurrentToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Сервис авторизации
export const authService = {
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
      
      console.log('=== УСПЕШНЫЙ ОТВЕТ ===');
      console.log('Full response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));
      
      // axiosClient возвращает уже response.data, не полный response объект
      const responseData = response as LoginResponse;
      
      // ВАЖНО: Проверяем, что действительно есть токен
      const responseToken = responseData.accessToken || responseData.token;
      
      if (!responseToken) {
        console.error('Login failed: No token in response');
        throw new Error('Ошибка аутентификации: токен не получен');
      }
      
      // ПРОВЕРКА: обычный логин только для мерчантов
      if (responseData.role === 'ADMIN') {
        console.error('Login failed: Admins should use admin login endpoint');
        localStorage.removeItem('token'); // Очищаем токен если он был сохранен
        // Возвращаем специальную ошибку с информацией о перенаправлении
        const error = new Error('Администраторы должны использовать страницу входа для администраторов') as any;
        error.shouldRedirectToAdmin = true;
        throw error;
      }
      
      // Дополнительная проверка: если есть поле success, то оно должно быть true
      if (responseData.hasOwnProperty('success') && !responseData.success) {
        console.error('Login failed: success field is false');
        throw new Error('Ошибка аутентификации: вход не выполнен');
      }
      
      // Проверяем что токен выглядит как реальный токен (не просто строка "invalid")
      if (typeof responseToken !== 'string' || responseToken.length < 10) {
        console.error('Login failed: Invalid token format');
        throw new Error('Ошибка аутентификации: некорректный токен');
      }
      
      // Только после проверки токена сохраняем его
      // Убедимся, что токен имеет префикс Bearer, если нет - добавим его
      const tokenToStore = responseToken.startsWith('Bearer ') 
        ? responseToken 
        : `Bearer ${responseToken}`;
      
      localStorage.setItem('token', tokenToStore);
      console.log('Token saved to localStorage:', tokenToStore.slice(0, 20) + '...');
      
      // Проверка сохранения
      const savedToken = localStorage.getItem('token');
      console.log('Verification - token from localStorage:', savedToken ? `${savedToken.slice(0, 20)}...` : 'No token found');
      
      return responseData;
    } catch (error: any) {
      console.log('=== ОШИБКА ЛОГИНА ===');
      console.error('Login error caught:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error || {}));
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      console.error('Error data:', error.data);
      
      // Убедимся, что при ошибке токен не остается в localStorage
      localStorage.removeItem('token');
      throw error;
    }
  },

  // Вход администратора
  adminLogin: async (data: LoginData) => {
    console.log('Attempting admin login with:', { email: data.email, passwordLength: data.password?.length });
    try {
      console.log('Sending request to /auth/admin/login with data:', {
        email: data.email,
        passwordMask: '*'.repeat(data.password?.length || 0)
      });

      const response = await axiosClient.post<LoginResponse>('/auth/admin/login', data);
      
      console.log('=== УСПЕШНЫЙ АДМИНСКИЙ ОТВЕТ ===');
      console.log('Raw response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));
      
      // axiosClient возвращает уже response.data, не полный response объект
      const responseData = response as LoginResponse;
      
      // ВАЖНО: Проверяем, что действительно есть токен (API возвращает accessToken)
      const responseToken = responseData.accessToken || responseData.token;
      
      if (!responseToken) {
        console.error('Admin login failed: No token in response');
        console.error('Response data:', responseData);
        throw new Error('Ошибка аутентификации: токен не получен');
      }
      
      // Для админского логина проверяем роль (если она есть в ответе)
      if (responseData.role && responseData.role !== 'ADMIN') {
        console.error('Admin login failed: User is not an admin');
        localStorage.removeItem('token');
        throw new Error('Ошибка доступа: пользователь не является администратором');
      }
      
      // Убедимся, что токен имеет префикс Bearer, если нет - добавим его
      const tokenToStore = responseToken.startsWith('Bearer ') 
        ? responseToken 
        : `Bearer ${responseToken}`;
      
      // Сохраняем токен в localStorage
      localStorage.setItem('token', tokenToStore);
      console.log('Admin token saved:', tokenToStore);
      
      // Проверка сохранения
      const savedToken = localStorage.getItem('token');
      console.log('Verification - saved token:', savedToken);
      
      return responseData;
    } catch (error: any) {
      console.log('=== ОШИБКА АДМИНСКОГО ЛОГИНА ===');
      console.error('Admin login error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack
      });
      localStorage.removeItem('token');
      throw error;
    }
  },

  // Выход из аккаунта (очистка токена)
  logout: () => {
    console.log('Logging out, removing token from localStorage');
    localStorage.removeItem('token');
  },

  // Проверка авторизации (наличие токена)
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    console.log('Authentication check:', token ? 'Token exists' : 'No token found');
    return !!token;
  },

  // Изменение пароля
  changePassword: async (data: ChangePasswordData): Promise<void> => {
    console.log('Changing password...');
    
    const response = await axiosClient.patch('/auth/change-password', {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword
    });
    
    console.log('Password changed successfully:', response);
    // Don't return response since return type is void
  }
};

export default authService; 