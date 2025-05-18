'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BanknotesIcon,
  CheckIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import QRBenefitsModal from '@/components/QRBenefitsModal';
import BankConnectionModal from '@/components/BankConnectionModal';
import Modal from '@/components/Modal';
import { SidebarContext } from '@/app/merchant/layout';

// Добавляем современную цветовую схему
const colors = {
  primary: '#0891B2',
  primaryLight: '#E0F2FE',
  secondary: '#0EA5E9',
  gradient: {
    from: '#0EA5E9',
    to: '#0891B2',
  }
};

type Bank = {
  id: string;
  name: string;
  logo: string;
  integrationType: 'integrated' | 'manual';
  status: 'active' | 'pending' | 'coming_soon';
  terms?: {
    type: string;
    name: string;
    rate: string;
  }[];
  comingSoonDate?: string;
  manualUrl?: string;
};

export default function Terms() {
  const [expandedBanks, setExpandedBanks] = useState<Record<string, boolean>>({
    'rbk': true
  });
  const [showQRBenefits, setShowQRBenefits] = useState(false);
  const [showIntegrationInfo, setShowIntegrationInfo] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isPageReady, setIsPageReady] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMobile, sidebarVisible, toggleMobileSidebar } = useContext(SidebarContext);

  const banks: Bank[] = [
    {
      id: 'rbk',
      name: 'RBK Bank',
      logo: '/rbk-logo.png',
      integrationType: 'integrated',
      status: 'active',
      terms: [
        { type: 'Рассрочка', name: 'Рассрочка 0-0-3', rate: '4%' },
        { type: 'Рассрочка', name: 'Рассрочка 0-0-6', rate: '7%' },
        { type: 'Рассрочка', name: 'Рассрочка 0-0-12', rate: '14%' },
        { type: 'Кредит', name: 'Кредит 6 месяцев', rate: '3%' },
        { type: 'Кредит', name: 'Кредит 12 месяцев', rate: '3%' },
      ]
    },
    {
      id: 'kaspi',
      name: 'Kaspi Bank',
      logo: '/kaspi-logo.png',
      integrationType: 'manual',
      status: 'active',
      manualUrl: 'https://kaspi.kz/merchant',
      terms: [
        { type: 'Рассрочка', name: 'Рассрочка 3 месяца', rate: '3%' },
        { type: 'Рассрочка', name: 'Рассрочка 6 месяцев', rate: '6%' },
      ]
    },
    {
      id: 'halyk',
      name: 'Halyk Bank',
      logo: '/halyk-logo.png',
      integrationType: 'manual',
      status: 'active',
      manualUrl: 'https://halykbank.kz/merchant',
      terms: [
        { type: 'Рассрочка', name: 'Рассрочка 3 месяца', rate: '4%' },
        { type: 'Рассрочка', name: 'Рассрочка 6 месяцев', rate: '7%' },
        { type: 'Рассрочка', name: 'Рассрочка 12 месяцев', rate: '12%' },
      ]
    }
  ];

  // Эффект для установки готовности страницы
  useEffect(() => {
    setIsPageReady(true);
  }, []);

  // Слушатель события для открытия модального окна
  useEffect(() => {
    const handleShowBankConnect = (event: CustomEvent<{ bankId: string }>) => {
      const bank = banks.find(b => b.id === event.detail.bankId);
      if (bank) {
        setSelectedBank(bank);
      }
    };

    window.addEventListener('showBankConnect', handleShowBankConnect as EventListener);
    return () => {
      window.removeEventListener('showBankConnect', handleShowBankConnect as EventListener);
    };
  }, [banks]);

  useEffect(() => {
    if (!isPageReady) return;

    // Get all URL parameters at once to avoid multiple accesses
    const showQRBenefits = searchParams?.get('show_qr_benefits') === 'true';
    const showAllBanks = searchParams?.get('show_all_banks') === 'true';
    const bankToConnect = searchParams?.get('show_connect_bank');

    // Handle QR benefits
    if (showQRBenefits) {
      // Устанавливаем с небольшой задержкой, чтобы страница полностью отрендерилась
      setTimeout(() => {
        setShowQRBenefits(true);
      }, 100);
      router.replace('/merchant/terms');
    }

    // Handle showing all banks
    if (showAllBanks) {
      setExpandedBanks(banks.reduce((acc, bank) => ({
        ...acc,
        [bank.id]: true
      }), {}));
      router.replace('/merchant/terms');
    }
    
    // Handle connecting specific bank
    if (bankToConnect) {
      const bank = banks.find(b => b.id === bankToConnect);
      if (bank) {
        // Обеспечиваем достаточную задержку для корректной инициализации всех компонентов
        // и окончания других анимаций перед открытием модального окна
        setTimeout(() => {
          // Если открыто мобильное меню, сначала закрываем его
          if (isMobile && sidebarVisible) {
            toggleMobileSidebar();
            // Дополнительная задержка после закрытия сайдбара
            setTimeout(() => {
              setSelectedBank(bank);
            }, 150);
          } else {
            setSelectedBank(bank);
          }
        }, 300); // Увеличиваем задержку для лучшей синхронизации с загрузкой страницы
      }
      router.replace('/merchant/terms');
    }
  }, [searchParams, router, banks, isPageReady, isMobile, sidebarVisible, toggleMobileSidebar]);

  const toggleBank = (bankId: string) => {
    if (banks.find(b => b.id === bankId)?.status === 'coming_soon') return;
    setExpandedBanks(prev => ({
      ...prev,
      [bankId]: !prev[bankId]
    }));
  };

  const handleBankConnect = (bank: Bank) => {
    // Если открыто мобильное меню, сначала закрываем его
    if (isMobile && sidebarVisible) {
      toggleMobileSidebar();
      // Используем setTimeout, чтобы дать меню время закрыться
      setTimeout(() => {
        setSelectedBank(bank);
      }, 100);
    } else {
      setSelectedBank(bank);
    }
  };

  const handleSaveConnection = async (url: string) => {
    // Здесь будет логика сохранения URL для банка
    console.log('Saving connection URL:', url);
  };

  const getStatusBadge = (bank: Bank) => {
    if (bank.status === 'coming_soon') {
      return (
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          <span>Скоро</span>
          {bank.comingSoonDate && <span className="text-xs">({bank.comingSoonDate})</span>}
        </div>
      );
    }

    return bank.integrationType === 'integrated' ? (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          <CheckIcon className="h-4 w-4" />
          <span>Подключен</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowIntegrationInfo(bank.id);
          }}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
        >
          <QuestionMarkCircleIcon className="h-5 w-5" />
        </button>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-sm font-medium text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          <span>Ручной</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowIntegrationInfo(bank.id);
          }}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
        >
          <QuestionMarkCircleIcon className="h-5 w-5" />
        </button>
      </div>
    );
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity duration-300 ${isPageReady ? 'opacity-100' : 'opacity-0'}`}>
      <QRBenefitsModal isOpen={showQRBenefits} onClose={() => setShowQRBenefits(false)} />
      <BankConnectionModal 
        isOpen={selectedBank !== null}
        onClose={() => setSelectedBank(null)}
        bank={selectedBank || { id: '', name: '', logo: '' }}
        onSave={handleSaveConnection}
      />
      
      {/* Header */}
      <header className="pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Мои условия</h1>
        <p className="text-lg text-gray-600">
          Управляйте доступными вариантами рассрочки и кредита для ваших клиентов
        </p>
      </header>

      {/* Banks List */}
      <div className="space-y-4">
        {banks.map((bank) => (
          <div 
            key={bank.id}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 ${
              bank.status !== 'coming_soon' && bank.integrationType === 'integrated' ? 'hover:border-gray-300 hover:shadow-md cursor-pointer' : ''
            }`}
          >
            <div className="px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-28 h-10 flex items-center">
                  <img src={bank.logo} alt={bank.name} className="w-full h-auto object-contain" />
                </div>
                <div className="flex items-center gap-6">
                  {getStatusBadge(bank)}
                </div>
              </div>
              {bank.status !== 'coming_soon' && bank.integrationType === 'integrated' && (
                <button 
                  onClick={() => toggleBank(bank.id)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {expandedBanks[bank.id] ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              )}
              {bank.status !== 'coming_soon' && bank.integrationType === 'manual' && (
                <button 
                  onClick={() => handleBankConnect(bank)}
                  className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1 bg-sky-50 px-3 py-1 rounded-full hover:bg-sky-100 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Подключить</span>
                </button>
              )}
            </div>

            {/* Bank Details */}
            {expandedBanks[bank.id] && bank.status !== 'coming_soon' && (
              <div className="border-t border-gray-100">
                {bank.integrationType === 'manual' ? (
                  <div className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <BanknotesIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">Ссылка на оформление рассрочки:</span>
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={bank.manualUrl}
                          readOnly
                          className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm"
                        />
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                        >
                          Сохранить
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="space-y-6">
                      {['Рассрочка', 'Кредит'].map((type) => {
                        const typeTerms = bank.terms?.filter(term => term.type === type);
                        if (!typeTerms?.length) return null;
                        
                        return (
                          <div key={type}>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-gray-50">
                                <BanknotesIcon className="w-5 h-5 text-gray-500" />
                              </div>
                              <h3 className="text-lg font-medium text-gray-900">{type}</h3>
                            </div>
                            <div className="bg-gray-50 rounded-lg overflow-hidden">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Комиссия</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {typeTerms.map((term, index) => (
                                    <tr key={index} className="text-sm">
                                      <td className="px-4 py-3 text-gray-900">{term.name}</td>
                                      <td className="px-4 py-3 text-gray-600">{term.rate}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Other Banks Section */}
        <div className="mt-8">
          <button 
            className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <span>Показать все банки</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Integration Info Modal */}
      {showIntegrationInfo && (
        <Modal isOpen={showIntegrationInfo !== null} onClose={() => setShowIntegrationInfo(null)}>
          <div className="p-6">
            <button 
              onClick={() => setShowIntegrationInfo(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {showIntegrationInfo === 'rbk' ? 'Подключенный банк' : 'Ручное подключение'}
              </h3>
              <p className="text-gray-600">
                {showIntegrationInfo === 'rbk' ? (
                  'Банк полностью подключен к системе. Вы можете видеть все заявки в личном кабинете, отслеживать статусы и получать уведомления. Взаиморасчеты происходят автоматически.'
                ) : (
                  'При ручном подключении вы просто добавляете ссылку на оформление рассрочки от банка. Все взаимодействие и взаиморасчеты происходят напрямую с банком вне нашей системы.'
                )}
              </p>
            </div>
            
            <div className="space-y-4">
              {showIntegrationInfo === 'rbk' ? (
                <>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <p className="text-gray-600">Автоматическое получение заявок</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <p className="text-gray-600">Отслеживание статусов в реальном времени</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <p className="text-gray-600">Автоматические взаиморасчеты</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <p className="text-gray-600">Быстрое подключение через ссылку</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <p className="text-gray-600">Прямое взаимодействие с банком</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <p className="text-gray-600">Возможность использовать существующий договор с банком</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
} 
