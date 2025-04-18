import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-blue-500">Pluse BNPL</h1>
          </Link>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Сервис рассрочки для предпринимателей
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700">
          {children}
        </div>
      </div>
    </div>
  );
} 