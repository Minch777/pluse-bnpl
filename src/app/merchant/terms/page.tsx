'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  CreditCardIcon, 
  BanknotesIcon, 
  InformationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { ChartBarIcon } from '@heroicons/react/24/solid';
import QRBenefitsModal from '@/components/QRBenefitsModal';
import { useRouter, useSearchParams } from 'next/navigation';

// Добавляем современную цветовую схему
const colors = {
  primary: '#0891B2', // teal-600
  primaryDark: '#0E7490', // teal-700
  primaryLight: '#E0F2FE', // sky-100
  secondary: '#0EA5E9', // sky-500
  secondaryDark: '#0284C7', // sky-600
  gradient: {
    from: '#0EA5E9', // sky-500
    to: '#0891B2', // teal-600
  },
  success: '#10B981', // emerald-500
  error: '#EF4444', // red-500
  neutral: '#F1F5F9', // slate-100
};

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
  const [activeTab, setActiveTab] = useState<'active' | 'add'>('active');
  const [showQRBenefits, setShowQRBenefits] = useState(false);
  const [newBank, setNewBank] = useState('Kaspi Bank');
  const [newBankUrl, setNewBankUrl] = useState('');
  const [customBanks, setCustomBanks] = useState<{name: string, url: string}[]>([]);
  const bankOptions = [
    'Kaspi Bank',
    'Halyk Bank',
    'Home Credit',
    'Freedom Bank',
    'БЦК',
    'Евразийский',
    'Jusan',
    'Другой'
  ];

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
              isEnabled: true
            },
            { 
              name: 'Рассрочка 0-0-6', 
              rate: '7%',
              isEnabled: true
            },
            { 
              name: 'Рассрочка 0-0-12', 
              rate: '14%',
              isEnabled: true
            },
            { 
              name: 'Рассрочка 0-0-24', 
              rate: '20%',
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
      isComingSoon: true,
      comingSoonDate: 'Июнь 2024'
    },
    {
      name: 'Freedom Bank',
      products: [],
      isComingSoon: true,
      comingSoonDate: 'Сентябрь 2024'
    }
  ];

  const [banks, setBanks] = useState<Bank[]>(initialBanks);
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [successStates, setSuccessStates] = useState<Record<string, boolean>>({});
  const [changedProducts, setChangedProducts] = useState<Record<string, boolean>>({});
  const [addSuccess, setAddSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get('show_qr_benefits') === 'true') {
      // Если переход с другой страницы, показываем попап с задержкой
      const delay = window.history.length > 1 ? 300 : 0;
      setTimeout(() => setShowQRBenefits(true), delay);
      // Удалить параметр из URL после показа попапа
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams]);

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
    if (rateNum <= 5) return 'bg-green-50 text-green-700 border border-green-200';
    if (rateNum <= 10) return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    return 'bg-red-50 text-red-700 border border-red-200';
  };

  const getRateText = (rate: string): string => {
    const rateNum = parseFloat(rate);
    if (rateNum <= 5) return 'Низкая';
    if (rateNum <= 12) return 'Средняя';
    return 'Высокая';
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

  const activeBanks = banks.filter(bank => !bank.isComingSoon);
  const upcomingBanks = banks.filter(bank => bank.isComingSoon);

  const handleAddBank = () => {
    if (!newBankUrl) return;
    setCustomBanks(prev => [...prev, { name: newBank, url: newBankUrl }]);
    setNewBank('Kaspi Bank');
    setNewBankUrl('');
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 2000);
  };

  const handleRemoveBank = (idx: number) => {
    setCustomBanks(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <QRBenefitsModal isOpen={showQRBenefits} onClose={() => setShowQRBenefits(false)} />
      {/* Simplified header */}
      <header className="pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Мои условия</h1>
        <p className="text-lg text-gray-600">
          Управляйте доступными вариантами рассрочки и кредита для ваших клиентов
        </p>
      </header>
      {/* Табы */}
      <div className="flex mb-8 bg-slate-50 rounded-lg p-1 max-w-fit">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'active' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Активные
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'add' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Добавить банк
        </button>
      </div>
      {/* Информационный блок только для вкладки 'Добавить банк' */}
      {activeTab === 'add' && (
        <div className="flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-lg p-4 mb-8 max-w-2xl">
          <InformationCircleIcon className="h-6 w-6 text-sky-500 mt-0.5" />
          <div className="text-gray-700 text-sm">
            Вы можете добавить любой банк самостоятельно — для этого просто вставьте ссылку на оформление рассрочки от выбранного банка. Ваши клиенты смогут выбрать наиболее удобный для себя вариант.
          </div>
        </div>
      )}
      {/* Контент вкладок */}
      {activeTab === 'add' && (
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-xl">
            <div className="flex items-center gap-3 mb-2">
              <BanknotesIcon className="h-7 w-7 text-sky-600" />
              <h2 className="text-2xl font-bold text-gray-900">Добавить банк</h2>
            </div>
            <p className="text-gray-600 mb-6 text-sm">Добавьте ссылку на оформление рассрочки от любого банка, чтобы ваши клиенты могли выбрать удобный вариант.</p>
            <div className="flex flex-col gap-4 mb-4">
              <label className="text-sm font-medium text-gray-700">Выберите банк</label>
              <select
                value={newBank}
                onChange={e => setNewBank(e.target.value)}
                className="w-full py-2 px-3 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              >
                {bankOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <label className="text-sm font-medium text-gray-700 mt-2">Ссылка на оформление рассрочки</label>
              <input
                type="text"
                value={newBankUrl}
                onChange={e => setNewBankUrl(e.target.value)}
                className="w-full py-2 px-3 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                placeholder="https://..."
              />
              <button
                onClick={handleAddBank}
                className="w-full px-5 py-2 rounded-lg text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 transition-colors mt-2"
                disabled={!newBankUrl}
              >
                Добавить банк
              </button>
              {addSuccess && <div className="text-green-600 text-sm mt-2">Банк добавлен!</div>}
            </div>
          </div>
          {/* Список добавленных банков */}
          {customBanks.length > 0 && (
            <div className="grid gap-4 mt-8">
              {customBanks.map((bank, idx) => (
                <div key={idx} className="flex items-center justify-between bg-sky-50 border border-sky-100 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <BanknotesIcon className="h-5 w-5 text-sky-500" />
                    <div>
                      <div className="font-medium text-gray-900">{bank.name}</div>
                      <a href={bank.url} target="_blank" rel="noopener noreferrer" className="text-sky-600 underline break-all text-sm">{bank.url}</a>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveBank(idx)} className="text-red-500 hover:text-red-700 text-xs font-medium ml-4">Удалить</button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      {activeTab === 'active' && (
        <section>
          <div className="space-y-8">
            {banks.filter(bank => !bank.isComingSoon).map((bank, bankIndex) => (
              <div 
                key={bankIndex} 
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="px-6 py-5 flex items-center justify-between border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-4">
                    {bank.name === 'RBK Bank' ? (
                      <img 
                        src="/rbk-logo.png" 
                        alt="RBK Bank" 
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                        <BuildingLibraryIcon className="w-6 h-6 text-sky-600" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-medium text-slate-800">{bank.name}</h2>
                      <p className="text-sm text-slate-500">Управление продуктами и ставками</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBank(bank.name)}
                    className="p-2 rounded-full hover:bg-slate-100"
                  >
                    {expandedBanks[bank.name] ? (
                      <ChevronUpIcon className="w-5 h-5 text-slate-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-slate-500" />
                    )}
                  </button>
                </div>
              
                {expandedBanks[bank.name] && (
                  <div className="p-6">
                    <div className="space-y-8">
                      {bank.products.map((product, productIndex) => (
                        <div key={productIndex} className="relative">
                          <div className="flex items-center gap-3 mb-5">
                            <div className={`p-2 rounded-lg ${
                              product.type === 'Рассрочка' 
                                ? 'bg-sky-50' 
                                : 'bg-blue-50'
                            }`}>
                              {product.type === 'Рассрочка' ? (
                                <CreditCardIcon className="w-6 h-6 text-sky-600" />
                              ) : (
                                <BanknotesIcon className="w-6 h-6 text-blue-600" />
                              )}
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {product.type}
                            </h3>
                            <span className="text-sm text-gray-500">
                              ({product.terms.filter(t => t.isEnabled).length} из {product.terms.length} активны)
                            </span>
                          </div>

                          {/* Таблица вместо карточек */}
                          <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    СРОК
                                  </th>
                                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    КОМИССИЯ
                                  </th>
                                  <th scope="col" className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                    СТАТУС
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {product.terms.map((term, termIndex) => (
                                  <tr key={termIndex} className={`${!term.isEnabled ? 'bg-gray-50' : ''} hover:bg-gray-50 transition-colors`}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {term.name}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      {term.rate}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                      <label className="relative inline-flex items-center justify-center cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          checked={term.isEnabled} 
                                          onChange={() => toggleProductEnabled(bankIndex, productIndex, termIndex)}
                                          className="sr-only peer"
                                        />
                                        <div 
                                          className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full 
                                            peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                                            after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                                            after:transition-all peer-checked:bg-sky-600"
                                        ></div>
                                      </label>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Save button for each product type */}
                          {changedProducts[`${bankIndex}-${product.type}`] && (
                            <div className="mt-6 flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleSaveProduct(bankIndex, product.type)}
                                disabled={savingStates[`${bankIndex}-${product.type}`]}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 
                                  transition-colors duration-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed 
                                  flex items-center gap-2"
                              >
                                {savingStates[`${bankIndex}-${product.type}`] && (
                                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                )}
                                {successStates[`${bankIndex}-${product.type}`] && (
                                  <CheckCircleIcon className="w-4 h-4" />
                                )}
                                {savingStates[`${bankIndex}-${product.type}`]
                                  ? 'Сохранение...'
                                  : successStates[`${bankIndex}-${product.type}`]
                                  ? 'Изменения сохранены'
                                  : 'Сохранить изменения'
                                }
                              </button>
                                  
                              {successStates[`${bankIndex}-${product.type}`] && (
                                <span className="text-sm text-green-600">Успешно сохранено!</span>
                              )}
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
        </section>
      )}
    </div>
  );
} 
