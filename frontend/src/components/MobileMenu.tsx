'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  LinkIcon, 
  DocumentCheckIcon, 
  PhotoIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const merchantLinks = [
  { href: '/merchant/dashboard', label: 'Показатели', icon: HomeIcon },
  { href: '/merchant/applications', label: 'Заявки', icon: DocumentTextIcon },
  { href: '/merchant/link', label: 'Ссылка', icon: LinkIcon },
  { href: '/merchant/terms', label: 'Условия', icon: DocumentCheckIcon },
  { href: '/merchant/materials', label: 'Материалы', icon: PhotoIcon },
  { href: '/merchant/settings', label: 'Настройки', icon: Cog6ToothIcon },
];

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative w-full">
              <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                      Меню
                    </Dialog.Title>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500"
                        onClick={onClose}
                      >
                        <span className="sr-only">Закрыть меню</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  <nav className="space-y-1">
                    {merchantLinks.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group flex items-center px-3 py-3 text-base font-medium rounded-md ${
                            isActive
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                          onClick={onClose}
                        >
                          <item.icon
                            className={`mr-4 h-6 w-6 flex-shrink-0 ${
                              isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                            }`}
                            aria-hidden="true"
                          />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 