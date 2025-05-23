'use client';

import Link from 'next/link';
import { useState } from 'react';
import { EnvelopeIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

// Часто задаваемые вопросы
const faqItems = [
  {
    id: 'unified-qr',
    question: 'Что такое единый QR-код?',
    answer: 'Единый QR-код — это решение, которое позволяет вашим клиентам получить доступ ко всем доступным банкам и оформить рассрочку или кредит через одну ссылку. Клиент сканирует QR-код, выбирает подходящий банк и продолжает оформление без лишних действий.'
  },
  {
    id: 'qr-benefits',
    question: 'Какие преимущества даёт единый QR-код?',
    answer: 'Единый QR-код упрощает процесс оформления рассрочки: экономит время клиента и позволяет использовать одну универсальную ссылку или QR-код сразу для всех подключённых банков — на кассе, в торговой точке, в онлайн-магазине и в маркетинговых материалах.'
  },
  {
    id: 'qr-setup',
    question: 'Как подключить единый QR-код?',
    answer: 'Подключение происходит автоматически при регистрации на платформе. В разделе "QR и ссылка" в личном кабинете вы можете подключить нужные банки, а также распечатать персональный QR-код или скачать его в нужном формате для размещения в любых каналах.'
  },
  {
    id: 'payment-time',
    question: 'Как быстро я получу деньги после оплаты клиентом?',
    answer: 'Если банк подключён по автоматической интеграции — средства поступают на ваш расчётный счёт в течение одного рабочего дня. Если вы используете ручной банк, то выплаты осуществляются по вашей индивидуальной договорённости с этим банком.'
  },
  {
    id: 'available-banks',
    question: 'Какие банки поддерживаются в системе?',
    answer: 'Система поддерживает два типа банков:\n— Автоматические — работают через прямую интеграцию, оформление и выплаты проходят онлайн.\n— Ручные — вы можете добавить любой банк, с которым уже работаете. В этом случае оформление происходит по вашей ссылке.'
  },
  {
    id: 'about-us',
    question: 'Кто мы такие?',
    answer: 'Pluse.kz — это финтех-продукт, разработанный IT-компанией ТОО "Persons" (БИН 220640014105). Мы являемся резидентом Astana Hub и создаём технологические решения, которые помогают предпринимателям.'
  }
];

export default function HelpCenter() {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const toggleQuestion = (id: string) => {
    if (expandedQuestion === id) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(id);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <div className="flex items-center">
              <Link href="/merchant/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span className="text-sm font-medium">Вернуться в дашборд</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* FAQ Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Центр поддержки</h1>
          <p className="text-gray-600 mb-10">
            Ответы на часто задаваемые вопросы о платформе Pluse
          </p>
          
          {/* FAQ Accordion */}
          <div className="space-y-4 mb-10">
            {faqItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleQuestion(item.id)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <h3 className="font-medium text-gray-900">{item.question}</h3>
                  {expandedQuestion === item.id ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {expandedQuestion === item.id && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-gray-600 whitespace-pre-line">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Contact Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-4">Нужна дополнительная помощь?</h3>
            <p className="text-gray-600 mb-6">
              Свяжитесь с нами по email или WhatsApp, и мы ответим на ваши вопросы в ближайшее время.
            </p>
            <div className="space-y-3">
              <a href="mailto:partner@pluse.kz" className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                partner@pluse.kz
              </a>
              <a href="https://wa.me/77778889900" className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 