'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Button from '@/components/Button';
import { useMutation } from '@tanstack/react-query';
import { authService, RegisterData } from '@/api/services/authService';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    bin: '', // Бизнес идентификационный номер
    directorName: '',
    website: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Используем React Query для мутации регистрации
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      console.log('Registration successful, response:', data);
      
      // Проверяем структуру ответа (может быть data.data или data напрямую)
      const responseData = data.data || data;
      
      console.log('Processing registration response:', {
        hasData: !!data.data,
        responseData: responseData,
        hasToken: !!(responseData.token || responseData.accessToken),
      });
      
      // Сохраняем токен, если он есть в ответе
      const responseToken = responseData.token || responseData.accessToken;
      
      if (responseToken) {
        // Убедимся, что токен имеет префикс Bearer, если нет - добавим его
        const tokenToStore = responseToken.startsWith('Bearer ') 
          ? responseToken 
          : `Bearer ${responseToken}`;
        
        localStorage.setItem('token', tokenToStore);
        console.log('Registration: Token saved to localStorage:', tokenToStore.slice(0, 20) + '...');
        
        // Проверка сохранения
        const savedToken = localStorage.getItem('token');
        console.log('Registration: Verification - token from localStorage:', savedToken ? `${savedToken.slice(0, 20)}...` : 'No token found');
        
        // Даём время для сохранения токена, затем редиректим
        setTimeout(() => {
          console.log('Registration: Redirecting to merchant dashboard...');
          // Используем replace чтобы не оставлять регистрацию в истории
          router.replace('/merchant/dashboard');
        }, 100);
      } else {
        console.warn('Registration successful but no token received from server');
        // Если токена нет, остаёмся на странице регистрации и показываем ошибку
        setServerError('Регистрация прошла успешно, но токен не получен. Попробуйте войти в систему.');
      }
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      
      // Используем сообщение об ошибке, которое уже обработал axiosClient
      const errorMessage = error.message || 'Произошла ошибка при регистрации';
      setServerError(errorMessage);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Очищаем серверную ошибку при любых изменениях
    if (serverError) {
      setServerError(null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) newErrors.companyName = 'Введите название компании';
    if (!formData.directorName.trim()) newErrors.directorName = 'Введите ФИО руководителя';
    if (!formData.email.trim()) newErrors.email = 'Введите email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Введите корректный email';
    if (!formData.phone.trim()) newErrors.phone = 'Введите номер телефона';
    if (!formData.password) newErrors.password = 'Введите пароль';
    else if (formData.password.length < 8) newErrors.password = 'Пароль должен быть не менее 8 символов';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    if (!formData.address.trim()) newErrors.address = 'Введите адрес';
    if (!formData.bin.trim()) newErrors.bin = 'Введите БИН';
    else if (formData.bin.length !== 12) newErrors.bin = 'БИН должен содержать 12 цифр';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Необходимо согласие с условиями';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Готовим данные для API
    const apiData: RegisterData = {
      email: formData.email,
      password: formData.password,
      companyName: formData.companyName,
      bin: formData.bin,
      phoneNumber: formData.phone,
      address: formData.address,
      directorName: formData.directorName,
      website: formData.website
    };
      
    // Выполняем запрос через React Query
    registerMutation.mutate(apiData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/pluse-logo.png"
              alt="Pluse BNPL"
              width={140}
              height={40}
              className="mx-auto"
            />
          </Link>
          <p className="mt-2 text-slate-500">
            Сервис рассрочки для предпринимателей
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Регистрация бизнеса
            </h1>
            <p className="text-slate-500">
              Заполните форму для подключения к сервису Pluse BNPL
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Название компании
                </label>
                <div className="relative">
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                    className={`w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-900 placeholder-slate-400 transition-all ${errors.companyName ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="ТОО Example"
                />
                </div>
                {errors.companyName && <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  БИН
                </label>
                <div className="relative">
                <input
                  type="text"
                  name="bin"
                  value={formData.bin}
                  onChange={handleChange}
                    className={`w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-900 placeholder-slate-400 transition-all ${errors.bin ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="12 цифр"
                  maxLength={12}
                />
                </div>
                {errors.bin && <p className="mt-1 text-sm text-red-500">{errors.bin}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                    className={`w-full pl-10 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-900 placeholder-slate-400 transition-all ${errors.email ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="example@company.kz"
                />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Телефон
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                    className={`w-full pl-10 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-900 placeholder-slate-400 transition-all ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="+7 (777) 123-45-67"
                />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                <input
                    type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-900 placeholder-slate-400 transition-all ${errors.password ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="Минимум 8 символов"
                />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Подтверждение пароля
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                <input
                    type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-900 placeholder-slate-400 transition-all ${errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="Повторите пароль"
                />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ФИО руководителя
                </label>
                <div className="relative">
                <input
                  type="text"
                  name="directorName"
                  value={formData.directorName}
                  onChange={handleChange}
                    className={`w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-900 placeholder-slate-400 transition-all ${errors.directorName ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="Иванов Иван Иванович"
                />
                </div>
                {errors.directorName && <p className="mt-1 text-sm text-red-500">{errors.directorName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Сайт
                </label>
                <div className="relative">
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                    className={`w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-900 placeholder-slate-400 transition-all ${errors.website ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  placeholder="https://example.com"
                />
                </div>
                {errors.website && <p className="mt-1 text-sm text-red-500">{errors.website}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Адрес
              </label>
              <div className="relative">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                  className={`w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-900 placeholder-slate-400 transition-all ${errors.address ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                placeholder="Улица, дом, офис"
              />
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>

            <div className="flex items-start mt-6">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 border border-slate-300 rounded bg-slate-50 focus:ring-3 focus:ring-sky-500 text-sky-600"
                />
              </div>
              <div className="ml-3">
                <label className="text-sm text-slate-600">
                  Я согласен с <Link href="/terms" className="font-medium text-sky-600 hover:text-sky-700 hover:underline transition-colors">условиями использования</Link> и <Link href="/privacy" className="font-medium text-sky-600 hover:text-sky-700 hover:underline transition-colors">политикой конфиденциальности</Link>
                </label>
                {errors.agreeToTerms && <p className="mt-1 text-sm text-red-500">{errors.agreeToTerms}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link href="/login" className="text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline transition-colors">
                Уже есть аккаунт? Войти
              </Link>
              <Button
                type="submit"
                fullWidth={false}
                isLoading={registerMutation.isPending}
                className="px-8 py-3 text-base font-medium rounded-lg bg-sky-600 hover:bg-sky-700"
              >
                {registerMutation.isPending ? 'Регистрация...' : 'Зарегистрироваться'}
                {!registerMutation.isPending && <CheckCircleIcon className="ml-2 h-5 w-5" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 