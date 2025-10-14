import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import PmQuoteForm from '@/components/admin/PmQuoteForm';

export default function AdminPmQuotesPage() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token) router.push('/admin/login');
  }, [router]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900">PM Quote</h1>
          <p className="text-gray-600 mt-1">Add, edit, or remove the Prime Minister quote displayed on the site.</p>
        </div>
        <PmQuoteForm />
      </div>
    </AdminLayout>
  );
}
