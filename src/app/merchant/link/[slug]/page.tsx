'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeftIcon, ClipboardIcon, CheckIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import QRCode from 'qrcode';

export default function MerchantLinkPage({ params }: { params: { slug: string } }) {
  const [linkCopied, setLinkCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const applicationLink = `${process.env.NEXT_PUBLIC_APP_URL}/public/${params.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(applicationLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) {
      // If no canvas found, create one from the SVG
      QRCode.toCanvas(applicationLink, { errorCorrectionLevel: 'H', width: 400 }, (err, canvas) => {
        if (err) return console.error(err);
        downloadCanvasAsImage(canvas);
      });
    } else {
      downloadCanvasAsImage(canvas);
    }
  };

  const downloadCanvasAsImage = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = `qr-code-${params.slug}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center mb-6 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Назад
      </button>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Ссылка на оформление заявки</h1>
          <p className="mt-1 text-gray-600">
            Поделитесь этой ссылкой с клиентом для оформления заявки на рассрочку
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ссылка для клиента</label>
            <div className="flex">
              <input
                type="text"
                value={applicationLink}
                readOnly
                className="flex-1 p-2 border rounded-md bg-gray-50"
              />
              <button
                onClick={handleCopyLink}
                className="ml-2 p-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
                title="Скопировать ссылку"
              >
                {linkCopied ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <ClipboardIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {linkCopied && (
              <p className="mt-1 text-sm text-green-600">Ссылка скопирована в буфер обмена!</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">QR-код для сканирования</label>
            <div ref={qrRef} className="flex justify-center mb-4">
              <QRCodeSVG
                value={applicationLink}
                size={200}
                level="H"
                includeMargin={true}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleDownloadQR}
                className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Скачать QR-код
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 