import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ImportantLinksForm from '../../components/admin/ImportantLinksForm';

export default function ImportantLinksManagement() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/admin/important-links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('Failed to fetch important links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingLink(null);
    setShowForm(true);
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this important link?')) return;

    try {
      const response = await fetch(`/api/admin/important-links?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setLinks(links.filter(link => link.id !== id));
      } else {
        alert('Failed to delete important link');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete important link');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const apiUrl = editingLink 
        ? '/api/admin/important-links' 
        : '/api/admin/important-links';
      
      const method = editingLink ? 'PUT' : 'POST';
      const payload = editingLink 
        ? { ...formData, id: editingLink.id }
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
        setEditingLink(null);
        fetchLinks();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save important link');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save important link');
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      const response = await fetch('/api/admin/important-links', {
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
        fetchLinks();
      } else {
        alert('Failed to update link status');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Failed to update link status');
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
            Important Links Management
          </h1>
          <button
            onClick={() => { setEditingLink(null); setShowForm(!showForm); }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            aria-label={showForm ? 'Cancel' : 'Add Link'}
            title={showForm ? 'Cancel' : 'Add Link'}
          >
            <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-4 border border-gray-300 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingLink ? 'Edit Important Link' : 'Add New Important Link'}
            </h2>
            <ImportantLinksForm
              link={editingLink}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingLink(null);
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
                    Link
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
                {links.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No important links found. Click the "+" button to add a new link.
                    </td>
                  </tr>
                ) : (
                  links.map((link) => (
                    <tr key={link.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {link.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {link.link_type === 'url' ? (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center truncate max-w-xs"
                              title={link.url}
                            >
                              <span className="mr-2">🔗</span>
                              {link.url}
                            </a>
                          ) : (
                            <a
                              href={link.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center truncate max-w-xs"
                              title={link.file_path}
                            >
                              <span className="mr-2">📄</span>
                              {link.file_path ? link.file_path.split('/').pop() : 'File'}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            link.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {link.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => toggleActive(link.id, link.is_active)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-gray-50"
                            aria-label={link.is_active ? 'Deactivate' : 'Activate'}
                            title={link.is_active ? 'Deactivate' : 'Activate'}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {link.is_active ? 'toggle_off' : 'toggle_on'}
                            </span>
                          </button>
                          <button
                            onClick={() => handleEdit(link)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-blue-50"
                            aria-label="Edit"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-blue-600 text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(link.id)}
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
