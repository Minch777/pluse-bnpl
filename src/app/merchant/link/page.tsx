'use client';

import { useState, useRef } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { 
  ClipboardIcon, 
  ClipboardDocumentCheckIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';

export default function MerchantLink() {
  const [copied, setCopied] = useState(false);
  const merchantSlug = 'store123';
  const applicationLink = `http://localhost:3000/apply/${merchantSlug}`;
  const qrRef = useRef<SVGSVGElement>(null);
  
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

    canvas.width = svg.clientWidth * 2; // Увеличиваем размер для лучшего качества
    canvas.height = svg.clientHeight * 2;

    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Создаем ссылку для скачивания
      const link = document.createElement('a');
      link.download = `pluse-qr-${merchantSlug}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(data);
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      {/* Заголовок страницы */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Поделитесь с клиентом — он заполнит заявку сам
        </h1>
        <p className="text-base text-gray-600">
          Скопируйте ссылку или покажите QR-код. Клиент сам заполнит форму, а вы сразу увидите заявку у себя.
        </p>
      </div>
      
      {/* Основные блоки */}
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
      <div className="max-w-6xl mx-auto w-full mt-8">
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
            <button className="inline-flex items-center bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap">
              <PlusIcon className="h-4 w-4 mr-1.5" />
              Добавить точку
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 