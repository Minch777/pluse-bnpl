'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Card from '@/components/Card';

type AnalyticBlock = {
  title: string;
  merchants: {
    name: string;
    value: number;
    change?: number;
  }[];
};

const analyticBlocks: AnalyticBlock[] = [
  {
    title: 'ТОП-5 по заявкам',
    merchants: [
      { name: 'XStore', value: 150, change: 27 },
      { name: 'TechnoMart', value: 120, change: 15 },
      { name: 'PlusePhone', value: 84, change: -35 },
      { name: 'GadgetPro', value: 75, change: 12 },
      { name: 'SmartShop', value: 65, change: 8 },
    ],
  },
  {
    title: 'ТОП-5 по доходу',
    merchants: [
      { name: 'XStore', value: 175000, change: 27 },
      { name: 'TechnoMart', value: 145000, change: 15 },
      { name: 'GadgetPro', value: 95000, change: 12 },
      { name: 'PlusePhone', value: 85000, change: -35 },
      { name: 'SmartShop', value: 78000, change: 8 },
    ],
  },
  {
    title: 'Снижение активности',
    merchants: [
      { name: 'PlusePhone', value: -35 },
      { name: 'DigiWorld', value: -28 },
      { name: 'TechZone', value: -15 },
      { name: 'ElectroHub', value: -12 },
      { name: 'iCenter', value: -8 },
    ],
  },
  {
    title: 'Рост активности',
    merchants: [
      { name: 'XStore', value: 27 },
      { name: 'TechnoMart', value: 15 },
      { name: 'GadgetPro', value: 12 },
      { name: 'SmartShop', value: 8 },
      { name: 'MediaMarket', value: 5 },
    ],
  },
];

export default function MerchantAnalytics() {
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>(
    Object.fromEntries(analyticBlocks.map(block => [block.title, true]))
  );

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(Math.abs(amount));
  };

  const toggleBlock = (title: string) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {analyticBlocks.map((block) => (
        <Card key={block.title} className="overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleBlock(block.title)}
          >
            <h3 className="font-medium text-gray-900">{block.title}</h3>
            {expandedBlocks[block.title] ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {expandedBlocks[block.title] && (
            <div className="border-t border-gray-200">
              <div className="divide-y divide-gray-200">
                {block.merchants.map((merchant, index) => (
                  <div 
                    key={merchant.name}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">
                        {index + 1}. {merchant.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">
                        {block.title.includes('доходу') ? `${formatAmount(merchant.value)} ₸` : formatAmount(merchant.value)}
                        {block.title.includes('активности') ? '%' : ''}
                      </span>
                      {merchant.change && (
                        <span className={`text-sm ${merchant.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {merchant.change >= 0 ? '📈' : '📉'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
} 