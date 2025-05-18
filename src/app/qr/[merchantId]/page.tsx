'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, QuestionMarkCircleIcon, ChevronLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

type Bank = {
  id: string;
  name: string;
  logo: string;
  terms: {
    type: string;
    name: string;
    rate: string;
    months: number;
  }[];
  borderColor: string;
  bgColor: string;
  urlPrefix: string;
};

export default function QRPage({ params }: { params: { merchantId: string } }) {
  const [merchant, setMerchant] = useState<{ id: string; name: string; logo: string } | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const banks: Bank[] = [
    {
      id: 'rbk',
      name: 'RBK Bank',
      logo: '/rbk-logo.png',
      borderColor: 'border-sky-600',
      bgColor: 'bg-sky-50',
      urlPrefix: 'https://rbk.kz/installment/',
      terms: [
        { type: 'Рассрочка', name: '3 месяца', rate: '0%', months: 3 },
        { type: 'Рассрочка', name: '6 месяцев', rate: '0%', months: 6 },
        { type: 'Рассрочка', name: '12 месяцев', rate: '0%', months: 12 },
      ]
    },
    {
      id: 'kaspi',
      name: 'Kaspi Bank',
      logo: '/kaspi-logo.png',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50',
      urlPrefix: 'https://kaspi.kz/shop/credit/',
      terms: [
        { type: 'Рассрочка', name: '3 месяца', rate: '0%', months: 3 },
        { type: 'Рассрочка', name: '6 месяцев', rate: '0%', months: 6 },
      ]
    },
    {
      id: 'halyk',
      name: 'Halyk Bank',
      logo: '/halyk-logo.png',
      borderColor: 'border-green-600',
      bgColor: 'bg-green-50',
      urlPrefix: 'https://halykbank.kz/credit/',
      terms: [
        { type: 'Рассрочка', name: '3 месяца', rate: '0%', months: 3 },
        { type: 'Рассрочка', name: '6 месяцев', rate: '0%', months: 6 },
        { type: 'Рассрочка', name: '12 месяцев', rate: '0%', months: 12 },
      ]
    }
  ];

  // Simulate fetching merchant data
  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        // In a real app, this would be an API call
        // For now we'll simulate with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setMerchant({
          id: params.merchantId,
          name: 'Техно Плюс',
          logo: '/pluse-logo.png',
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching merchant:', error);
        setIsLoading(false);
      }
    };

    fetchMerchant();
  }, [params.merchantId]);

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
    setSelectedTerm(null);
  };

  const handleTermSelect = (term: string) => {
    setSelectedTerm(term);
  };

  const handleProceed = () => {
    // In a real app, this would redirect to the bank's website
    // For now, we'll just simulate success
    setIsSuccess(true);
  };

  const resetSelection = () => {
    setSelectedBank(null);
    setSelectedTerm(null);
    setIsSuccess(false);
  };

  const getSelectedBank = () => {
    return banks.find(b => b.id === selectedBank);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-sky-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Оформление начато</h2>
              <p className="text-gray-600 mb-6">
                Вы будете перенаправлены на страницу банка для завершения оформления рассрочки
              </p>
              <button
                onClick={resetSelection}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors"
              >
                Вернуться к выбору
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {selectedBank ? (
                <button 
                  onClick={resetSelection}
                  className="mr-2 p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
              ) : null}
              <Image
                src="/pluse-logo.png"
                alt="Pluse"
                width={100}
                height={28}
                className="w-auto h-6"
              />
            </div>
            
            <Link 
              href="#"
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <QuestionMarkCircleIcon className="w-5 h-5 mr-1" />
              <span>Помощь</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-grow">
        {/* Merchant Info */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Выберите способ оплаты в рассрочку
          </h1>
          <p className="text-gray-600">
            для магазина <span className="font-medium">{merchant?.name}</span>
          </p>
        </div>

        {/* Step Indicator */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center">
            <div className={`flex-1 h-1 ${selectedBank ? 'bg-sky-200' : 'bg-sky-500'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              selectedBank ? 'bg-sky-200 text-sky-800' : 'bg-sky-500 text-white'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 ${selectedTerm ? 'bg-sky-500' : 'bg-sky-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              selectedTerm ? 'bg-sky-500 text-white' : 'bg-sky-200 text-sky-800'
            }`}>
              2
            </div>
            <div className="flex-1 h-1 bg-sky-200"></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span className={selectedBank ? 'text-gray-400' : 'font-medium text-gray-900'}>Выбор банка</span>
            <span className={selectedTerm ? 'font-medium text-gray-900' : ''}>Условия</span>
            <span>Оформление</span>
          </div>
        </div>

        {/* Bank Selection */}
        {!selectedBank && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Выберите банк</h2>
                <div className="space-y-3">
                  {banks.map((bank) => (
                    <button
                      key={bank.id}
                      className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                      onClick={() => handleBankSelect(bank.id)}
                    >
                      <div className="w-20 h-10 flex-shrink-0 flex items-center">
                        <Image 
                          src={bank.logo} 
                          alt={bank.name} 
                          width={100}
                          height={40}
                          className="w-full h-auto object-contain" 
                        />
                      </div>
                      <div className="ml-4 flex-1 text-left">
                        <h3 className="font-medium text-gray-900">{bank.name}</h3>
                        <p className="text-sm text-gray-500">
                          до {Math.max(...bank.terms.map(t => t.months))} месяцев рассрочки
                        </p>
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Terms Selection */}
        {selectedBank && !selectedTerm && getSelectedBank() && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-20 h-10 flex-shrink-0 flex items-center">
                    <Image 
                      src={getSelectedBank()?.logo || ''} 
                      alt={getSelectedBank()?.name || ''} 
                      width={100}
                      height={40}
                      className="w-full h-auto object-contain" 
                    />
                  </div>
                  <h2 className="ml-4 text-lg font-semibold text-gray-900">Выберите условия</h2>
                </div>
                
                <div className="space-y-3">
                  {getSelectedBank()?.terms.map((term) => (
                    <button
                      key={term.name}
                      className={`w-full flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-all ${
                        selectedTerm === term.name 
                          ? `${getSelectedBank()?.borderColor} ${getSelectedBank()?.bgColor}`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleTermSelect(term.name)}
                    >
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-gray-900">{term.name}</h3>
                        <p className="text-sm text-gray-500">
                          Ставка: {term.rate}
                        </p>
                      </div>
                      <div className="ml-4 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                        {selectedTerm === term.name && (
                          <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleProceed}
                  disabled={!selectedTerm}
                  className={`mt-6 w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    selectedTerm 
                      ? 'bg-sky-600 hover:bg-sky-700 text-white' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Перейти к оформлению
                </button>
              </div>
            </div>
          </div>
        )}

        {/* After Term Selection - Button to proceed */}
        {selectedBank && selectedTerm && getSelectedBank() && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-20 h-10 flex-shrink-0 flex items-center">
                    <Image 
                      src={getSelectedBank()?.logo || ''} 
                      alt={getSelectedBank()?.name || ''} 
                      width={100}
                      height={40}
                      className="w-full h-auto object-contain" 
                    />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">{selectedTerm}</h2>
                    <p className="text-sm text-gray-500">
                      Ставка: {getSelectedBank()?.terms.find(t => t.name === selectedTerm)?.rate}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800 mb-6">
                  <p>После нажатия кнопки вы будете перенаправлены на сайт банка для завершения оформления.</p>
                </div>
                
                <button
                  onClick={handleProceed}
                  className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>Перейти к оформлению</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © 2023 Pluse. Все права защищены.
            </div>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Условия использования
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Политика конфиденциальности
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Помощь
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 