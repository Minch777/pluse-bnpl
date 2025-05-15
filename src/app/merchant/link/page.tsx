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
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';

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
                  apply/
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salesPoints, setSalesPoints] = useState<SalesPoint[]>([]);
  const [nextId, setNextId] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  
  // Состояния для дополнительной ссылки
  const [externalLink, setExternalLink] = useState('');
  const [externalLinkType, setExternalLinkType] = useState('kaspi');
  const [externalLinkCopied, setExternalLinkCopied] = useState(false);
  const [externalLinkError, setExternalLinkError] = useState(false);
  // Новое состояние для модального окна преимуществ мультиссылки
  const [isMultilinkModalOpen, setIsMultilinkModalOpen] = useState(false);
  
  const merchantSlug = 'store123';
  const baseApplicationLink = `http://localhost:3000/apply/${merchantSlug}`;
  const qrRef = useRef<SVGSVGElement>(null);
  
  // Управление скроллом страницы при открытии/закрытии модального окна
  useEffect(() => {
    if (isMultilinkModalOpen) {
      // Отключаем скролл на body когда модальное окно открыто
      document.body.style.overflow = 'hidden';
    } else {
      // Включаем скролл когда модальное окно закрыто
      document.body.style.overflow = '';
    }
    
    // Сбрасываем стили при размонтировании компонента
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMultilinkModalOpen]);
  
  // Проверяем URL-параметры при загрузке страницы
  useEffect(() => {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    const showMultilinkModal = urlParams.get('show_multilink_modal');
    
    // Если параметр установлен, открываем модальное окно
    if (showMultilinkModal === 'true') {
      setIsMultilinkModalOpen(true);
      
      // Удаляем параметр из URL без перезагрузки страницы
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
    
    // Добавляем слушатель события для открытия модального окна
    const handleOpenModal = () => {
      setIsMultilinkModalOpen(true);
    };
    
    window.addEventListener('open-multilink-modal', handleOpenModal);
    
    // Очищаем слушатель при размонтировании компонента
    return () => {
      window.removeEventListener('open-multilink-modal', handleOpenModal);
    };
  }, []);
  
  // Получаем актуальную ссылку в зависимости от выбранной точки
  const getCurrentLink = () => {
    if (!selectedPoint) return baseApplicationLink;
    
    const point = salesPoints.find(p => p.id.toString() === selectedPoint);
    if (!point) return baseApplicationLink;
    
    return `http://localhost:3000/apply/${point.slug}`;
  };
  
  // Получаем мультиссылку Pluse + другой банк
  const getMultiLink = () => {
    if (!externalLink) return '';
    
    // Создаем URL с параметром external_link, который содержит закодированную внешнюю ссылку
    return `http://localhost:3000/compare-offers/${merchantSlug}?external_link=${encodeURIComponent(externalLink)}&type=${externalLinkType}`;
  };
  
  const handleAddSalesPoint = (point: { name: string; description: string; slug: string }) => {
    const newPoint = {
      id: nextId,
      name: point.name,
      description: point.description,
      slug: point.slug,
      stats: {
        views: Math.floor(Math.random() * 100),
        applications: Math.floor(Math.random() * 20),
        conversion: Math.floor(Math.random() * 30),
      }
    };
    
    setSalesPoints(prev => [...prev, newPoint]);
    setNextId(prev => prev + 1);
    setIsModalOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getCurrentLink());
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleCopyMultiLink = () => {
    if (!externalLink) {
      setExternalLinkError(true);
      setTimeout(() => setExternalLinkError(false), 3000);
      return;
    }
    
    navigator.clipboard.writeText(getMultiLink());
    setExternalLinkCopied(true);
    
    setTimeout(() => {
      setExternalLinkCopied(false);
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
      link.download = `pluse-qr-${merchantSlug}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(data);
  };
  
  // Валидация внешней ссылки
  const validateExternalLink = (link: string) => {
    if (externalLinkType === 'kaspi' && link && !link.startsWith('https://kaspi.kz/')) {
      setExternalLinkError(true);
      setTimeout(() => setExternalLinkError(false), 3000);
      return false;
    }
    
    if (externalLinkType === 'halyk' && link && !link.startsWith('https://halykbank.kz/')) {
      setExternalLinkError(true);
      setTimeout(() => setExternalLinkError(false), 3000);
      return false;
    }
    
    if (externalLinkType === 'homecredit' && link && !link.startsWith('https://homecredit.kz/')) {
      setExternalLinkError(true);
      setTimeout(() => setExternalLinkError(false), 3000);
      return false;
    }
    
    if (externalLinkType === 'freedom' && link && !link.startsWith('https://bankfreedom.kz/')) {
      setExternalLinkError(true);
      setTimeout(() => setExternalLinkError(false), 3000);
      return false;
    }
    
    setExternalLinkError(false);
    return true;
  };
  
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header section - simplified */}
      <header className="pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">QR-коды для оформления</h1>
        <p className="text-lg text-gray-600">
          Создавайте и делитесь QR-кодами для оформления рассрочки
        </p>
      </header>

      {/* Primary section - Link and QR code */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* QR Code - Always visible */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-transparent rounded-xl transform rotate-6 scale-105"></div>
                <div className="relative bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <QRCodeSVG
                    ref={qrRef}
                    value={getCurrentLink()}
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
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 text-sky-600 text-sm font-medium rounded-lg hover:bg-sky-100 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>Скачать QR-код</span>
                </button>
              </div>
            </div>
            
            {/* Link section */}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">QR-код на оформление</h2>
                <p className="text-gray-600 mb-4">
                  Один QR-код для всех банков. Отправьте эту ссылку клиенту или разместите QR-код в точке продаж для быстрого оформления рассрочки
                </p>
              </div>
            
              <div className="space-y-3">
                <div className="relative">
                  <select 
                    className="w-full appearance-none py-3 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    value={selectedPoint || ""}
                    onChange={(e) => setSelectedPoint(e.target.value || null)}
                  >
                    <option value="">Основная ссылка</option>
                    {salesPoints.map(point => (
                      <option key={point.id} value={point.id.toString()}>
                        Точка: {point.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      readOnly
                      value={getCurrentLink()}
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
      </section>
      
      {/* Sales Points Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Точки продаж</h2>
              <p className="text-sm text-gray-600">Создайте отдельные ссылки для разных торговых точек</p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-sky-600 text-sm font-medium rounded-lg border border-sky-200 hover:bg-sky-50 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Добавить точку</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {salesPoints.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main store card */}
              <div 
                className={`bg-gradient-to-br from-sky-50 to-sky-100/70 rounded-xl p-5 shadow-sm relative overflow-hidden border border-sky-100 hover:shadow-md transition-all cursor-pointer
                  ${!selectedPoint ? 'ring-2 ring-sky-500 ring-offset-2' : ''}`}
                onClick={() => setSelectedPoint(null)}
              >
                <div className="mb-3">
                  <span className="text-xs font-medium text-sky-600 bg-sky-100 px-2 py-1 rounded-full">Основная</span>
                </div>
                
                <h4 className="text-md font-semibold text-gray-800 mb-1">
                  Главный магазин
                </h4>
                
                <p className="text-sm text-gray-600 mb-3">
                  Основная ссылка
                </p>
                
                <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-gradient-to-br from-sky-200/50 to-transparent rounded-full"></div>
                <div className="absolute top-6 right-6">
                  <SparklesIcon className="h-10 w-10 text-sky-200/70" />
                </div>
              </div>

              {/* Custom sales points */}
              {salesPoints.map((point) => (
                <div 
                  key={point.id}
                  className={`bg-white rounded-xl p-5 shadow-sm relative overflow-hidden border border-gray-200 hover:border-sky-200 hover:shadow-md transition-all cursor-pointer
                    ${selectedPoint === point.id.toString() ? 'ring-2 ring-sky-500 ring-offset-2' : ''}`}
                  onClick={() => setSelectedPoint(point.id.toString())}
                >
                  <h4 className="text-md font-semibold text-gray-800 mb-1">
                    {point.name}
                  </h4>
                  
                  {point.description && (
                    <p className="text-sm text-gray-500 mb-3">
                      {point.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                    <LinkIcon className="h-3.5 w-3.5" />
                    <span>apply/{point.slug}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <LinkIcon className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <h4 className="text-md font-medium text-gray-700 mb-2">У вас пока нет торговых точек</h4>
              <p className="text-sm text-gray-500 mb-4">
                Создайте отдельные ссылки для разных магазинов или каналов продаж
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-sky-600 text-sm font-medium rounded-lg border border-sky-200 hover:bg-sky-50 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Добавить первую точку</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      <AddPointModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSalesPoint}
      />
    </div>
  );
}