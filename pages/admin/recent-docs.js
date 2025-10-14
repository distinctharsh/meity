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

  const handleAdd = () => {
    setEditingDoc(null);
    setShowForm(true);
  };

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setShowForm(true);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Recent Documents</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Document
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <RecentDocForm
                doc={editingDoc}
                onSubmit={handleFormSubmit}
                onCancel={() => { setShowForm(false); setEditingDoc(null); }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500">Add your first document to get started.</p>
            </div>
          ) : (
            docs.map((d) => (
              <div key={d.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">{d.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${d.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {d.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-3">{d.description}</p>
                {d.link_url && (
                  <a href={d.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">Open Link →</a>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleToggleActive(d.id, d.is_active)}
                    className={`flex-1 px-3 py-1 text-xs font-medium rounded ${d.is_active ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                  >
                    {d.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleEdit(d)} className="flex-1 bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded hover:bg-blue-200">Edit</button>
                  <button onClick={() => handleDelete(d.id)} className="flex-1 bg-red-100 text-red-700 text-xs px-3 py-1 rounded hover:bg-red-200">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
