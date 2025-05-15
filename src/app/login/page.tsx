'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Link from 'next/link';
import Image from 'next/image';
import { EyeIcon, EyeSlashIcon, ArrowRightIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';
import authService, { LoginData } from '@/api/services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Используем React Query для мутации входа
  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (data) => {
      // После успешного входа перенаправляем на соответствующий дашборд
      if (data.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/merchant/dashboard');
      }
    },
    onError: (error: any) => {
      setError(error.message || 'Неверный email или пароль');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Выполняем запрос через React Query
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
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
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Добро пожаловать</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
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
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-900 placeholder-slate-400 transition-all"
                  placeholder="example@company.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-slate-900 placeholder-slate-400 transition-all"
                  placeholder="Введите пароль"
                  required
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
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-slate-600">
                  Запомнить меня
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline transition-colors">
                Забыли пароль?
              </a>
            </div>
            
            <Button
              type="submit"
              fullWidth
              isLoading={loginMutation.isPending}
              className="py-3 text-base font-medium rounded-lg bg-sky-600 hover:bg-sky-700"
            >
              <span>Войти</span>
              {!loginMutation.isPending && <ArrowRightIcon className="ml-2 h-5 w-5" />}
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-slate-600">
                Нет аккаунта?{' '}
                <Link href="/register" className="font-medium text-sky-600 hover:text-sky-700 hover:underline transition-colors">
                  Зарегистрируйтесь
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 