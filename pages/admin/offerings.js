import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import OfferingForm from '../../components/admin/OfferingForm';

export default function OfferingsManagement() {
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOffering, setEditingOffering] = useState(null);
  const [activeTab, setActiveTab] = useState('vacancies'); // vacancies, tenders

  useEffect(() => {
    fetchOfferings();
  }, [activeTab]);

  const fetchOfferings = async () => {
    try {
      let apiUrl = activeTab === 'vacancies' ? '/api/admin/vacancies' : '/api/admin/tenders';
      
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setOfferings(data);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingOffering(null);
    setShowForm(true);
  };


  const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    // Local timezone mein convert karke YYYY-MM-DD format mein return karta hai
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Invalid date:", dateString);
    return '';
  }
};


const handleEdit = (offering) => {
  // Date format convert kar rahe hain taaki <input type="date"> support kare
  const formattedOffering = {
    ...offering,
    published_date: offering.published_date ? formatDateForInput(offering.published_date) : '',
    due_date: offering.due_date ? formatDateForInput(offering.due_date) : ''
  };

  setEditingOffering(formattedOffering);
  setShowForm(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

  const handleDelete = async (id) => {
    const itemType = activeTab === 'vacancies' ? 'vacancy' : 'tender';
    if (!confirm(`Are you sure you want to delete this ${itemType}?`)) return;

    try {
      let apiUrl = activeTab === 'vacancies' ? `/api/admin/vacancies/${id}` : `/api/admin/tenders/${id}`;
      
      const response = await fetch(apiUrl, {
        method: 'DELETE'
      });

      if (response.ok) {
        setOfferings(offerings.filter(item => item.id !== id));
      } else {
        alert(`Failed to delete ${itemType}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Failed to delete ${itemType}`);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      let apiUrl = activeTab === 'vacancies' 
        ? (editingOffering ? `/api/admin/vacancies/${editingOffering.id}` : '/api/admin/vacancies')
        : (editingOffering ? `/api/admin/tenders/${editingOffering.id}` : '/api/admin/tenders');
      
      const method = editingOffering ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
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
        alert(error.message || 'Failed to save item');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save item');
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      let apiUrl = activeTab === 'vacancies' ? `/api/admin/vacancies/${id}` : `/api/admin/tenders/${id}`;
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (response.ok) {
        fetchOfferings();
      } else {
        alert('Failed to update item status');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Failed to update item status');
    }
  };

  const toggleArchive = async (id, isArchived) => {
    try {
      let apiUrl = activeTab === 'vacancies' ? `/api/admin/vacancies/${id}` : `/api/admin/tenders/${id}`;
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_archived: !isArchived }),
      });

      if (response.ok) {
        fetchOfferings();
      } else {
        alert('Failed to update archive status');
      }
    } catch (error) {
      console.error('Archive toggle error:', error);
      alert('Failed to update archive status');
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
            {activeTab === 'vacancies' ? 'Vacancies Management' : 'Tenders Management'}
          </h1>
          <button
            onClick={() => { setEditingOffering(null); setShowForm(!showForm); }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            aria-label={showForm ? 'Cancel' : 'Add Item'}
            title={showForm ? 'Cancel' : 'Add Item'}
          >
            <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('vacancies')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vacancies'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vacancies
            </button>
            <button
              onClick={() => setActiveTab('tenders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tenders'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tenders
            </button>
          </nav>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-4 border border-gray-300 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingOffering ? 
                (activeTab === 'vacancies' ? 'Edit Vacancy' : 'Edit Tender') : 
                (activeTab === 'vacancies' ? 'Add New Vacancy' : 'Add New Tender')
              }
            </h2>
            <OfferingForm
              offering={editingOffering}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingOffering(null);
              }}
              tabType={activeTab}
            />
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                {(activeTab === 'vacancies' || activeTab === 'tenders') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     {activeTab === 'vacancies'
                  ? 'Published Date'
                  : 'Published / Due Date'}
                  </th>
                )}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offerings.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    {activeTab === 'vacancies' ? 'No vacancies found. Click the "+" button to add a new vacancy.' :
                     'No tenders found. Click the "+" button to add a new tender.'}
                  </td>
                </tr>
              ) : (
                offerings.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {item.icon && (
                          <span className="text-xl mr-2">{item.icon}</span>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    {(activeTab === 'vacancies' || activeTab === 'tenders') && (
                       <td className="p-2 text-sm">
                          {activeTab === 'vacancies' && (
                            item.published_date
                              ? new Date(item.published_date).toLocaleDateString('en-IN')
                              : 'No date'
                          )}

                          {activeTab === 'tenders' && (
                            <>
                              {item.published_date && (
                                <div>
                                  Published:{' '}
                                  {new Date(item.published_date).toLocaleDateString('en-IN')}
                                </div>
                              )}
                              {item.due_date && (
                                <div>
                                  Due:{' '}
                                  {new Date(item.due_date).toLocaleDateString('en-IN')}
                                </div>
                              )}
                            </>
                          )}
                        </td>
                    )}
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
                          onClick={() => toggleArchive(item.id, item.is_archived)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-yellow-50"
                          aria-label={item.is_archived ? 'Unarchive' : 'Archive'}
                          title={item.is_archived ? 'Move to Active' : 'Move to Archive'}
                        >
                          <span className={`material-symbols-outlined text-sm ${item.is_archived ? 'text-yellow-600' : 'text-gray-400'}`}>
                            {item.is_archived ? 'unarchive' : 'archive'}
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
    </AdminLayout>
  );
}
