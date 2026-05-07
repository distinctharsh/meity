import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PartnerLogoForm from '../../components/admin/PartnerLogoForm';

export default function PartnerLogosManagement() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLogo, setEditingLogo] = useState(null);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const response = await fetch('/api/admin/partner-logos');
      if (response.ok) {
        const data = await response.json();
        setLogos(data);
      }
    } catch (error) {
      console.error('Failed to fetch partner logos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingLogo(null);
    setShowForm(true);
  };

  const handleEdit = (logo) => {
    setEditingLogo(logo);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this partner logo?')) return;

    try {
      const response = await fetch(`/api/admin/partner-logos?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setLogos(logos.filter(logo => logo.id !== id));
      } else {
        alert('Failed to delete partner logo');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete partner logo');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const apiUrl = editingLogo 
        ? `/api/admin/partner-logos` 
        : '/api/admin/partner-logos';
      
      const method = editingLogo ? 'PUT' : 'POST';
      const payload = editingLogo 
        ? { ...formData, id: editingLogo.id }
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
        setEditingLogo(null);
        fetchLogos();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save partner logo');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save partner logo');
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      const response = await fetch('/api/admin/partner-logos', {
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
        fetchLogos();
      } else {
        alert('Failed to update logo status');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Failed to update logo status');
    }
  };

  const moveLogo = async (id, direction) => {
    const currentIndex = logos.findIndex(logo => logo.id === id);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'up') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : logos.length - 1;
    } else {
      newIndex = currentIndex < logos.length - 1 ? currentIndex + 1 : 0;
    }

    const currentLogo = logos[currentIndex];
    const targetLogo = logos[newIndex];

    try {
      // Swap display orders
      await fetch('/api/admin/partner-logos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: currentLogo.id, 
          display_order: targetLogo.display_order 
        }),
      });

      await fetch('/api/admin/partner-logos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: targetLogo.id, 
          display_order: currentLogo.display_order 
        }),
      });

      fetchLogos();
    } catch (error) {
      console.error('Move error:', error);
      alert('Failed to reorder logos');
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
            Partner Logos Management
          </h1>
          <button
            onClick={() => { setEditingLogo(null); setShowForm(!showForm); }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            aria-label={showForm ? 'Cancel' : 'Add Logo'}
            title={showForm ? 'Cancel' : 'Add Logo'}
          >
            <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-4 border border-gray-300 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingLogo ? 'Edit Partner Logo' : 'Add New Partner Logo'}
            </h2>
            <PartnerLogoForm
              logo={editingLogo}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingLogo(null);
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
                    Logo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alt Text
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No partner logos found. Click the "+" button to add a new logo.
                    </td>
                  </tr>
                ) : (
                  logos.map((logo, index) => (
                    <tr key={logo.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-20 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center p-1">
                            <img
                              src={logo.image_url}
                              alt={logo.alt_text || 'Partner logo'}
                              className="h-full object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAzMkMxMi4yNjggMzIgNiAyNS43MzIgNiAyMEM2IDE0LjI2OCAxMi4yNjggOCAyMCA4QzI3LjczMiA4IDM0IDE0LjI2OCAzNCAyMEMzNCAyNS43MzIgMjcuNzMyIDMyIDIwIDMyWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjAgMTZDMTguMDY3IDE2IDE2LjUgMTcuNTY3IDE2LjUgMTlDMTYuNSAyMC40MzMgMTguMDY3IDIyIDIwIDIyQzIxLjkzMyAyMiAyMy41IDIwLjQzMyAyMy41IDE5QzIzLjUgMTcuNTY3IDIxLjkzMyAxNiAyMCAxNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {logo.title || 'Untitled'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Order: {logo.display_order}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-xs" title={logo.alt_text}>
                          {logo.alt_text || 'No alt text'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            logo.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {logo.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => moveLogo(logo.id, 'up')}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-gray-50"
                            aria-label="Move Up"
                            title="Move Up"
                          >
                            <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
                          </button>
                          <button
                            onClick={() => moveLogo(logo.id, 'down')}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-gray-50"
                            aria-label="Move Down"
                            title="Move Down"
                          >
                            <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                          </button>
                          <button
                            onClick={() => toggleActive(logo.id, logo.is_active)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-gray-50"
                            aria-label={logo.is_active ? 'Deactivate' : 'Activate'}
                            title={logo.is_active ? 'Deactivate' : 'Activate'}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {logo.is_active ? 'toggle_off' : 'toggle_on'}
                            </span>
                          </button>
                          <button
                            onClick={() => handleEdit(logo)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-blue-50"
                            aria-label="Edit"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-blue-600 text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(logo.id)}
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
