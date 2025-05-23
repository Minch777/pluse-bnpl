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
  XMarkIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import QRBenefitsModal from '@/components/QRBenefitsModal';
import BankConnectionModal from '@/components/BankConnectionModal';
import Modal from '@/components/Modal';
import { SidebarContext } from '@/app/merchant/layout';
import { getBankConnections, BankType, connectBank, disconnectBank } from '@/api/services/banksService';
import { toast } from 'react-hot-toast';

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

// Соответствие между ID банка и его типом для API
const bankTypeMap: Record<string, BankType> = {
  'kaspi': 'KASPI',
  'halyk': 'HALYK',
  'home': 'HOME',
  'forte': 'FORTE',
  'evra': 'EURASIAN',
  'jusan': 'JUSAN'
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
  bankType?: BankType;
};

export default function Terms() {
  const [expandedBanks, setExpandedBanks] = useState<Record<string, boolean>>({
    'rbk': true
  });
  const [showQRBenefits, setShowQRBenefits] = useState(false);
  const [showIntegrationInfo, setShowIntegrationInfo] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isPageReady, setIsPageReady] = useState(false);
  const [showAllBanks, setShowAllBanks] = useState(false);
  const [savedUrls, setSavedUrls] = useState<Record<string, string>>({});
  const [bankOrder, setBankOrder] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  // Флаг для отслеживания, была ли модалка уже открыта по параметру URL
  const [bankModalProcessed, setBankModalProcessed] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMobile, sidebarVisible, toggleMobileSidebar } = useContext(SidebarContext);

  const mainBanks: Bank[] = [
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
        { type: 'Рассрочка', name: 'Рассрочка 0-0-24', rate: '20%' },
        { type: 'Кредит', name: 'Кредит 6 месяцев', rate: '3%' },
        { type: 'Кредит', name: 'Кредит 12 месяцев', rate: '3%' },
        { type: 'Кредит', name: 'Кредит 24 месяца', rate: '3%' },
        { type: 'Кредит', name: 'Кредит 36 месяцев', rate: '3%' }
      ]
    },
    {
      id: 'kaspi',
      name: 'Kaspi Bank',
      logo: '/kaspi-logo.png',
      integrationType: 'manual',
      status: 'active',
      bankType: 'KASPI',
      manualUrl: '',
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
      bankType: 'HALYK',
      manualUrl: '',
      terms: [
        { type: 'Рассрочка', name: 'Рассрочка 3 месяца', rate: '4%' },
        { type: 'Рассрочка', name: 'Рассрочка 6 месяцев', rate: '7%' },
        { type: 'Рассрочка', name: 'Рассрочка 12 месяцев', rate: '12%' },
      ]
    }
  ];

  const additionalBanks: Bank[] = [
    {
      id: 'home',
      name: 'Home Credit Bank',
      logo: '/home-logo.png',
      integrationType: 'manual',
      status: 'active',
      bankType: 'HOME',
      manualUrl: ''
    },
    {
      id: 'forte',
      name: 'ForteBank',
      logo: '/forte-logo.png',
      integrationType: 'manual',
      status: 'active',
      bankType: 'FORTE',
      manualUrl: ''
    },
    {
      id: 'evra',
      name: 'Evra Bank',
      logo: '/evra-logo.png',
      integrationType: 'manual',
      status: 'active',
      bankType: 'EURASIAN',
      manualUrl: ''
    },
    {
      id: 'jusan',
      name: 'Jusan Bank',
      logo: '/jusan-logo.png',
      integrationType: 'manual',
      status: 'active',
      bankType: 'JUSAN',
      manualUrl: ''
    }
  ];

  // Load saved bank connections from API
  useEffect(() => {
    const fetchBankConnections = async () => {
      try {
        setIsLoading(true);
        const connections = await getBankConnections();
        
        // Create a map of bank type to redirect URL
        // Сохраняем порядок подключения банков для правильной сортировки
        const urlMap: Record<string, string> = {};
        const bankOrderMap: Record<string, number> = {};
        
        // Обрабатываем соединения в порядке их получения с сервера
        // (предполагаем, что сервер возвращает их в порядке добавления)
        connections.forEach((connection, index) => {
          // Find the bank ID from our bankTypeMap
          const bankId = Object.entries(bankTypeMap).find(
            ([_, type]) => type === connection.bankType
          )?.[0];
          
          if (bankId) {
            urlMap[bankId] = connection.redirectUrl;
            // Сохраняем индекс (порядок подключения) для каждого банка
            bankOrderMap[bankId] = index;
          }
        });
        
        setSavedUrls(urlMap);
        // Сохраняем порядок банков в состоянии
        setBankOrder(bankOrderMap);
      } catch (error) {
        console.error('Error fetching bank connections:', error);
        toast.error('Не удалось загрузить подключенные банки');
      } finally {
        setIsLoading(false);
    setIsPageReady(true);
      }
    };
    
    fetchBankConnections();
  }, []);

  // Сортировка банков: RBK всегда наверху, затем подключенные ручные банки в порядке подключения, затем неподключенные
  const sortBanks = (banksToSort: Bank[]): Bank[] => {
    // RBK всегда первый (интегрированный банк)
    const rbkBank = banksToSort.find(b => b.id === 'rbk');
    // Остальные банки (ручные)
    const manualBanks = banksToSort.filter(b => b.id !== 'rbk');
    
    // Разделяем на подключенные и неподключенные
    const connectedBanks = manualBanks.filter(bank => savedUrls[bank.id]);
    const unconnectedBanks = manualBanks.filter(bank => !savedUrls[bank.id]);
    
    // Сортируем подключенные банки по порядку их подключения
    const sortedConnectedBanks = [...connectedBanks].sort((a, b) => {
      // Используем порядок подключения для сортировки
      const orderA = bankOrder[a.id] || 0;
      const orderB = bankOrder[b.id] || 0;
      return orderA - orderB; // Сортировка по возрастанию индекса
    });
    
    // Сначала добавляем RBK (если есть), затем подключенные банки в отсортированном порядке, затем неподключенные
    return [
      ...(rbkBank ? [rbkBank] : []),
      ...sortedConnectedBanks,
      ...unconnectedBanks
    ];
  };

  // Сначала сортируем все банки
  const allSortedBanks = sortBanks([...mainBanks, ...additionalBanks]);
  
  // Отделяем РБК банк от ручных банков
  const rbkBank = allSortedBanks.find(b => b.id === 'rbk');
  const manualBanks = allSortedBanks.filter(b => b.id !== 'rbk');
  
  // Разделяем ручные банки на подключенные и неподключенные
  const connectedManualBanks = manualBanks.filter(bank => savedUrls[bank.id]);
  const unconnectedManualBanks = manualBanks.filter(bank => !savedUrls[bank.id]);
  
  // Определяем, нужно ли показывать неподключенные банки
  // Показываем неподключенные банки только если подключенных меньше 2
  const showUnconnectedBanks = connectedManualBanks.length < 2;
  
  // Если подключенных меньше 2, то добавляем нужное количество неподключенных, чтобы в сумме было 2 ручных банка
  let visibleUnconnectedBanks: Bank[] = [];
  if (showUnconnectedBanks) {
    const neededUnconnectedCount = 2 - connectedManualBanks.length;
    visibleUnconnectedBanks = unconnectedManualBanks.slice(0, neededUnconnectedCount);
  }
  
  // Формируем итоговый список видимых банков: RBK + ВСЕ подключенные + неподключенные (если нужно)
  const visibleMainBanks = [
    ...(rbkBank ? [rbkBank] : []),
    ...connectedManualBanks,
    ...visibleUnconnectedBanks
  ];
  
  // Все оставшиеся неподключенные банки будут скрыты за кнопкой "Показать все банки"
  const hiddenBanks = showUnconnectedBanks ? 
    unconnectedManualBanks.slice(visibleUnconnectedBanks.length) : 
    unconnectedManualBanks;

  // Update bank data with saved URLs
  const banks = (showAllBanks ? allSortedBanks : visibleMainBanks).map(bank => {
    if (savedUrls[bank.id]) {
      return {
        ...bank,
        manualUrl: savedUrls[bank.id]
      };
    }
    return bank;
  });

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

  // Эффект для открытия модалки QR преимуществ по параметру URL
  useEffect(() => {
    if (searchParams?.get('show_qr_benefits') === 'true' && isPageReady) {
        setShowQRBenefits(true);
    }

    // Если параметр 'bank' существует, страница готова, и модалка еще не обрабатывалась
    if (searchParams?.get('bank') && isPageReady && !bankModalProcessed) {
      const bankId = searchParams.get('bank');
      const bank = banks.find(b => b.id === bankId);
      if (bank && bank.integrationType === 'manual') {
        // Устанавливаем флаг, что модалка была обработана
        setBankModalProcessed(true);
        handleBankConnect(bank);
        
        // Очищаем URL сразу после открытия модалки
        const newUrl = window.location.pathname;
        window.history.replaceState(null, '', newUrl);
      }
    }
  }, [searchParams, router, banks, isPageReady, isMobile, sidebarVisible, toggleMobileSidebar, bankModalProcessed]);

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

  const handleModalClose = () => {
    // Закрываем модальное окно
    setSelectedBank(null);
  };

  const handleSaveConnection = async (url: string, bankId: string) => {
    try {
      const bank = banks.find(b => b.id === bankId);
      if (!bank || !bank.bankType) {
        throw new Error('Банк не найден или не имеет типа');
      }
      
      // Сохраняем URL в состоянии
      setSavedUrls(prev => ({
        ...prev,
        [bankId]: url
      }));
      
      // Добавляем или обновляем порядок подключения банка - он будет последним
      setBankOrder(prev => {
        const maxOrder = Object.values(prev).length > 0 ? Math.max(...Object.values(prev)) : -1;
        return {
          ...prev,
          [bankId]: maxOrder + 1
        };
      });
      
    } catch (error) {
      console.error('Error saving connection:', error);
      toast.error(`Не удалось сохранить подключение: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  const handleSaveManualUrl = async (bankId: string, url: string) => {
    try {
      const bank = banks.find(b => b.id === bankId);
      if (!bank || !bank.bankType) {
        throw new Error('Банк не найден или не имеет типа');
      }
      
      // Call API to save the URL
      await connectBank(bank.bankType, url);
      
      // Update local state
      setSavedUrls(prev => ({
        ...prev,
        [bankId]: url
      }));
      
      // Добавляем или обновляем порядок подключения банка - он будет последним
      setBankOrder(prev => {
        const maxOrder = Object.values(prev).length > 0 ? Math.max(...Object.values(prev)) : -1;
        return {
          ...prev,
          [bankId]: maxOrder + 1
        };
      });
      
      toast.success(`Ссылка для ${bank.name} сохранена`);
    } catch (error) {
      console.error('Error saving URL:', error);
      toast.error(`Не удалось сохранить ссылку: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  const handleDisconnectBank = async (bankId: string) => {
    try {
      const bank = banks.find(b => b.id === bankId);
      if (!bank || !bank.bankType) {
        throw new Error('Банк не найден или не имеет типа');
      }
      
      // Call API to disconnect the bank
      await disconnectBank(bank.bankType);
      
      // Update local state
      setSavedUrls(prev => {
        const newUrls = {...prev};
        delete newUrls[bankId];
        return newUrls;
      });
      
      // Удаляем банк из порядка подключений
      setBankOrder(prev => {
        const newOrder = {...prev};
        delete newOrder[bankId];
        return newOrder;
      });
      
      toast.success(`Банк ${bank.name} отключен`);
    } catch (error) {
      console.error('Error disconnecting bank:', error);
      toast.error(`Не удалось отключить банк: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  // Модальное окно для отображения информации о типе интеграции
  const IntegrationInfoModal = ({ isOpen, onClose, bankId }: { isOpen: boolean; onClose: () => void; bankId: string | null }) => {
    if (!bankId) return null;
    
    const isIntegrated = bankId === 'rbk';
    
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6 max-w-md mx-auto">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isIntegrated ? 'Подключенный банк' : 'Ручное подключение'}
            </h3>
            <p className="text-gray-600">
              {isIntegrated ? (
                'Банк полностью подключен к системе. Вы можете видеть все заявки в личном кабинете, отслеживать статусы и получать уведомления. Взаиморасчеты происходят автоматически.'
              ) : (
                'При ручном подключении вы просто добавляете ссылку на оформление рассрочки от банка. Все взаимодействие и взаиморасчеты происходят напрямую с банком вне нашей системы.'
              )}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Понятно
          </button>
        </div>
      </Modal>
    );
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
        <div className="flex items-center gap-1.5 text-sm font-medium text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
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
        <div className={`flex items-center gap-1.5 text-sm font-medium ${savedUrls[bank.id] ? 'text-sky-700 bg-sky-50 border border-sky-100' : 'text-gray-700 bg-gray-50 border border-gray-200'} px-3 py-1 rounded-full`}>
          <span>{savedUrls[bank.id] ? 'Подключен' : 'Ручной'}</span>
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
        onClose={handleModalClose}
        bank={selectedBank || { id: '', name: '', logo: '' }}
        onSave={handleSaveConnection}
      />
      <IntegrationInfoModal 
        isOpen={showIntegrationInfo !== null}
        onClose={() => setShowIntegrationInfo(null)}
        bankId={showIntegrationInfo}
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
        {isLoading ? (
          // Skeleton loader
          Array(3).fill(null).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-28 h-10 bg-gray-200 rounded"></div>
                  <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))
        ) : (
          banks.map((bank) => (
          <div 
            key={bank.id}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 ${
                bank.status !== 'coming_soon' ? 'hover:border-gray-300 hover:shadow-md cursor-pointer' : ''
            }`}
              onClick={() => bank.integrationType === 'integrated' ? toggleBank(bank.id) : null}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBank(bank.id);
                    }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {expandedBanks[bank.id] ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              )}
                {bank.status !== 'coming_soon' && bank.integrationType === 'manual' && !savedUrls[bank.id] && (
                <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBankConnect(bank);
                    }}
                  className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1 bg-sky-50 px-3 py-1 rounded-full hover:bg-sky-100 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Подключить</span>
                </button>
              )}
                {bank.status !== 'coming_soon' && bank.integrationType === 'manual' && savedUrls[bank.id] && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBank(bank.id);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {expandedBanks[bank.id] ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                )}
            </div>

            {/* Bank Details */}
            {expandedBanks[bank.id] && bank.status !== 'coming_soon' && (
              <div className="border-t border-gray-100">
                  {bank.integrationType === 'manual' && savedUrls[bank.id] ? (
                  <div className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <BanknotesIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-600">Ссылка для перенаправления:</span>
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="text"
                            value={savedUrls[bank.id]}
                            onChange={(e) => {
                              setSavedUrls(prev => ({
                                ...prev,
                                [bank.id]: e.target.value
                              }));
                            }}
                          className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm"
                        />
                        <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveManualUrl(bank.id, savedUrls[bank.id]);
                            }}
                          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                        >
                          Сохранить
                        </button>
                        </div>
                        <div className="flex justify-end mt-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDisconnectBank(bank.id);
                            }}
                            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg text-sm font-medium flex items-center gap-1.5"
                          >
                            <XMarkIcon className="h-4 w-4" />
                            <span>Отключить банк</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : bank.integrationType === 'integrated' ? (
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
                  ) : null}
              </div>
            )}
          </div>
          ))
        )}

        {/* Show More Banks Button */}
        {hiddenBanks.length > 0 && (
          <button 
            onClick={() => setShowAllBanks(!showAllBanks)}
            className="w-full py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <span>{showAllBanks ? 'Скрыть дополнительные банки' : 'Показать все банки'}</span>
            {!showAllBanks && <ChevronDownIcon className="w-4 h-4" />}
            {showAllBanks && <ChevronUpIcon className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
} 
