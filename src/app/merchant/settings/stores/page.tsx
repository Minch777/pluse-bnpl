'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon, 
  UserPlusIcon, 
  LinkIcon, 
  QrCodeIcon,
  ArrowLeftIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

type Store = {
  id: string;
  name: string;
  slug: string;
  users: number;
  applications: number;
};

// Mock data - в реальном приложении это будет приходить с бэкенда
const mockStores: Store[] = [
  {
    id: '1',
    name: 'Главный магазин',
    slug: 'store123',
    users: 3,
    applications: 45,
  },
  {
    id: '2',
    name: 'Онлайн-магазин',
    slug: 'store456',
    users: 2,
    applications: 28,
  },
];

export default function StoresSettings() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreSlug, setNewStoreSlug] = useState('');

  // Если только одна точка, перенаправляем на страницу ссылки
  useEffect(() => {
    if (stores.length === 1) {
      router.push('/merchant/link');
    }
  }, [stores.length, router]);

  const handleAddStore = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении здесь будет API-запрос
    const newStore = {
      id: String(stores.length + 1),
      name: newStoreName,
      slug: newStoreSlug,
      users: 0,
      applications: 0,
    };
    setStores([...stores, newStore]);
    setNewStoreName('');
    setNewStoreSlug('');
    setIsAddingStore(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/merchant/link')}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Точки продаж</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Управляйте точками продаж и сотрудниками
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsAddingStore(true)}
              className="inline-flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Добавить точку
            </Button>
          </div>

          {/* Add Store Form */}
          {isAddingStore && (
            <Card>
              <form onSubmit={handleAddStore} className="space-y-4">
                <div>
                  <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                    Название точки
                  </label>
                  <input
                    type="text"
                    id="storeName"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Например: Онлайн-магазин"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="storeSlug" className="block text-sm font-medium text-gray-700">
                    Уникальный идентификатор
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      {typeof window !== 'undefined' ? window.location.origin : ''}/apply/
                    </span>
                    <input
                      type="text"
                      id="storeSlug"
                      value={newStoreSlug}
                      onChange={(e) => setNewStoreSlug(e.target.value)}
                      className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="online-store"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    onClick={() => setIsAddingStore(false)}
                    variant="secondary"
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                  >
                    Добавить
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Stores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <Card key={store.id}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BuildingStorefrontIcon className="h-6 w-6 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900">{store.name}</h3>
                    </div>
                    <Link
                      href={`/merchant/settings/stores/${store.id}/users`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <UserPlusIcon className="h-5 w-5" />
                    </Link>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      <span className="truncate">
                        {typeof window !== 'undefined' ? window.location.origin : ''}/apply/{store.slug}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <QrCodeIcon className="h-4 w-4 mr-2" />
                      <span>QR-код</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{store.users} сотрудников</span>
                    <span>{store.applications} заявок</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 