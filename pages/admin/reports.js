import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ReportForm from '@/components/admin/ReportForm';

export default function AdminReportsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/reports');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setItems(data);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSaved = async () => {
    setCreating(false);
    setEditing(null);
    await load();
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this report?')) return;
    const res = await fetch(`/api/admin/reports/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Delete failed');
    } else {
      await load();
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <button onClick={() => { setCreating(true); setEditing(null); }} className="px-4 py-2 bg-blue-600 text-white rounded-md">Add Report</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !creating && !editing && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-sm text-gray-700">{r.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{r.title}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 capitalize">{r.type}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{r.year || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{r.size || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{r.display_order}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{r.is_active ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-sm text-right space-x-2">
                    <button onClick={() => { setEditing(r); setCreating(false); }} className="px-3 py-1 border rounded">Edit</button>
                    <button onClick={() => onDelete(r.id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(creating || editing) && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-300">
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Report' : 'Add Report'}</h2>
          <ReportForm
            initial={editing}
            onCancel={() => { setCreating(false); setEditing(null); }}
            onSaved={onSaved}
          />
        </div>
      )}
    </AdminLayout>
  );
}
