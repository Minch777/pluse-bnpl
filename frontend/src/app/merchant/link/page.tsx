'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { 
  ClipboardIcon, 
  ClipboardDocumentCheckIcon,
  PlusIcon,
  XMarkIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';

type SalesPoint = {
  id: number;
  name: string;
  description?: string;
  slug: string;
};

// Компонент попапа
function AddPointModal({ 
  isOpen, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (point: { name: string; description: string; slug: string }) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, slug });
    setName('');
    setDescription('');
    setSlug('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full min-h-screen md:min-h-0 md:w-[600px] md:rounded-xl md:max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Добавить точку</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название точки *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Главная точка или Онлайн-магазин"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание точки продаж"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Префикс URL *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Например: store123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !slug.trim()}
            >
              Сохранить точку
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MerchantLink() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salesPoints, setSalesPoints] = useState<SalesPoint[]>([]);
  const [nextId, setNextId] = useState(1);
  
  const merchantSlug = 'store123';
  const applicationLink = `http://localhost:3000/apply/${merchantSlug}`;
  const qrRef = useRef<SVGSVGElement>(null);
  
  const handleAddSalesPoint = (point: { name: string; description: string; slug: string }) => {
    const newPoint = {
      id: nextId,
      name: point.name,
      description: point.description,
      slug: point.slug,
    };
    
    setSalesPoints(prev => [...prev, newPoint]);
    setNextId(prev => prev + 1);
    setIsModalOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(applicationLink);
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
      link.download = `pluse-qr-${merchantSlug}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(data);
  };
  
  return (
    <div className="space-y-6 mt-8">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Поделитесь с клиентом — он заполнит заявку сам
        </h1>
        <p className="mt-2 text-gray-600">
          Скопируйте ссылку или покажите QR-код. Клиент сам заполнит форму, а вы сразу увидите заявку у себя.
        </p>
      </div>

      {salesPoints.length === 0 ? (
        // Старый интерфейс для случая без точек
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ссылка на заявку */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Ссылка на заявку</h2>
                  <p className="text-sm text-gray-600">
                    Отправьте клиенту в WhatsApp, Telegram или Instagram
                  </p>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    value={applicationLink}
                    readOnly
                    className="w-full px-4 py-3 pr-32 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="secondary"
                    size="md"
                    className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-2 active:scale-95 transition-all duration-150"
                  >
                    {copied ? (
                      <>
                        <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-600" />
                        <span className="text-green-600 font-medium">Скопировано</span>
                      </>
                    ) : (
                      <>
                        <ClipboardIcon className="w-5 h-5" />
                        <span>Копировать</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* QR-код */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">QR-код</h2>
                  <p className="text-sm text-gray-600">
                    Покажите клиенту — он отсканирует и заполнит заявку
                  </p>
                </div>
                
                <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <QRCodeSVG
                      ref={qrRef}
                      value={applicationLink}
                      size={200}
                      level="H"
                      includeMargin={true}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                <button
                  onClick={handleDownloadQR}
                  className="w-full bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-50 transition"
                >
                  Скачать QR-код
                </button>
              </div>
            </div>
          </div>

          {/* Управление точками */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Управляйте несколькими точками
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Создайте отдельную ссылку для каждой торговой точки или канала продаж.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Добавить точку
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Новый интерфейс со списком точек
        <div className="space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <PlusIcon className="h-4 w-4 mr-1.5" />
              Добавить точку
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Главный магазин */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">
                Главный магазин
              </h3>
              
              <p className="mt-2 text-sm text-gray-600">
                Создана автоматически
              </p>
              
              <button
                onClick={() => router.push('/merchant/link/default')}
                className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Подробнее
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Кастомные точки */}
            {salesPoints.map((point) => (
              <div 
                key={point.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {point.name}
                </h3>
                
                {point.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {point.description}
                  </p>
                )}
                
                <button
                  onClick={() => router.push(`/merchant/link/${point.slug}`)}
                  className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Подробнее
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <AddPointModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSalesPoint}
      />
    </div>
  );
} 