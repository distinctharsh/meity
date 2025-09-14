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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Offerings Management</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Offering
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <OfferingForm
                offering={editingOffering}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingOffering(null);
                }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No offerings found</h3>
              <p className="text-gray-500">Add your first offering to get started.</p>
            </div>
          ) : (
            offerings.map((offering) => (
              <div key={offering.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {offering.icon && (
                        <span className="text-2xl mr-3">{offering.icon}</span>
                      )}
                      <h3 className="text-lg font-medium text-gray-900">
                        {offering.title}
                      </h3>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      offering.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {offering.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{offering.description}</p>
                  
                  {offering.category && (
                    <p className="text-sm text-blue-600 mb-2">
                      Category: {offering.category}
                    </p>
                  )}
                  
                  {offering.link_url && (
                    <p className="text-sm text-gray-500 mb-4">
                      <a href={offering.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Details →
                      </a>
                    </p>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleActive(offering.id, offering.is_active)}
                      className={`flex-1 px-3 py-1 text-xs font-medium rounded ${
                        offering.is_active
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {offering.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(offering)}
                      className="flex-1 bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(offering.id)}
                      className="flex-1 bg-red-100 text-red-700 text-xs px-3 py-1 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
