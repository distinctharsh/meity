import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import RecentDocForm from '../../components/admin/RecentDocForm';

export default function RecentDocsAdmin() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/admin/recent-docs');
      if (res.ok) {
        const data = await res.json();
        setDocs(data);
      }
    } catch (e) {
      console.error('Failed to fetch recent docs', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this document?')) return;
    try {
      const res = await fetch(`/api/admin/recent-docs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocs((prev) => prev.filter((d) => d.id !== id));
      } else {
        alert('Failed to delete');
      }
    } catch (e) {
      console.error('Delete error', e);
      alert('Failed to delete');
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      const res = await fetch(`/api/admin/recent-docs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (res.ok) fetchDocs();
      else alert('Failed to update status');
    } catch (e) {
      console.error('Toggle error', e);
      alert('Failed to update status');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const url = editingDoc ? `/api/admin/recent-docs/${editingDoc.id}` : '/api/admin/recent-docs';
      const method = editingDoc ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setEditingDoc(null);
        fetchDocs();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to save');
      }
    } catch (e) {
      console.error('Save error', e);
      alert('Failed to save');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Recent Documents</h1>
          <button
            onClick={() => { setEditingDoc(null); setShowForm(!showForm); }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            aria-label={showForm ? 'Cancel' : 'Add Document'}
            title={showForm ? 'Cancel' : 'Add Document'}
          >
            <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-4 border border-gray-300 mb-6">
            <h2 className="text-lg font-semibold mb-4">{editingDoc ? 'Edit Document' : 'Add New Document'}</h2>
            <RecentDocForm
              doc={editingDoc}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingDoc(null);
              }}
            />
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {docs.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                    {doc.description && <div className="text-sm text-gray-500 mt-1">{doc.description}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <a 
                      href={doc.link_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {doc.link_url}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        doc.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {doc.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleToggleActive(doc.id, doc.is_active)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-gray-50"
                        aria-label={doc.is_active ? 'Deactivate' : 'Activate'}
                        title={doc.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {doc.is_active ? 'toggle_off' : 'toggle_on'}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingDoc(doc);
                          setShowForm(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-blue-50"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-blue-600 text-sm">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full border text-red-600 hover:bg-red-50"
                        aria-label="Delete"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {docs.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No documents found. Click the "+" button to add a new document.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
