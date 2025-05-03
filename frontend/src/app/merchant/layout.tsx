import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real application, this would be fetched from an auth provider
  const mockUser = {
    role: 'MERCHANT' as const,
    name: 'Алексей Предприниматель',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header userRole={mockUser.role} userName={mockUser.name} />
      <div className="flex">
        <Sidebar userRole={mockUser.role} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
} 