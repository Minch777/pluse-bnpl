'use client';

import { useState } from 'react';
import { 
  ArrowDownTrayIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  CodeBracketIcon,
  InformationCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function Materials() {
  const [activeTab, setActiveTab] = useState<'marketing' | 'tech'>('marketing');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'marketing': true,
    'api': true
  });

  const toggleSection = (section: string) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Упрощенный заголовок */}
      <header className="pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Материалы</h1>
        <p className="text-lg text-gray-600">
          Маркетинговые материалы и техническая документация для вашего бизнеса
        </p>
      </header>

      {/* Табы для выбора категорий */}
      <div className="flex mb-8 bg-slate-50 rounded-lg p-1 max-w-fit">
        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'marketing' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Маркетинг
        </button>
        <button
          onClick={() => setActiveTab('tech')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'tech' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Техническая документация
        </button>
      </div>

      {/* Информационный блок */}
      <div className="flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-lg p-4 mb-8 max-w-2xl">
        <InformationCircleIcon className="h-6 w-6 text-sky-500 mt-0.5" />
        <div className="text-gray-700 text-sm">
          Используйте готовые маркетинговые материалы для продвижения рассрочек и кредитов в вашем бизнесе. Вы можете скачать все необходимые ресурсы и использовать их на своём сайте и в социальных сетях.
        </div>
      </div>

      {activeTab === 'marketing' && (
        <div className="space-y-8">
          {/* Маркетинговые материалы */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div 
              className="px-6 py-5 flex items-center justify-between cursor-pointer border-b border-slate-200 bg-slate-50"
              onClick={() => toggleSection('marketing')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                  <PhotoIcon className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-slate-800">Маркетинговые материалы</h2>
                  <p className="text-sm text-slate-500">Баннеры, логотипы и рекламные материалы</p>
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-slate-100">
                {expanded['marketing'] ? (
                  <ChevronUpIcon className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-slate-500" />
                )}
              </button>
            </div>
            
            {expanded['marketing'] && (
              <div className="p-6">
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Название
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Описание
                        </th>
                        <th scope="col" className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                          Скачать
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          Баннеры для сайта
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          Готовые баннеры разных размеров для размещения на сайте
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg text-sm font-medium transition-colors">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            ZIP
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          Стикеры и наклейки
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          Наклейки для точек продаж и платежных терминалов
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg text-sm font-medium transition-colors">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            PDF
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          Баннеры для соцсетей
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          Материалы для Instagram, Facebook и других платформ
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg text-sm font-medium transition-colors">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            ZIP
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Обучающие видео */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div 
              className="px-6 py-5 flex items-center justify-between cursor-pointer border-b border-slate-200 bg-slate-50"
              onClick={() => toggleSection('videos')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                  <VideoCameraIcon className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-slate-800">Обучающие видео</h2>
                  <p className="text-sm text-slate-500">Видеоинструкции по использованию системы</p>
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-slate-100">
                {expanded['videos'] ? (
                  <ChevronUpIcon className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-slate-500" />
                )}
              </button>
            </div>
            
            {expanded['videos'] && (
              <div className="p-6">
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Название
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Описание
                        </th>
                        <th scope="col" className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                          Длительность
                        </th>
                        <th scope="col" className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                          Смотреть
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          Как обрабатывать заявки
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          Пошаговый процесс оформления заявки на рассрочку
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                          12:45
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg text-sm font-medium transition-colors">
                            Смотреть
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          Интеграция на сайт
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          Как быстро добавить виджет рассрочки на ваш сайт
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                          8:30
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg text-sm font-medium transition-colors">
                            Смотреть
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tech' && (
        <div className="space-y-8">
          {/* API Документация */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div 
              className="px-6 py-5 flex items-center justify-between cursor-pointer border-b border-slate-200 bg-slate-50"
              onClick={() => toggleSection('api')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                  <CodeBracketIcon className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-slate-800">API Документация</h2>
                  <p className="text-sm text-slate-500">Техническая информация для разработчиков</p>
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-slate-100">
                {expanded['api'] ? (
                  <ChevronUpIcon className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-slate-500" />
                )}
              </button>
            </div>
            
            {expanded['api'] && (
              <div className="p-6">
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Название
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Описание
                        </th>
                        <th scope="col" className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                          Действие
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          API Документация
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          Полное описание эндпоинтов и методов работы с API
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg text-sm font-medium transition-colors">
                            Открыть
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          SDK для разработчиков
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          Готовые библиотеки для PHP, JavaScript, Python
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg text-sm font-medium transition-colors">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            Скачать
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          Тестовая среда
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          Руководство по использованию тестового режима
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg text-sm font-medium transition-colors">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            PDF
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Руководства */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div 
              className="px-6 py-5 flex items-center justify-between cursor-pointer border-b border-slate-200 bg-slate-50"
              onClick={() => toggleSection('guides')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-slate-800">Руководства</h2>
                  <p className="text-sm text-slate-500">Инструкции и руководства по интеграции</p>
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-slate-100">
                {expanded['guides'] ? (
                  <ChevronUpIcon className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-slate-500" />
                )}
              </button>
            </div>
            
            {expanded['guides'] && (
              <div className="p-6">
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Название
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Описание
                        </th>
                        <th scope="col" className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                          Скачать
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          Руководство по BNPL
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          Пошаговая инструкция по внедрению в вашем бизнесе
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg text-sm font-medium transition-colors">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            PDF
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          Интеграция с CMS
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          Подробное описание API и готовые решения
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg text-sm font-medium transition-colors">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            PDF
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}