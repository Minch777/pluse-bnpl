'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Button from '@/components/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface SalesPointDetailsProps {
  params: {
    slug: string;
  };
}

export default function SalesPointDetails({ params }: SalesPointDetailsProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const applicationLink = `${process.env.NEXT_PUBLIC_APP_URL}/apply/${params.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(applicationLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `qr-code-${params.slug}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="secondary"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Назад
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Ссылка на заявку</h2>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              value={applicationLink}
              readOnly
              className="flex-1 p-2 border rounded-md bg-gray-50"
            />
            <Button
              onClick={handleCopyLink}
              variant="outline"
            >
              {linkCopied ? 'Скопировано!' : 'Копировать'}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Отправьте эту ссылку клиенту для подачи заявки на рассрочку
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">QR-код</h2>
          <div ref={qrRef} className="flex justify-center mb-4">
            <QRCodeSVG
              value={applicationLink}
              size={200}
              level="H"
              includeMargin
            />
          </div>
          <div className="flex justify-center">
            <Button
              onClick={handleDownloadQR}
              variant="outline"
            >
              Скачать QR-код
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 