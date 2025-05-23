'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRightIcon, 
  ChevronLeftIcon, 
  CheckCircleIcon, 
  ShieldCheckIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';
import merchantService, { Merchant } from '@/api/services/merchantService';
import { getBankConnections, BankConnection, BankType, getPublicBanksByMerchantSlug, PublicBank } from '@/api/services/banksService';

type Bank = {
  id: string;
  name: string;
  logo: string;
  terms: {
    type: string;
    name: string;
    rate: string;
    months: number;
  }[];
  borderColor: string;
  bgColor: string;
  textColor: string;
  urlPrefix: string;
  bankType: BankType;
};

// Bank styling configuration
const bankStyles: Record<string, { 
  logo: string,
  borderColor: string,
  bgColor: string,
  textColor: string,
  description: string
}> = {
  'KASPI': {
      logo: '/kaspi-logo.png',
      borderColor: 'border-red-200',
      bgColor: 'bg-red-50',
      textColor: 'text-red-500',
    description: 'Популярный'
  },
  'HALYK': {
      logo: '/halyk-logo.png',
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    description: 'Надежный'
  },
  'HOME': {
      logo: '/home-logo.png',
      borderColor: 'border-orange-200',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    description: 'Гибкий'
  },
  'FORTE': {
      logo: '/forte-logo.png',
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    description: 'Универсальный'
  },
  'EURASIAN': {
      logo: '/evra-logo.png',
      borderColor: 'border-indigo-200',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    description: 'Универсальный'
  },
  'JUSAN': {
      logo: '/jusan-logo.png',
      borderColor: 'border-teal-200',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
    description: 'Надежный'
  },
  'RBK': {
    logo: '/rbk-logo.png',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    description: 'Выгодный'
  }
};

export default function QRPage({ params }: { params: { merchantId: string } }) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch merchant data and available banks
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Use merchant ID from URL
        const merchantId = params.merchantId;
        console.log('merchantId from URL parameters:', merchantId);
        
        if (!merchantId) {
          throw new Error('Merchant ID is missing');
        }
        
        // Get available banks for this merchant
        const availableBanks = await getPublicBanksByMerchantSlug(merchantId);
        console.log('Available banks:', availableBanks);
        
        // Transform API banks into display banks
        const displayBanks = availableBanks.map(bank => {
          const style = bankStyles[bank.type] || bankStyles['RBK'];
          return {
            id: bank.type.toLowerCase(),
            name: bank.name || `${bank.type} Bank`,
            logo: style.logo,
            borderColor: style.borderColor,
            bgColor: style.bgColor, 
            textColor: style.textColor,
            urlPrefix: '',
            bankType: bank.type as BankType,
            redirectUrl: bank.redirectUrl,
            terms: [] // We don't have terms from the API
          };
        });
        
        // Sort banks to ensure RBK is always first
        const sortedBanks = displayBanks.sort((a, b) => {
          if (a.bankType === 'RBK') return -1;
          if (b.bankType === 'RBK') return 1;
          return 0;
        });
        
        setBanks(sortedBanks);
        
        // Set merchant info
        setMerchant({
          id: merchantId,
          name: merchantId, // Default to ID if we don't have name
          slug: merchantId
        });
        
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.merchantId]);

  const handleBankSelect = (bank: Bank) => {
    if (bank && bank.redirectUrl) {
      // Ensure the URL has a proper protocol prefix
      let url = bank.redirectUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      // Open bank's redirect URL directly in a new window
      window.open(url, '_blank');
    } else {
      console.error('Cannot open bank URL:', {
        hasBankInfo: !!bank,
        hasRedirectUrl: !!(bank && bank.redirectUrl)
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-xl font-medium text-red-600 mb-4">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // No banks available
  if (banks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Банки не найдены</h2>
          <p className="text-gray-600 mb-6">У данного мерчанта нет доступных банков для рассрочки</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/pluse-logo.png"
                alt="Pluse"
                width={100}
                height={28}
                className="w-auto h-6"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Merchant Info */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">
              Выберите банк для оформления рассрочки
            </h1>
            <p className="text-md text-gray-600 max-w-lg mx-auto">
              Оплата для {merchant?.name} в рассрочку — без звонков и визитов в банк
            </p>
          </div>

          {/* Single QR message */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600 max-w-full overflow-hidden">
              <QrCodeIcon className="w-4 h-4 mr-2 flex-shrink-0 text-gray-500" />
              <span className="truncate">Один QR-код — все доступные банки в одном месте</span>
            </div>
          </div>

          {/* Bank Selection */}
          <div className="max-w-xl mx-auto space-y-6">
            {banks.map((bank) => (
              <div 
                key={bank.id}
                onClick={() => handleBankSelect(bank)}
                className="bg-[#f7faff] rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {/* Logo container with extremely light background */}
                    <div className="w-[160px] h-20 flex items-center justify-center rounded-lg bg-[#f7faff] p-3">
                      <Image 
                        src={bank.logo} 
                        alt={bank.name} 
                        width={bank.bankType === 'RBK' ? 160 : 120}
                        height={bank.bankType === 'RBK' ? 80 : 60}
                        className="w-auto h-auto object-contain" 
                      />
                    </div>
                    
                    {/* Subtle badge with vertical line accent */}
                    <div className="flex items-center ml-4">
                      <div className="flex items-center">
                        <div className="w-0.5 h-5 bg-gray-300 rounded mr-2"></div>
                        <span className="text-gray-400 text-sm">
                          {bankStyles[bank.bankType]?.description || 'Универсальный'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Simple arrow icon without container */}
                  <ArrowRightIcon className="w-6 h-6 text-blue-500 transition-transform duration-200 hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>

          {/* Trust information footer */}
          <div className="mt-10 max-w-lg mx-auto">
            <div className="flex items-start gap-4 p-5 border border-gray-100 rounded-lg bg-white shadow-sm">
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
                <ShieldCheckIcon className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Безопасность данных</h4>
                <p className="text-sm text-gray-600">
                  Ваши данные защищены. Никаких звонков. Только вы решаете, с кем оформить рассрочку.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 