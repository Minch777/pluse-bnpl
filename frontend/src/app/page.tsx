import Link from 'next/link';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900">
              Рассрочка для вашего бизнеса
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto">
              Pluse BNPL помогает предпринимателям увеличивать продажи и привлекать новых клиентов, предлагая удобные рассрочки платежей.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/login" className="btn-primary text-lg px-8 py-3 rounded-md">
                Войти в систему
              </Link>
              <a href="#benefits" className="btn-secondary text-lg px-8 py-3 rounded-md">
                Узнать больше
              </a>
            </div>
          </div>
        </section>
        
        {/* Benefits section */}
        <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Преимущества Pluse BNPL
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Увеличение продаж</h3>
                <p className="text-slate-600">
                  Предложите клиентам удобный способ оплаты и увеличьте средний чек
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Безопасность</h3>
                <p className="text-slate-600">
                  Мы берем на себя все риски и гарантируем выплаты
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Быстрая интеграция</h3>
                <p className="text-slate-600">
                  Подключение занимает всего несколько минут
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Готовы начать принимать платежи в рассрочку?
            </h2>
            <p className="mt-4 text-xl text-slate-600">
              Подключите Pluse BNPL к своему бизнесу и увеличьте продажи уже сегодня.
            </p>
            <div className="mt-8">
              <Link href="/auth/login" className="btn-primary text-lg px-8 py-3 rounded-md">
                Начать сейчас
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold text-blue-500">Pluse BNPL</h2>
              <p className="mt-2 text-sm text-slate-500">
                Сервис рассрочки для предпринимателей
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Компания</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#" className="text-slate-500 hover:text-slate-900 text-sm">О нас</a></li>
                  <li><a href="#" className="text-slate-500 hover:text-slate-900 text-sm">Блог</a></li>
                  <li><a href="#" className="text-slate-500 hover:text-slate-900 text-sm">Контакты</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Правовая информация</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#" className="text-slate-500 hover:text-slate-900 text-sm">Условия использования</a></li>
                  <li><a href="#" className="text-slate-500 hover:text-slate-900 text-sm">Политика конфиденциальности</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Pluse BNPL. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
