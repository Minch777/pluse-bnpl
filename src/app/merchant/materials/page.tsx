'use client';

import { 
  ArrowDownTrayIcon,
  DocumentIcon,
  PhotoIcon,
  QrCodeIcon,
  PaintBrushIcon,
  PresentationChartBarIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function Materials() {
  const marketingMaterials = [
    {
      id: 1,
      name: 'Гайд по продажам',
      description: 'Инструкция для менеджеров по продажам рассрочки',
      type: 'document',
      format: '.pdf',
      size: '2.5 MB',
      icon: <DocumentIcon className="w-5 h-5 text-sky-600" />,
      downloadUrl: '/materials/sales-guide.pdf',
      category: 'staff'
    },
    {
      id: 2,
      name: 'Материалы для соцсетей',
      description: 'Готовые посты, stories и баннеры для социальных сетей',
      type: 'image',
      format: '.png, .psd',
      size: '25.8 MB',
      icon: <PaintBrushIcon className="w-5 h-5 text-sky-600" />,
      downloadUrl: '/materials/social-kit.zip',
      category: 'marketing'
    },
    {
      id: 3,
      name: 'Баннеры для сайта',
      description: 'Готовые баннеры для размещения на вашем сайте',
      type: 'image',
      format: '.png, .psd',
      size: '15.8 MB',
      icon: <PaintBrushIcon className="w-5 h-5 text-sky-600" />,
      downloadUrl: '/materials/web-banners.zip',
      category: 'marketing'
    },
    {
      id: 4,
      name: 'Скрипты разговора',
      description: 'Готовые скрипты общения с клиентами о рассрочке',
      type: 'document',
      format: '.pdf',
      size: '1.2 MB',
      icon: <ChatBubbleLeftRightIcon className="w-5 h-5 text-sky-600" />,
      downloadUrl: '/materials/scripts.pdf',
      category: 'staff'
    },
    {
      id: 5,
      name: 'Презентация для клиентов',
      description: 'Презентация преимуществ рассрочки для ваших клиентов',
      type: 'presentation',
      format: '.pdf, .pptx',
      size: '5.8 MB',
      icon: <PresentationChartBarIcon className="w-5 h-5 text-sky-600" />,
      downloadUrl: '/materials/presentation.zip',
      category: 'marketing'
    },
    {
      id: 6,
      name: 'POS материалы',
      description: 'Материалы для оформления точек продаж',
      type: 'image',
      format: '.pdf, .ai',
      size: '18.5 MB',
      icon: <PhotoIcon className="w-5 h-5 text-sky-600" />,
      downloadUrl: '/materials/pos-materials.zip',
      category: 'marketing'
    },
    {
      id: 7,
      name: 'QR-коды и стикеры',
      description: 'Набор QR-кодов и стикеров для оффлайн точек',
      type: 'image',
      format: '.png, .pdf',
      size: '8.2 MB',
      icon: <QrCodeIcon className="w-5 h-5 text-sky-600" />,
      downloadUrl: '/materials/qr-stickers.zip',
      category: 'marketing'
    },
    {
      id: 8,
      name: 'Обучающие материалы',
      description: 'Инструкции для обучения сотрудников работе с рассрочкой',
      type: 'document',
      format: '.pdf',
      size: '3.8 MB',
      icon: <DocumentTextIcon className="w-5 h-5 text-sky-600" />,
      downloadUrl: '/materials/training.pdf',
      category: 'staff'
    }
  ];

  const categories = {
    marketing: 'Маркетинговые материалы',
    staff: 'Материалы для сотрудников'
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <header className="pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Маркетинговые материалы</h1>
        <p className="text-lg text-gray-600">
          Готовые материалы для продвижения рассрочки в вашем бизнесе
        </p>
      </header>

      {/* Categories */}
      {Object.entries(categories).map(([categoryKey, categoryName]) => (
        <div key={categoryKey} className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">{categoryName}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {marketingMaterials
              .filter(material => material.category === categoryKey)
              .map((material) => (
              <div 
                key={material.id}
                  className="group bg-gradient-to-br from-white to-sky-50/30 rounded-xl border border-gray-100 hover:border-sky-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg border border-gray-100 group-hover:border-sky-100 group-hover:bg-sky-50/50 transition-colors">
                    {material.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      {material.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {material.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="font-medium">{material.format}</span>
                      <span>•</span>
                      <span>{material.size}</span>
                    </div>
                  </div>

                  <a
                    href={material.downloadUrl}
                    download
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span>Скачать</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}