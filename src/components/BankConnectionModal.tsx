'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { XMarkIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';
import { connectBank, BankType } from '@/api/services/banksService';
import { toast } from 'react-hot-toast';

type BankConnectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bank: {
    id: string;
    name: string;
    logo: string;
    bankType?: BankType;
  };
  onSave: (url: string, bankId: string) => void;
};

// Memoize the modal content to prevent unnecessary rerenders
const ModalContent = memo(({ 
  bank, 
  url, 
  setUrl, 
  isConnected, 
  isLoading,
  handleSave, 
  handleClose 
}: {
  bank: BankConnectionModalProps['bank'];
  url: string;
  setUrl: (url: string) => void;
  isConnected: boolean;
  isLoading: boolean;
  handleSave: () => void;
  handleClose: () => void;
}) => (
  <div className="p-6">
    {/* Close button - только на первом шаге */}
    {!isConnected && (
      <button 
        onClick={handleClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    )}

    {/* Header */}
    <div className="flex items-center gap-4 mb-6">
      <div className="w-28 h-10 flex items-center">
        <img src={bank.logo} alt={bank.name} className="w-full h-auto object-contain" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Подключение {bank.name}</h2>
        <p className="text-sm text-gray-500">Добавьте банк в ваш единый QR-код</p>
      </div>
    </div>

    {!isConnected ? (
      /* Step 1 - Add URL */
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center">
          <span className="text-sky-600 font-medium">1</span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900 mb-2">Добавьте ссылку для рассрочки</h3>
          <p className="text-sm text-gray-500 mb-4">
            Для этого самостоятельно свяжитесь с банком и подключите его
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="https://"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
            />
            <button
              onClick={handleSave}
              disabled={!url.trim() || isLoading}
              className="w-full h-10 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Подключение...</span>
                </>
              ) : (
                <>
              <span>Добавить ссылку</span>
              <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    ) : (
      /* Step 2 - Success State */
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900 mb-2">Банк успешно подключен</h3>
          <p className="text-sm text-gray-500 mb-4">
            Теперь {bank.name} добавится в ваш единый QR-код для оформления рассрочки
          </p>
          <button
            onClick={handleClose}
            className="w-full h-10 border border-sky-600 text-sky-600 hover:bg-sky-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            Понятно
          </button>
        </div>
      </div>
    )}

    {/* Help text */}
    <div className="mt-8 pt-6 border-t border-gray-100">
      <div className="flex items-start gap-3 text-sm text-gray-500">
        <div className="flex-shrink-0 p-1 bg-gray-50 rounded">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p>
          Если у вас возникли сложности с подключением, свяжитесь с нашей службой поддержки
        </p>
      </div>
    </div>
  </div>
));

ModalContent.displayName = 'ModalContent';

export default function BankConnectionModal({ isOpen, onClose, bank, onSave }: BankConnectionModalProps) {
  const [url, setUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const initialRenderRef = useRef(true);
  
  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen && !initialRenderRef.current) {
      // Use a delayed reset to allow animations to complete
      const timer = setTimeout(() => {
        setUrl('');
        setIsConnected(false);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    
    if (isOpen) {
      initialRenderRef.current = false;
    }
  }, [isOpen]);
  
  const handleSave = async () => {
    if (!url.trim() || !bank.bankType) return;
    
    setIsLoading(true);
    try {
      // Call API to connect the bank
      const response = await connectBank(bank.bankType, url);
      
      // If successful, update UI
    setIsConnected(true);
      onSave(url, bank.id);
      toast.success(`Банк ${bank.name} успешно подключен`);
    } catch (error) {
      console.error('Error connecting bank:', error);
      toast.error(`Ошибка при подключении банка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик для кнопки "Понятно" в успешном состоянии
  const handleSuccessClose = () => {
    // Сначала вызываем onClose для закрытия модального окна
    onClose();
    
    // Затем сбрасываем состояние после небольшой задержки (чтобы не мешать анимации закрытия)
    setTimeout(() => {
      setIsConnected(false);
      setUrl('');
    }, 300);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent 
        bank={bank}
        url={url}
        setUrl={setUrl}
        isConnected={isConnected}
        isLoading={isLoading}
        handleSave={handleSave}
        handleClose={isConnected ? handleSuccessClose : onClose}
      />
    </Modal>
  );
} 