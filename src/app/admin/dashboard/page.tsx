import Card from '@/components/Card';

export default function AdminDashboard() {
  // Mock data for the dashboard
  const stats = [
    { label: 'Всего предпринимателей', value: '248', change: '+12%', changeType: 'positive' },
    { label: 'Всего заявок', value: '1,854', change: '+18%', changeType: 'positive' },
    { label: 'Одобрено', value: '1,243', change: '+15%', changeType: 'positive' },
    { label: 'Отказано', value: '428', change: '+4%', changeType: 'negative' },
  ];
  
  const topMerchants = [
    { name: 'ИП "Электроника"', applications: 245, amount: '12,560,000 ₸', location: 'Алматы' },
    { name: 'ТОО "МебельПлюс"', applications: 187, amount: '8,940,000 ₸', location: 'Астана' },
    { name: 'ИП Сагитов', applications: 156, amount: '7,230,000 ₸', location: 'Шымкент' },
    { name: 'ТОО "АвтоТехСервис"', applications: 124, amount: '6,180,000 ₸', location: 'Алматы' },
    { name: 'ИП "Модный Дом"', applications: 112, amount: '5,640,000 ₸', location: 'Караганда' },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Панель администратора</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Обзор ключевых показателей платформы
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <div className={`mt-1 text-sm font-medium ${
              stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {stat.change}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Ежемесячные заявки">
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              График ежемесячных заявок будет отображен здесь
            </p>
          </div>
        </Card>
        
        <Card title="Распределение по статусам">
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Диаграмма распределения заявок по статусам будет отображена здесь
            </p>
          </div>
        </Card>
      </div>
      
      <Card title="Топ предпринимателей">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Локация
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Заявки
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Общая сумма
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {topMerchants.map((merchant) => (
                <tr key={merchant.name}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                    {merchant.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {merchant.location}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {merchant.applications}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {merchant.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Распределение по локациям">
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Диаграмма распределения предпринимателей по городам будет отображена здесь
            </p>
          </div>
        </Card>
        
        <Card title="Активность платформы">
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              График активности платформы будет отображен здесь
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
} 