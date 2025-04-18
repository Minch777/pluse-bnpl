'use client';

import Card from '@/components/Card';
import Button from '@/components/Button';
import { 
  ArrowDownTrayIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

export default function Materials() {
  return (
    <div className="space-y-6 mt-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Материалы</h1>
        <p className="mt-2 text-gray-600">
          Маркетинговые материалы для вашего бизнеса
        </p>
      </div>

      {/* Инструкции */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Инструкции</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    PDF-инструкция по оформлению заявки
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Подробное руководство по работе с заявками
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {}}
                className="inline-flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Скачать PDF
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <VideoCameraIcon className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Видеоинструкция по работе с личным кабинетом
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Обзор основных функций и возможностей
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {}}
                className="inline-flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Смотреть
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Маркетинговые материалы */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Маркетинговые материалы</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PhotoIcon className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Стикеры и наклейки для кассы
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Готовые макеты для печати (А4, А5, А6)
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {}}
                className="inline-flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Скачать ZIP
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PhotoIcon className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Баннеры для соцсетей
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Instagram, Facebook, ВКонтакте
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {}}
                className="inline-flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Скачать ZIP
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PhotoIcon className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Рекламные материалы для печати
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Плакаты, листовки, буклеты
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {}}
                className="inline-flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Скачать ZIP
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PhotoIcon className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Логотипы и фирменный стиль
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Векторные файлы в разных форматах
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {}}
                className="inline-flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Скачать ZIP
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Обучающие материалы */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Обучающие материалы</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <QuestionMarkCircleIcon className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Частые вопросы клиентов
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Готовые ответы на популярные вопросы
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {}}
                className="inline-flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Скачать PDF
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Скрипты общения с клиентами
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Примеры диалогов и рекомендации
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {}}
                className="inline-flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Скачать PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 