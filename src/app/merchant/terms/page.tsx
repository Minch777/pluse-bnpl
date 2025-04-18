'use client';

import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CreditCardIcon, BanknotesIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

type Term = {
  name: string;
  rate: string;
  description?: string;
  isEnabled?: boolean;
};

type Product = {
  type: 'Рассрочка' | 'Кредит';
  terms: Term[];
};

type Bank = {
  name: string;
  products: Product[];
  isComingSoon?: boolean;
  comingSoonDate?: string;
};

export default function Terms() {
  const [expandedBanks, setExpandedBanks] = useState<Record<string, boolean>>({
    'RBK Bank': true
  });

  const initialBanks: Bank[] = [
    {
      name: 'RBK Bank',
      products: [
        {
          type: 'Рассрочка',
          terms: [
            { 
              name: 'Рассрочка 0-0-3', 
              rate: '4%',
              description: '0% первый платёж, 0% ежемесячный платёж, 3 месяца',
              isEnabled: true
            },
            { 
              name: 'Рассрочка 0-0-6', 
              rate: '7%',
              description: '0% первый платёж, 0% ежемесячный платёж, 6 месяцев',
              isEnabled: true
            },
            { 
              name: 'Рассрочка 0-0-12', 
              rate: '14%',
              description: '0% первый платёж, 0% ежемесячный платёж, 12 месяцев',
              isEnabled: true
            },
            { 
              name: 'Рассрочка 0-0-24', 
              rate: '20%',
              description: '0% первый платёж, 0% ежемесячный платёж, 24 месяца',
              isEnabled: true
            },
          ]
        },
        {
          type: 'Кредит',
          terms: [
            { 
              name: 'Кредит 6 месяцев', 
              rate: '3%',
              description: 'Стандартный товарный кредит на 6 месяцев',
              isEnabled: true
            },
            { 
              name: 'Кредит 12 месяцев', 
              rate: '3%',
              description: 'Стандартный товарный кредит на 12 месяцев',
              isEnabled: true
            },
            { 
              name: 'Кредит 24 месяца', 
              rate: '3%',
              description: 'Стандартный товарный кредит на 24 месяца',
              isEnabled: true
            },
            { 
              name: 'Кредит 36 месяцев', 
              rate: '3%',
              description: 'Стандартный товарный кредит на 36 месяцев',
              isEnabled: true
            },
          ]
        }
      ]
    },
    {
      name: 'Halyk Bank',
      products: [],
      isComingSoon: true
    },
    {
      name: 'Freedom Bank',
      products: [],
      isComingSoon: true
    }
  ];

  const [banks, setBanks] = useState<Bank[]>(initialBanks);
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [successStates, setSuccessStates] = useState<Record<string, boolean>>({});
  const [changedProducts, setChangedProducts] = useState<Record<string, boolean>>({});

  // Check for changes in each product type
  useEffect(() => {
    const newChangedProducts: Record<string, boolean> = {};
    
    banks.forEach((bank, bankIndex) => {
      if (bank.isComingSoon) return;
      
      bank.products.forEach((product, productIndex) => {
        const initialProduct = initialBanks[bankIndex].products[productIndex];
        const hasChanged = JSON.stringify(product) !== JSON.stringify(initialProduct);
        const key = `${bankIndex}-${product.type}`;
        newChangedProducts[key] = hasChanged;
      });
    });

    setChangedProducts(newChangedProducts);
  }, [banks]);

  const getRateColor = (rate: string): string => {
    const rateNum = parseFloat(rate);
    if (rateNum <= 5) return 'bg-green-100 text-green-800';
    if (rateNum <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const toggleBank = (bankName: string) => {
    if (banks.find(b => b.name === bankName)?.isComingSoon) return;
    setExpandedBanks(prev => ({
      ...prev,
      [bankName]: !prev[bankName]
    }));
  };

  const toggleProductEnabled = (bankIndex: number, productIndex: number, termIndex: number) => {
    setBanks(prevBanks => {
      const newBanks = JSON.parse(JSON.stringify(prevBanks));
      newBanks[bankIndex].products[productIndex].terms[termIndex].isEnabled = 
        !newBanks[bankIndex].products[productIndex].terms[termIndex].isEnabled;
      return newBanks;
    });
  };

  const handleSaveProduct = async (bankIndex: number, productType: 'Рассрочка' | 'Кредит') => {
    const key = `${bankIndex}-${productType}`;
    if (!changedProducts[key]) return;

    setSavingStates(prev => ({ ...prev, [key]: true }));
    setSuccessStates(prev => ({ ...prev, [key]: false }));

    try {
      // TODO: Save changes to the backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSuccessStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setSuccessStates(prev => ({ ...prev, [key]: false }));
      }, 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setSavingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Условия банков</h1>
        <p className="mt-2 text-gray-600">
          Актуальные условия кредитования и рассрочки по банкам-партнерам
        </p>
      </div>

      <div className="space-y-6">
        {banks.map((bank, bankIndex) => (
          <div 
            key={bankIndex} 
            className={`bg-white rounded-lg shadow ${
              bank.isComingSoon ? 'opacity-75' : ''
            }`}
          >
            <button
              onClick={() => toggleBank(bank.name)}
              className={`w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 ${
                bank.isComingSoon ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-slate-900">{bank.name}</h2>
                {bank.isComingSoon && (
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    Скоро
                  </span>
                )}
              </div>
              {!bank.isComingSoon && (
                expandedBanks[bank.name] ? (
                  <ChevronUpIcon className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-slate-500" />
                )
              )}
            </button>
            
            {expandedBanks[bank.name] && !bank.isComingSoon && (
              <div className="p-6">
                <div className="space-y-8">
                  {bank.products.map((product, productIndex) => (
                    <div key={productIndex}>
                      <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded-lg">
                        {product.type === 'Рассрочка' ? (
                          <CreditCardIcon className="w-6 h-6 text-blue-500" />
                        ) : (
                          <BanknotesIcon className="w-6 h-6 text-green-500" />
                        )}
                        <h3 className="text-lg font-medium text-slate-900">
                          {product.type}
                        </h3>
                      </div>

                      <div className="overflow-x-auto">
                        {/* Desktop view */}
                        <table className="w-full text-left border-collapse hidden md:table">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="py-3 px-4 text-sm font-medium text-slate-600">Продукт</th>
                              <th className="py-3 px-4 text-sm font-medium text-slate-600">Ставка %</th>
                              <th className="py-3 px-4 text-sm font-medium text-slate-600">Статус</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.terms.map((term, termIndex) => (
                              <tr 
                                key={termIndex}
                                className={`border-b border-slate-200 last:border-0 ${
                                  !term.isEnabled ? 'opacity-50' : ''
                                }`}
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700">
                                      {term.name}
                                    </span>
                                    {term.description && (
                                      <div className="group relative">
                                        <InformationCircleIcon className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                          {term.description}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`inline-flex px-2 py-1 text-sm rounded-full ${getRateColor(term.rate)}`}>
                                    {term.rate}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => toggleProductEnabled(bankIndex, productIndex, termIndex)}
                                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                      style={{
                                        backgroundColor: term.isEnabled ? '#3B82F6' : '#D1D5DB'
                                      }}
                                    >
                                      <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                          term.isEnabled ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                      />
                                    </button>
                                    <div className="group relative">
                                      <InformationCircleIcon className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                                      <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        Отключённые продукты не видны клиентам
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Mobile view */}
                        <div className="md:hidden space-y-4">
                          {product.terms.map((term, termIndex) => (
                            <div 
                              key={termIndex}
                              className={`bg-slate-50 rounded-lg p-4 ${
                                !term.isEnabled ? 'opacity-50' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700">
                                    {term.name}
                                  </span>
                                  {term.description && (
                                    <div className="group relative">
                                      <InformationCircleIcon className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        {term.description}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <span className={`inline-flex px-2 py-1 text-sm rounded-full ${getRateColor(term.rate)}`}>
                                  {term.rate}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  type="button"
                                  onClick={() => toggleProductEnabled(bankIndex, productIndex, termIndex)}
                                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                  style={{
                                    backgroundColor: term.isEnabled ? '#3B82F6' : '#D1D5DB'
                                  }}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                      term.isEnabled ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                                <div className="group relative">
                                  <InformationCircleIcon className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                                  <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    Отключённые продукты не видны клиентам
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Save button for each product type */}
                      {changedProducts[`${bankIndex}-${product.type}`] && (
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => handleSaveProduct(bankIndex, product.type)}
                            disabled={savingStates[`${bankIndex}-${product.type}`]}
                            className="px-4 py-2.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed min-w-[160px]"
                          >
                            {savingStates[`${bankIndex}-${product.type}`]
                              ? 'Сохранение...'
                              : successStates[`${bankIndex}-${product.type}`]
                              ? 'Изменения сохранены'
                              : 'Сохранить изменения'
                            }
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 