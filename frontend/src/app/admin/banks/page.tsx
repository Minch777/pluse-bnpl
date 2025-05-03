'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import BankProducts from '@/components/BankProducts';

type Bank = {
  id: string;
  name: string;
  activeProducts: number;
};

const mockBanks: Bank[] = [
  { id: '1', name: 'RBK Bank', activeProducts: 2 },
];

export default function BanksPage() {
  const [banks, setBanks] = useState<Bank[]>(mockBanks);
  const [newBankName, setNewBankName] = useState('');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddBank = () => {
    if (!newBankName.trim()) return;

    const newBank: Bank = {
      id: Date.now().toString(),
      name: newBankName.trim(),
      activeProducts: 0,
    };

    setBanks([...banks, newBank]);
    setNewBankName('');
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Банки</h1>
          <p className="mt-1 text-sm text-gray-500">
            Управление банками-партнёрами и условиями продуктов
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Добавить банк
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить новый банк</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <Input
                placeholder="Название банка"
                value={newBankName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBankName(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={handleAddBank}>Добавить</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Название банка</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Активных продуктов</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {banks.map((bank) => (
                <tr key={bank.id}>
                  <td className="py-4 px-4 text-sm text-gray-900">{bank.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{bank.activeProducts}</td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedBank(bank)}
                    >
                      Настроить
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedBank && (
        <BankProducts
          bank={selectedBank}
          onClose={() => setSelectedBank(null)}
        />
      )}
    </div>
  );
} 