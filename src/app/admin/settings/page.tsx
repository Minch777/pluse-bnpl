'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PlatformInfo = {
  name: string;
  supportEmail: string;
  supportPhone: string;
};

type AdminUser = {
  id: string;
  email: string;
  role: 'full_access' | 'read_only';
  addedAt: string;
};

const mockAdmins: AdminUser[] = [
  {
    id: '1',
    email: 'admin@pluse.kz',
    role: 'full_access',
    addedAt: '2024-01-15',
  },
  {
    id: '2',
    email: 'manager@pluse.kz',
    role: 'read_only',
    addedAt: '2024-02-20',
  },
];

export default function SettingsPage() {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    name: 'Pluse BNPL',
    supportEmail: 'support@pluse.kz',
    supportPhone: '+7 777 777 77 77',
  });

  const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'full_access' | 'read_only'>('read_only');

  const handlePlatformInfoChange = (field: keyof PlatformInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPlatformInfo({ ...platformInfo, [field]: e.target.value });
  };

  const handleSavePlatformInfo = () => {
    // TODO: Implement save logic
    console.log('Saving platform info:', platformInfo);
  };

  const handleAddAdmin = () => {
    if (!newAdminEmail.trim()) return;

    const newAdmin: AdminUser = {
      id: Date.now().toString(),
      email: newAdminEmail.trim(),
      role: newAdminRole,
      addedAt: new Date().toISOString().split('T')[0],
    };

    setAdmins([...admins, newAdmin]);
    setNewAdminEmail('');
    setNewAdminRole('read_only');
    setIsAddAdminOpen(false);
  };

  const handleDeleteAdmin = (adminId: string) => {
    setAdmins(admins.filter(admin => admin.id !== adminId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Настройки</h1>
        <p className="mt-1 text-sm text-gray-500">
          Управление настройками платформы и администраторами
        </p>
      </div>

      {/* Platform Information */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Информация о платформе</h2>
          <p className="mt-1 text-sm text-gray-500">
            Управляйте названием платформы и контактными данными, отображаемыми пользователям
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Название платформы</label>
              <Input
                value={platformInfo.name}
                onChange={handlePlatformInfoChange('name')}
                placeholder="Введите название платформы"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email поддержки</label>
              <Input
                value={platformInfo.supportEmail}
                onChange={handlePlatformInfoChange('supportEmail')}
                placeholder="Введите email поддержки"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Телефон поддержки</label>
              <Input
                value={platformInfo.supportPhone}
                onChange={handlePlatformInfoChange('supportPhone')}
                placeholder="Введите телефон поддержки"
                type="tel"
              />
            </div>
            <div className="pt-4">
              <Button onClick={handleSavePlatformInfo}>
                Сохранить изменения
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Admin Management */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Администраторы платформы</h2>
          <p className="mt-1 text-sm text-gray-500">
            Добавляйте, редактируйте и удаляйте администраторов, управляющих системой
          </p>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Роль</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Дата добавления</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="py-4 px-4 text-sm text-gray-900">{admin.email}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {admin.role === 'full_access' ? 'Полный доступ' : 'Только просмотр'}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{admin.addedAt}</td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Удалить
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Добавить администратора
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить администратора</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="Введите email администратора"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Роль</label>
                <Select
                  value={newAdminRole}
                  onValueChange={(value: 'full_access' | 'read_only') => setNewAdminRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_access">Полный доступ</SelectItem>
                    <SelectItem value="read_only">Только просмотр</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 flex justify-end">
                <Button onClick={handleAddAdmin}>
                  Добавить
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 