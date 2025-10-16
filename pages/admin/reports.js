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

  // Initialize jQuery DataTable when items are loaded and not in form mode
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window;
    const $ = w.$ || w.jQuery;
    if (!$) return; // jQuery not yet loaded
    if (!items || items.length === 0) return; // nothing to render
    if (creating || editing) return; // avoid when form open

    const selector = '#reports-table';
    try {
      if ($.fn.dataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
      }
      $(selector).DataTable({
        paging: true,
        searching: true,
        info: true,
        order: [[0, 'desc']],
        autoWidth: false,
        responsive: true,
        columnDefs: [
          { orderable: false, targets: -1 }, // actions column
        ],
      });
    } catch (e) {
      // swallow init errors gracefully
      console.error('DataTable init failed', e);
    }

    return () => {
      if ($ && $.fn.dataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
      }
    };
  }, [items, creating, editing]);

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
        <button
          onClick={() => { setCreating(true); setEditing(null); }}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          aria-label="Add report"
          title="Add report"
        >
          <span aria-hidden="true" className="material-symbols-outlined">add</span>
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !creating && !editing && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table id="reports-table" className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Year</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Size</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Order</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Active</th>
                <th className="px-4 py-2 w-28"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{r.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 w-1/2 overflow-hidden text-ellipsis whitespace-nowrap">{r.title}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 capitalize whitespace-nowrap">{r.type}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{r.year || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{r.size || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{r.display_order}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{r.is_active ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-sm text-right space-x-2 w-28 whitespace-nowrap">
                    <button
                      onClick={() => { setEditing(r); setCreating(false); }}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border hover:bg-gray-50 cursor-pointer"
                      aria-label="Edit report"
                      title="Edit report"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(r.id)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border text-red-600 hover:bg-red-50 cursor-pointer"
                      aria-label="Delete report"
                      title="Delete report"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined">delete</span>
                    </button>
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
