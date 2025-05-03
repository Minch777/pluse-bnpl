'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function NewApplication() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    iin: '',
    phone: '',
    amount: '',
    purpose: '',
    email: '',
    address: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to applications page
      router.push('/merchant/applications');
    } catch (error) {
      console.error('Error submitting application', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Новая заявка</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Заполните форму для создания новой заявки на рассрочку
        </p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                ФИО клиента *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="iin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                ИИН клиента *
              </label>
              <input
                id="iin"
                name="iin"
                type="text"
                value={formData.iin}
                onChange={handleChange}
                placeholder="12 цифр"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                maxLength={12}
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Телефон *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+7 (XXX) XXX-XXXX"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Сумма рассрочки (₸) *
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                min="5000"
                max="500000"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Цель рассрочки *
              </label>
              <select
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              >
                <option value="">Выберите цель</option>
                <option value="electronics">Электроника</option>
                <option value="furniture">Мебель</option>
                <option value="clothes">Одежда</option>
                <option value="services">Услуги</option>
                <option value="other">Другое</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Адрес
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
            >
              Отмена
            </Button>
            <Button 
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Отправить заявку
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 