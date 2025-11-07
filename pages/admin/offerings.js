import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import OfferingForm from '../../components/admin/OfferingForm';

export default function OfferingsManagement() {
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOffering, setEditingOffering] = useState(null);

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      const response = await fetch('/api/admin/offerings');
      if (response.ok) {
        const data = await response.json();
        setOfferings(data);
      }
    } catch (error) {
      console.error('Failed to fetch offerings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingOffering(null);
    setShowForm(true);
  };

  const handleEdit = (offering) => {
    setEditingOffering(offering);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this offering?')) return;

    try {
      const response = await fetch(`/api/admin/offerings/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setOfferings(offerings.filter(offering => offering.id !== id));
      } else {
        alert('Failed to delete offering');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete offering');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const url = editingOffering ? `/api/admin/offerings/${editingOffering.id}` : '/api/admin/offerings';
      const method = editingOffering ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingOffering(null);
        fetchOfferings();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save offering');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save offering');
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      const response = await fetch(`/api/admin/offerings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (response.ok) {
        fetchOfferings();
      } else {
        alert('Failed to update offering status');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Failed to update offering status');
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
          <h1 className="text-2xl font-bold text-gray-900">Offerings Management</h1>
          <button
            onClick={() => { setEditingOffering(null); setShowForm(!showForm); }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            aria-label={showForm ? 'Cancel' : 'Add Offering'}
            title={showForm ? 'Cancel' : 'Add Offering'}
          >
            <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-4 border border-gray-300 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingOffering ? 'Edit Offering' : 'Add New Offering'}
            </h2>
            <OfferingForm
              offering={editingOffering}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingOffering(null);
              }}
            />
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offerings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No offerings found. Click the "+" button to add a new offering.
                  </td>
                </tr>
              ) : (
                offerings.map((offering) => (
                  <tr key={offering.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {offering.icon && (
                          <span className="text-xl mr-2">{offering.icon}</span>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{offering.title}</div>
                          {offering.description && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {offering.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {offering.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          offering.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {offering.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => toggleActive(offering.id, offering.is_active)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-gray-50"
                          aria-label={offering.is_active ? 'Deactivate' : 'Activate'}
                          title={offering.is_active ? 'Deactivate' : 'Activate'}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {offering.is_active ? 'toggle_off' : 'toggle_on'}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingOffering(offering);
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
                          onClick={() => handleDelete(offering.id)}
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
    </AdminLayout>
  );
}
