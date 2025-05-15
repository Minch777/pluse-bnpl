'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/Button';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';

type ProductType = 'credit' | 'installment';
type Bank = 'kaspi' | 'halyk';

export default function ApplicationForm() {
  const router = useRouter();
  const params = useParams();
  const merchantSlug = params.slug;
  
  // Use merchantName from context or fallback to default
  const merchantName = "Ваш магазин"; // TODO: Replace with actual merchant name from API/context
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1 - Product
    productType: 'installment' as ProductType,
    term: '3',
    amount: '',
    preferredPaymentDate: '',
    
    // Step 2 - Client
    lastName: '',
    firstName: '',
    patronymic: '',
    iin: '',
    phone: '',
    monthlyIncome: '',
    bankStatement: 'kaspi' as Bank,
    agreement: false,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const validateStep1 = () => {
    return formData.amount && formData.term && formData.preferredPaymentDate;
  };

  const validateStep2 = () => {
    return (
      formData.lastName &&
      formData.firstName &&
      formData.iin &&
      formData.phone &&
      formData.monthlyIncome &&
      formData.agreement
    );
  };
  
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/success');
    } catch (error) {
      console.error('Error submitting application', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-[560px]">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-sky-50 rounded-full flex items-center justify-center">
              <BuildingStorefrontIcon className="h-6 w-6 text-sky-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Рассрочка от {merchantName}
          </h1>
          <p className="text-lg text-gray-600">
            Подача заявки займёт не больше 2 минут
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                    Шаг 1 из 2
                  </span>
                  <h2 className="text-xl font-semibold text-gray-900 mt-2">Выберите параметры рассрочки</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Тип продукта *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, productType: 'credit' }))}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        formData.productType === 'credit'
                          ? 'bg-sky-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      Кредитование
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, productType: 'installment' }))}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        formData.productType === 'installment'
                          ? 'bg-sky-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      Рассрочка
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Срок рассрочки (в месяцах) *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['3', '6', '12', '24'].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, term }))}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          formData.term === term
                            ? 'bg-sky-600 text-white'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Сумма рассрочки *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Введите сумму"
                    className="w-full px-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Предпочтительная дата платежа *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="preferredPaymentDate"
                    value={formData.preferredPaymentDate}
                    onChange={handleChange}
                    min="1"
                    max="28"
                    placeholder="Например, 10"
                    className="w-full px-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-sky-100">
                  <div className="flex items-start">
                    <BuildingStorefrontIcon className="h-5 w-5 text-sky-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700">
                        Вы оформляете заявку для «{merchantName}».
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        Он получит уведомление сразу после отправки.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                    Шаг 2 из 2
                  </span>
                  <h2 className="text-xl font-semibold text-gray-900 mt-2">Данные клиента</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Фамилия *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full min-h-[44px] px-3 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Имя *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full min-h-[44px] px-3 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Отчество
                    </label>
                    <input
                      type="text"
                      name="patronymic"
                      value={formData.patronymic}
                      onChange={handleChange}
                      className="w-full min-h-[44px] px-3 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ИИН *
                  </label>
                  <input
                    type="text"
                    name="iin"
                    value={formData.iin}
                    onChange={handleChange}
                    maxLength={12}
                    placeholder="12 цифр"
                    className="w-full min-h-[44px] px-3 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                    required
                  />
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Номер телефона *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 XXX XXX XX XX"
                    className="w-full min-h-[44px] px-3 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                    required
                  />
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Зарплата в месяц *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    placeholder="Введите сумму"
                    className="w-full min-h-[44px] px-3 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Банковская выписка клиента
                  </label>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, bankStatement: 'kaspi' }))}
                      className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.bankStatement === 'kaspi'
                          ? 'bg-sky-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      Kaspi
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, bankStatement: 'halyk' }))}
                      className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.bankStatement === 'halyk'
                          ? 'bg-sky-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      Halyk
                    </button>
                  </div>
                  {formData.iin ? (
                    <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        className="hidden"
                        id="bankStatement"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="bankStatement"
                        className="cursor-pointer text-sky-600 hover:text-sky-800"
                      >
                        Загрузить выписку
                      </label>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mt-3">
                      Чтобы загрузить выписку, заполните поле ИИН
                    </p>
                  )}
                </div>

                <div className="flex items-start mt-10">
                  <div className="flex items-center h-6">
                    <input
                      id="agreement"
                      name="agreement"
                      type="checkbox"
                      checked={formData.agreement}
                      onChange={handleChange}
                      className="h-5 w-5 text-sky-600 rounded border-2 border-gray-400 focus:ring-sky-500"
                      required
                    />
                  </div>
                  <label htmlFor="agreement" className="ml-3 block text-sm text-gray-600">
                    Я соглашаюсь с <a href="#" className="text-sky-600 hover:underline">условиями предоставления рассрочки</a> и даю согласие на обработку моих персональных данных
                  </label>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4">
              {step === 2 && (
                <button 
                  type="submit"
                  disabled={isSubmitting || !validateStep2()}
                  className={`w-full h-[52px] px-5 py-3 rounded-lg font-medium text-white bg-sky-600 hover:bg-sky-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none ${isSubmitting ? 'cursor-wait' : ''}`}
                >
                  {isSubmitting && (
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  Отправить заявку на рассмотрение
                </button>
              )}
              
              {step === 2 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  ← Вернуться назад
                </button>
              )}
              
              {step === 1 && (
                <button 
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep1()}
                  className="w-full h-[52px] px-5 py-3 rounded-lg font-medium text-white bg-sky-600 hover:bg-sky-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none group"
                >
                  <span>Перейти к заполнению данных клиента</span>
                  <span className="inline-block ml-2 group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 