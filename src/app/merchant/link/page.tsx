'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ClipboardIcon, 
  ClipboardDocumentCheckIcon,
  PlusIcon,
  XMarkIcon,
  ArrowRightIcon,
  QrCodeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  DocumentTextIcon,
  SparklesIcon,
  BuildingLibraryIcon,
  CheckIcon,
  LinkIcon,
  ExclamationCircleIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';
import merchantService, { Merchant, Outlet, ApplicationLink } from '@/api/services/merchantService';
import { getBankConnections, BankType } from '@/api/services/banksService';
import QRBenefitsModal from '@/components/QRBenefitsModal';

// Modern color palette
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
  text: {
    primary: '#0F172A', // slate-900
    secondary: '#475569', // slate-600
    tertiary: '#94A3B8' // slate-400
  }
};

type SalesPoint = {
  id: number;
  name: string;
  description?: string;
  slug: string;
  stats?: {
    views: number;
    applications: number;
    conversion: number;
  }
};

// Modal component for adding a new sales point
function AddPointModal({ 
  isOpen, 
  onClose, 
  onSave,
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (point: { name: string; description: string; slug: string }) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'name' && !formData.slug) {
      // Auto-generate slug based on name
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      setFormData({ ...formData, [name]: value, slug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ name: '', description: '', slug: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-xl transition-all transform animate-fadeIn">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-medium text-slate-800">Добавить торговую точку</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Название
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                placeholder="Например: ТЦ Мега"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                Описание (необязательно)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="mt-1 w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                placeholder="Например: Отдел на 2 этаже"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
                URL-идентификатор
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 sm:text-sm">
                  public/
                </span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-slate-300 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder="my-store"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Это будет частью ссылки для клиента
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all
                bg-gradient-to-r from-${colors.gradient.from} to-${colors.gradient.to} hover:shadow-md hover:from-${colors.gradient.to} hover:to-${colors.gradient.from}`}
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Share menu component
function ShareMenu({
  applicationLink,
  onCopyLink,
  copied
}: {
  applicationLink: string;
  onCopyLink: () => void;
  copied: boolean;
}) {
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Оформить рассрочку',
          text: 'Оформите рассрочку по этой ссылке:',
          url: applicationLink,
        });
      } else {
        setShareMenuOpen(!shareMenuOpen);
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };
  
  return (
    <div className="relative">
      <button 
        onClick={handleShare}
        className="text-slate-600 hover:text-sky-500 p-2 rounded-full hover:bg-sky-50 transition-colors"
      >
        <ShareIcon className="h-5 w-5" />
      </button>
      
      {shareMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-10 animate-fadeIn">
          <div className="py-2 px-3">
            <button 
              onClick={() => {
                onCopyLink();
                setShareMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
            >
              {copied ? <ClipboardDocumentCheckIcon className="h-5 w-5 text-emerald-500" /> : <ClipboardIcon className="h-5 w-5" />}
              <span>{copied ? 'Скопировано' : 'Копировать ссылку'}</span>
            </button>
            
            <button
              onClick={() => {
                window.open(`https://wa.me/?text=${encodeURIComponent(`Оформите рассрочку по ссылке: ${applicationLink}`)}`, '_blank');
                setShareMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
            >
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Отправить в WhatsApp</span>
            </button>
            
            <button
              onClick={() => {
                window.open(`https://t.me/share/url?url=${encodeURIComponent(applicationLink)}&text=${encodeURIComponent('Оформите рассрочку по ссылке:')}`, '_blank');
                setShareMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
            >
              <svg className="h-5 w-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.27-.535.133-.179-.136-.432-.439-.756-.767l-1.59-1.385-2.536.809c-.583.183-.596-.174-.107-.477l9.861-6.544c.532-.35 1.04.146.8 1.27z" />
              </svg>
              <span>Отправить в Telegram</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MerchantLink() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [tokenState, setTokenState] = useState<string | null>(null);
  const [showQRBenefits, setShowQRBenefits] = useState(false);
  const [connectedBanks, setConnectedBanks] = useState<Record<string, boolean>>({
    rbk: true, // RBK is always connected by default
    kaspi: false,
    halyk: false
  });
  // Добавляем состояние для хранения порядка банков
  const [bankOrder, setBankOrder] = useState<Record<string, number>>({});
  // Добавляем состояние для отслеживания выбранного типа ссылки
  const [linkType, setLinkType] = useState<'basic' | 'qr'>('basic');
  
  // Определяем все доступные ручные банки
  const manualBanks = [
    {
      id: 'kaspi',
      name: 'Kaspi Bank',
      logo: '/kaspi-logo.png'
    },
    {
      id: 'halyk',
      name: 'Halyk Bank',
      logo: '/halyk-logo.png'
    },
    {
      id: 'home',
      name: 'Home Credit Bank',
      logo: '/home-logo.png'
    },
    {
      id: 'forte',
      name: 'ForteBank',
      logo: '/forte-logo.png'
    },
    {
      id: 'evra',
      name: 'Evra Bank',
      logo: '/evra-logo.png'
    },
    {
      id: 'jusan',
      name: 'Jusan Bank',
      logo: '/jusan-logo.png'
    }
  ];
  
  const qrRef = useRef<SVGSVGElement>(null);
  
  // Проверяем параметр URL для открытия попапа
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('show_qr_benefits') === 'true') {
      // Всегда добавляем небольшую задержку для гарантированного открытия после монтирования
      setTimeout(() => {
        setShowQRBenefits(true);
      }, 300);
      
      // Очищаем URL от параметра
      router.replace('/merchant/link');
    }
  }, [router]);
  
  // Слушатель события для открытия модального окна
  useEffect(() => {
    const handleShowQRBenefits = () => {
      setShowQRBenefits(true);
    };

    window.addEventListener('showQRBenefits', handleShowQRBenefits);
    return () => {
      window.removeEventListener('showQRBenefits', handleShowQRBenefits);
    };
  }, []);
  
  // Получаем токен из localStorage без проверки на его наличие (это делается на уровне Layout)
  useEffect(() => {
    const token = localStorage.getItem('token');
    setTokenState(token);
  }, []);
  
  // Fetch merchant data on component mount
  useEffect(() => {
    const fetchMerchantData = async () => {
      // Не делаем запрос, если нет токена
      if (!tokenState) {
        console.log('Skipping API call, no token available');
        return;
      }
    
      try {
        console.log('Starting merchant data fetch...');
        setLoading(true);
        const merchantData = await merchantService.getCurrentMerchant();
        console.log('Merchant data received in component:', merchantData);
        setMerchant(merchantData);
        
        // Сохраняем slug в localStorage для использования в других компонентах
        if (merchantData && merchantData.slug) {
          localStorage.setItem('merchantSlug', merchantData.slug);
          console.log('Merchant slug saved to localStorage:', merchantData.slug);
        }
        
        setError(null);
      } catch (err: any) {
        console.error('Error in component when fetching merchant data:', err);
        setError(`Не удалось загрузить данные мерчанта: ${err.message || JSON.stringify(err)}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMerchantData();
  }, [tokenState]);
  
  // Fetch bank connections
  useEffect(() => {
    const fetchBankConnections = async () => {
      if (!tokenState) return;
      
      try {
        const connections = await getBankConnections();
        
        // Create a map of bank connections
        const bankConnections: Record<string, boolean> = {
          rbk: true // RBK is always connected by default
        };
        
        // Создаем карту порядка подключений
        const bankOrderMap: Record<string, number> = {};
        
        // Find connections for all manual banks
        connections.forEach((connection, index) => {
          if (connection.bankType === 'KASPI') {
            bankConnections.kaspi = true;
            bankOrderMap.kaspi = index;
          } else if (connection.bankType === 'HALYK') {
            bankConnections.halyk = true;
            bankOrderMap.halyk = index;
          } else if (connection.bankType === 'HOME') {
            bankConnections.home = true;
            bankOrderMap.home = index;
          } else if (connection.bankType === 'FORTE') {
            bankConnections.forte = true;
            bankOrderMap.forte = index;
          } else if (connection.bankType === 'EURASIAN') {
            bankConnections.evra = true;
            bankOrderMap.evra = index;
          } else if (connection.bankType === 'JUSAN') {
            bankConnections.jusan = true;
            bankOrderMap.jusan = index;
          }
        });
        
        setConnectedBanks(bankConnections);
        setBankOrder(bankOrderMap);
      } catch (error) {
        console.error('Error fetching bank connections:', error);
        // Keep the default values in case of error
      }
    };
    
    fetchBankConnections();
  }, [tokenState]);
  
  // После загрузки данных о банках устанавливаем начальный тип ссылки
  useEffect(() => {
    // Проверяем, есть ли подключенные ручные банки
    const hasManualBanks = Object.entries(connectedBanks).some(([key, value]) => key !== 'rbk' && value);
    
    // Если есть подключенные ручные банки, выбираем "Единый QR", иначе "Основная ссылка"
    if (hasManualBanks) {
      setLinkType('qr');
    } else {
      setLinkType('basic');
    }
  }, [connectedBanks]);
  
  // Функция для сортировки и отбора банков для отображения, аналогично странице Terms
  const getVisibleBanks = () => {
    // Разделяем банки на подключенные и неподключенные
    const connected = manualBanks.filter(bank => connectedBanks[bank.id]);
    const unconnected = manualBanks.filter(bank => !connectedBanks[bank.id]);
    
    // Сортируем подключенные банки по порядку подключения
    const sortedConnected = [...connected].sort((a, b) => {
      const orderA = bankOrder[a.id] || 0;
      const orderB = bankOrder[b.id] || 0;
      return orderA - orderB;
    });
    
    // Определяем, сколько неподключенных банков нужно показать
    // Если подключенных меньше 2, показываем неподключенные, чтобы в сумме было 2
    const showUnconnectedCount = Math.max(0, 2 - sortedConnected.length);
    
    // Возвращаем подключенные банки + нужное количество неподключенных (максимум 2 банка)
    const result = [...sortedConnected, ...unconnected.slice(0, showUnconnectedCount)];
    return result.slice(0, 2);
  };

  // Получаем банки для отображения
  const visibleBanks = getVisibleBanks();
  
  // Gets the current application URL or generates a new one if needed
  const getCurrentLink = async () => {
    if (!merchant) return '';
    
    try {
      // If manual banks are connected, use the QR link
      if (linkType === 'qr') {
        // Используем slug мерчанта для формирования URL
        if (merchant.slug) {
          console.log('Using merchant slug for QR link:', merchant.slug);
          return `${process.env.NEXT_PUBLIC_FRONTEND_URL}/qr/${merchant.slug}`;
        } else {
          console.log('No merchant slug found, using direct QR link');
          return `${process.env.NEXT_PUBLIC_FRONTEND_URL}/qr`;
        }
      }
      
      // Для основной ссылки
      const result = await merchantService.createApplicationLink(merchant.slug, 0);
      setGeneratedLink(result.redirectUrl);
      return result.redirectUrl;
    } catch (err) {
      console.error('Error creating application link:', err);
      return `${process.env.NEXT_PUBLIC_FRONTEND_URL}/public/${merchant?.slug}`;
    }
  };
  
  const handleCopyLink = async () => {
    const link = await getCurrentLink();
    navigator.clipboard.writeText(link);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleDownloadQR = () => {
    if (!qrRef.current) return;

    // Создаем Canvas из SVG
    const svg = qrRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const data = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    canvas.width = svg.clientWidth * 2;
    canvas.height = svg.clientHeight * 2;

    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const link = document.createElement('a');
      link.download = `pluse-qr-${merchant?.slug || ''}`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(data);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-6 text-center">
        <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-800">Ошибка загрузки данных</h3>
        <p className="mt-2 text-red-700">{error}</p>
        <div className="mt-4 text-left bg-white p-4 rounded-md text-sm text-gray-700 max-h-40 overflow-auto">
          <p className="font-medium">Данные токена:</p>
          <pre className="whitespace-pre-wrap mt-2 bg-gray-100 p-2 rounded">
            {tokenState ? 'Токен существует' : 'Токен отсутствует'}
          </pre>
          <p className="font-medium mt-3">Проверьте следующее:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>API сервер запущен на порту 4010</li>
            <li>API-путь /merchant/me доступен</li>
            <li>Соединение с интернетом работает</li>
            <li>Вы вошли в систему (если требуется авторизация)</li>
          </ul>
        </div>
        <div className="mt-6 flex gap-4 justify-center">
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
          >
            Войти заново
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-fadeIn">
      <QRBenefitsModal 
        isOpen={showQRBenefits} 
        onClose={() => setShowQRBenefits(false)} 
      />
      {/* Header section */}
      <header className="pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Единый QR-код для оформления рассрочки</h1>
        <p className="text-lg text-gray-600">
          Используйте один QR-код для всех банков. Клиенты смогут выбрать удобный вариант рассрочки.
        </p>
      </header>

      {/* Main QR section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-transparent rounded-xl transform rotate-6 scale-105"></div>
                <div className="relative bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <QRCodeSVG
                    ref={qrRef}
                    value={
                      linkType === 'qr'
                        ? (merchant?.slug 
                            ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}/qr/${merchant.slug}` 
                            : `${process.env.NEXT_PUBLIC_FRONTEND_URL}/qr`)
                        : (generatedLink || `${process.env.NEXT_PUBLIC_FRONTEND_URL}/public/${merchant?.slug || ''}`)
                    }
                    size={180}
                    bgColor="#FFFFFF"
                    fgColor={colors.primary}
                    level="L"
                    includeMargin={false}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-2 w-full justify-center">
                <button
                  onClick={handleDownloadQR}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>Скачать QR</span>
                </button>
                <ShareMenu 
                  applicationLink={
                    linkType === 'qr'
                      ? (merchant?.slug 
                          ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}/qr/${merchant.slug}` 
                          : `${process.env.NEXT_PUBLIC_FRONTEND_URL}/qr`)
                      : (generatedLink || `${process.env.NEXT_PUBLIC_FRONTEND_URL}/public/${merchant?.slug || ''}`)
                  }
                  onCopyLink={handleCopyLink}
                  copied={copied}
                />
              </div>
            </div>
            
            {/* Link section */}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Ссылка на оформление</h2>
                <p className="text-gray-600 mb-4">
                  Отправьте эту ссылку клиенту или разместите QR-код в точке продаж
                </p>
              </div>
            
              <div className="space-y-3">
                {/* Добавляем выбор типа ссылки */}
                <div className="flex space-x-2 mb-4">
                  {/* Поменяли порядок кнопок - сначала Единый QR */}
                  {/* Отображаем Единый QR только при наличии подключенных ручных банков */}
                  {Object.entries(connectedBanks).some(([key, value]) => key !== 'rbk' && value) && (
                    <button
                      onClick={() => {
                        setLinkType('qr');
                      }}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        linkType === 'qr'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-sky-50 hover:text-sky-600'
                      }`}
                    >
                      <QrCodeIcon className="h-5 w-5 mr-2" />
                      Единый QR
                    </button>
                  )}
                  
                  {/* Основная ссылка отображается всегда */}
                  <button
                    onClick={() => {
                      setLinkType('basic');
                    }}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      linkType === 'basic'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-sky-50 hover:text-sky-600'
                    }`}
                  >
                    <LinkIcon className="h-5 w-5 mr-2" />
                    Основная ссылка
                  </button>
                </div>
                
                {/* Показываем поле с соответствующей выбранной ссылкой */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      readOnly
                      value={
                        linkType === 'qr'
                          ? (merchant?.slug 
                              ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}/qr/${merchant.slug}` 
                              : `${process.env.NEXT_PUBLIC_FRONTEND_URL}/qr`)
                          : (generatedLink || `${process.env.NEXT_PUBLIC_FRONTEND_URL}/public/${merchant?.slug || ''}`)
                      }
                      className="w-full pr-10 py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </div>
                  
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <ClipboardDocumentCheckIcon className="h-5 w-5" />
                        <span>Скопировано</span>
                      </>
                    ) : (
                      <>
                        <ClipboardIcon className="h-5 w-5" />
                        <span>Копировать</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connected Banks */}
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Левый блок: Банки */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-gray-200 shadow-md h-full flex flex-col p-6 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <BuildingLibraryIcon className="h-6 w-6 text-sky-500" />
                <span>Выберите банки для подключения</span>
              </h3>
              <div className="divide-y divide-gray-100 flex-1 -mx-4">
                {/* RBK Bank - Connected */}
                <div className="p-5 flex items-center justify-between bg-gradient-to-r from-sky-50 to-transparent hover:from-sky-100/70 transition-all duration-200 rounded-lg mx-2 my-1">
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-10 flex items-center">
                      <img src="/rbk-logo.png" alt="RBK Bank" className="w-full h-auto object-contain" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-sky-700 bg-sky-50 px-4 py-1.5 rounded-full shadow-sm border border-sky-100">
                    <span>Подключено</span>
                  </div>
                </div>
                
                {/* Отображаем только отсортированные банки (максимум 2) */}
                {visibleBanks.map(bank => (
                  <div key={bank.id} className="p-5 flex items-center justify-between hover:bg-slate-50/70 transition-all duration-200 rounded-lg mx-2 my-1">
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-10 flex items-center">
                        <img src={bank.logo} alt={bank.name} className="w-full h-auto object-contain" />
                      </div>
                    </div>
                    {connectedBanks[bank.id] ? (
                      <div className="flex items-center gap-2 text-sm font-medium text-sky-700 bg-sky-50 px-4 py-1.5 rounded-full shadow-sm border border-sky-100">
                        <span>Подключено</span>
                  </div>
                    ) : (
                  <button 
                        onClick={() => router.push(`/merchant/terms?bank=${bank.id}`)}
                    className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1 bg-sky-50 px-3 py-1 rounded-full hover:bg-sky-100 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Подключить</span>
                  </button>
                    )}
                  </div>
                ))}
                
                {/* Add More Banks */}
                <div className="p-5 flex items-center justify-between hover:bg-slate-50/70 transition-all duration-200 rounded-lg mx-2 my-1">
                  <button 
                    className="flex items-center gap-3 text-gray-500 hover:text-gray-700 transition-colors group w-full"
                    onClick={() => router.push('/merchant/terms')}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors shadow-sm">
                      <PlusIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    </div>
                    <span className="text-sm font-medium">Все банки</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Правый блок: Как это работает */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-gray-200 shadow-md h-full flex flex-col p-6 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-sky-500" />
                <span>Как это работает:</span>
              </h3>
              <div className="divide-y divide-gray-100 flex-1 -mx-4">
                <div className="p-5 flex items-start gap-4 hover:bg-sky-50/40 transition-all duration-200 rounded-lg mx-2 my-1">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shadow-sm">
                    <PlusIcon className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Шаг 1</h4>
                    <p className="text-gray-600">Добавляете любой банк для оформления рассрочки</p>
                  </div>
                </div>
                <div className="p-5 flex items-start gap-4 hover:bg-indigo-50/40 transition-all duration-200 rounded-lg mx-2 my-1">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm">
                    <QrCodeIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Шаг 2</h4>
                    <p className="text-gray-600">Один QR — для сайта, кассы, рекламы</p>
                  </div>
                </div>
                <div className="p-5 flex items-start gap-4 hover:bg-emerald-50/40 transition-all duration-200 rounded-lg mx-2 my-1">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Шаг 3</h4>
                    <p className="text-gray-600">Ваш клиент доволен. Если один банк отказал – другой может одобрить</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}