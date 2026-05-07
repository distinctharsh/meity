import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import WhatsNewForm from '../../components/admin/WhatsNewForm';

export default function WhatsNewManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/admin/whats-new');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch what\'s new items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this what\'s new item?')) return;

    try {
      const response = await fetch(`/api/admin/whats-new?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
      } else {
        alert('Failed to delete what\'s new item');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete what\'s new item');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const apiUrl = editingItem 
        ? '/api/admin/whats-new' 
        : '/api/admin/whats-new';
      
      const method = editingItem ? 'PUT' : 'POST';
      const payload = editingItem 
        ? { ...formData, id: editingItem.id }
        : formData;

      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingItem(null);
        fetchItems();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save what\'s new item');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save what\'s new item');
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      const response = await fetch('/api/admin/whats-new', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id, 
          is_active: !isActive 
        }),
      });

      if (response.ok) {
        fetchItems();
      } else {
        alert('Failed to update item status');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Failed to update item status');
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
          <h1 className="text-2xl font-bold text-gray-900">
            What&apos;s New Management
          </h1>
          <button
            onClick={() => { setEditingItem(null); setShowForm(!showForm); }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            aria-label={showForm ? 'Cancel' : 'Add Item'}
            title={showForm ? 'Cancel' : 'Add Item'}
          >
            <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-4 border border-gray-300 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit What\'s New Item' : 'Add New What\'s New Item'}
            </h2>
            <WhatsNewForm
              item={editingItem}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No what&apos;s new items found. Click the "+" button to add a new item.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.type === 'pdf' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.type === 'pdf' ? '📄 PDF' : '🔗 Link'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {item.type === 'pdf' ? (
                            <a
                              href={item.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <span className="mr-2">📄</span>
                              View PDF
                            </a>
                          ) : (
                            <a
                              href={item.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center truncate max-w-xs"
                              title={item.external_url}
                            >
                              <span className="mr-2">🔗</span>
                              {item.external_url}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => toggleActive(item.id, item.is_active)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-gray-50"
                            aria-label={item.is_active ? 'Deactivate' : 'Activate'}
                            title={item.is_active ? 'Deactivate' : 'Activate'}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {item.is_active ? 'toggle_off' : 'toggle_on'}
                            </span>
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-blue-50"
                            aria-label="Edit"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-blue-600 text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border text-red-600 hover:bg-red-50"
                            aria-label="Delete"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
