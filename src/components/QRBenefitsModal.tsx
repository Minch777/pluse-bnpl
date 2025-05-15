import React from 'react';
import { XMarkIcon, SparklesIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function QRBenefitsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl p-0 m-4 flex flex-col max-h-[90vh] animate-fadeIn" onClick={e => e.stopPropagation()}>
        <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Закрыть">
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-8 rounded-t-xl flex-shrink-0">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">В одном QR — все банки</h2>
          <p className="text-white/90 text-lg">Один QR-код для всех предложений банков — удобно для клиентов и выгодно для бизнеса</p>
        </div>
        <div className="p-8 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-sky-50 p-6 rounded-xl border border-sky-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-sky-600" />
                Удобство для клиентов
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-sky-100 rounded-full mt-0.5">
                    <CheckIcon className="h-4 w-4 text-sky-600" />
                  </div>
                  <p className="text-gray-700">Все предложения банков в одном QR — не нужно искать разные ссылки</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-sky-100 rounded-full mt-0.5">
                    <CheckIcon className="h-4 w-4 text-sky-600" />
                  </div>
                  <p className="text-gray-700">Легко сравнить условия и выбрать лучший вариант</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-sky-100 rounded-full mt-0.5">
                    <CheckIcon className="h-4 w-4 text-sky-600" />
                  </div>
                  <p className="text-gray-700">Нет необходимости сканировать несколько QR-кодов и заполнять много анкет</p>
                </li>
              </ul>
            </div>
            <div className="bg-sky-50 p-6 rounded-xl border border-sky-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-sky-600" />
                Преимущества для бизнеса
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-sky-100 rounded-full mt-0.5">
                    <CheckIcon className="h-4 w-4 text-sky-600" />
                  </div>
                  <p className="text-gray-700">Больше шансов на одобрение — если один банк отказал, клиент выберет другой</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-sky-100 rounded-full mt-0.5">
                    <CheckIcon className="h-4 w-4 text-sky-600" />
                  </div>
                  <p className="text-gray-700">Выше конверсия за счёт большего выбора</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-sky-100 rounded-full mt-0.5">
                    <CheckIcon className="h-4 w-4 text-sky-600" />
                  </div>
                  <p className="text-gray-700">Один QR-код для всех маркетинговых материалов</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <button onClick={onClose} className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-sm transition-colors">
              Понятно, спасибо!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 