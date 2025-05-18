'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  QrCodeIcon,
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  LinkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Components
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';

type Store = {
  id: string;
  name: string;
  slug: string;
  applications: number;
  isMain: boolean;
};

export default function StoresSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreSlug, setNewStoreSlug] = useState('');
  
  // Если только одна точка, перенаправляем на страницу ссылки
  const router = useRouter();
  
  useEffect(() => {
    const fetchStores = async () => {
      // Имитируем загрузку данных
      setTimeout(() => {
        // Моковые данные
        const mockStores: Store[] = [
          {
            id: '1',
            name: 'Основной магазин',
            slug: 'main-store',
            applications: 45,
            isMain: true
          },
          {
            id: '2',
            name: 'Филиал на Абая',
            slug: 'abay-branch',
            applications: 28,
            isMain: false
          }
        ];
        
        setStores(mockStores);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchStores();
  }, [router]);
  
  const addStore = () => {
    if (!newStoreName.trim()) return;
    
    const newStore: Store = {
      id: `${stores.length + 1}`,
      name: newStoreName,
      slug: newStoreSlug || newStoreName.toLowerCase().replace(/\s+/g, '-'),
      applications: 0,
      isMain: false
    };
    
    setStores([...stores, newStore]);
    setNewStoreName('');
    setNewStoreSlug('');
    setIsAddingStore(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="secondary"
            className="mr-4"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-2xl font-bold">Управление точками продаж</h1>
        </div>
        
        <Button 
          onClick={() => setIsAddingStore(true)}
          disabled={isAddingStore}
        >
          <BuildingStorefrontIcon className="h-5 w-5 mr-2" />
          Добавить точку
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {isAddingStore && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Новая точка продаж</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название точки
                    </label>
                    <input
                      type="text"
                      value={newStoreName}
                      onChange={(e) => setNewStoreName(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Например: Филиал на Достык"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug для ссылки (опционально)
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-500 bg-gray-100 p-2 rounded-l-md border border-r-0">
                        {typeof window !== 'undefined' ? window.location.origin : ''}/public/
                      </span>
                      <input
                        type="text"
                        value={newStoreSlug}
                        onChange={(e) => setNewStoreSlug(e.target.value)}
                        className="flex-1 p-2 border rounded-r-md"
                        placeholder="my-store"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Используйте латинские буквы, цифры и дефисы. Если не указано, будет сгенерировано из названия.
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      variant="secondary"
                      onClick={() => setIsAddingStore(false)}
                    >
                      Отмена
                    </Button>
                    <Button
                      onClick={addStore}
                      disabled={!newStoreName.trim()}
                    >
                      Добавить точку
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stores.map((store) => (
              <Card key={store.id}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{store.name}</h3>
                      {store.isMain && (
                        <Badge color="blue" className="mt-1">
                          Основная точка
                        </Badge>
                      )}
                    </div>
                    <Link
                      href={`/merchant/link/${store.slug}`}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <QrCodeIcon className="h-5 w-5" />
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="flex items-center truncate max-w-full">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        <span className="truncate">
                          {typeof window !== 'undefined' ? window.location.origin : ''}/public/{store.slug}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <span>{store.applications} заявок</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 