'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

type Term = {
  months: number;
  clientRate: number;
  platformCommission: number;
};

type Product = {
  id: string;
  name: string;
  isActive: boolean;
  terms: Term[];
};

type Bank = {
  id: string;
  name: string;
  activeProducts: number;
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Кредит',
    isActive: true,
    terms: [
      { months: 3, clientRate: 25, platformCommission: 4 },
      { months: 6, clientRate: 27, platformCommission: 4 },
      { months: 12, clientRate: 29, platformCommission: 4 },
      { months: 24, clientRate: 31, platformCommission: 4 },
      { months: 36, clientRate: 33, platformCommission: 4 },
    ],
  },
  {
    id: '2',
    name: 'Рассрочка',
    isActive: true,
    terms: [
      { months: 3, clientRate: 0, platformCommission: 7 },
      { months: 6, clientRate: 0, platformCommission: 9 },
      { months: 12, clientRate: 0, platformCommission: 11 },
      { months: 24, clientRate: 0, platformCommission: 13 },
      { months: 36, clientRate: 0, platformCommission: 15 },
    ],
  },
];

type BankProductsProps = {
  bank: Bank;
  onClose: () => void;
};

export default function BankProducts({ bank, onClose }: BankProductsProps) {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const handleProductToggle = (productId: string) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return { ...product, isActive: !product.isActive };
      }
      return product;
    }));
  };

  const handleTermChange = (
    productId: string,
    termIndex: number,
    field: keyof Term,
    value: number
  ) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        const newTerms = [...product.terms];
        newTerms[termIndex] = { ...newTerms[termIndex], [field]: value };
        return { ...product, terms: newTerms };
      }
      return product;
    }));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{bank.name}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XMarkIcon className="w-5 h-5" />
        </Button>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {products.map((product) => (
          <AccordionItem key={product.id} value={product.id}>
            <Card>
              <AccordionTrigger className="px-4 py-3">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="text-sm font-medium">{product.name}</span>
                  <Switch
                    checked={product.isActive}
                    onCheckedChange={() => handleProductToggle(product.id)}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500">
                    <div>Срок</div>
                    <div>Ставка для клиента</div>
                    <div>Комиссия платформы</div>
                    <div></div>
                  </div>
                  {product.terms.map((term, index) => (
                    <div key={term.months} className="grid grid-cols-4 gap-4">
                      <div className="flex items-center text-sm text-gray-900">
                        {term.months} месяцев
                      </div>
                      <Input
                        type="number"
                        value={term.clientRate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTermChange(product.id, index, 'clientRate', Number(e.target.value))}
                        className="w-full"
                      />
                      <Input
                        type="number"
                        value={term.platformCommission}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTermChange(product.id, index, 'platformCommission', Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex items-center text-sm text-gray-500">
                        %
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
} 