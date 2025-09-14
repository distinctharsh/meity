import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AnnouncementForm from '../../components/admin/AnnouncementForm';
import { parseBoolean } from '@/utils/debug';

export default function AnnouncementsManagement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAnnouncement(null);
    setShowForm(true);
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAnnouncements(announcements.filter(announcement => announcement.id !== id));
      } else {
        alert('Failed to delete announcement');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete announcement');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const url = editingAnnouncement ? `/api/admin/announcements/${editingAnnouncement.id}` : '/api/admin/announcements';
      const method = editingAnnouncement ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingAnnouncement(null);
        fetchAnnouncements();
        
        // Show success message
        alert('Announcement saved successfully! Changes will be visible on the website immediately.');
      } else {
        const error = await response.json();
        console.error('API Error:', error);
        alert(error.message || 'Failed to save announcement');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save announcement. Please check your internet connection and try again.');
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      const response = await fetch('/api/admin/announcements/toggle-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: id,
          is_active: !isActive 
        }),
      });

      if (response.ok) {
        const result = await response.json();
        fetchAnnouncements();
        alert(result.message);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update announcement status');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Failed to update announcement status');
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
          <h1 className="text-3xl font-bold text-gray-900">Announcements Management</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Announcement
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {editingAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingAnnouncement(null);
                    }}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Form Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
                <AnnouncementForm
                  announcement={editingAnnouncement}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingAnnouncement(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Current Announcements</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {announcements.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No announcements found. Click "Add New Announcement" to get started.
              </div>
            ) : (
              announcements.map((announcement) => (
                <div key={announcement.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {announcement.title}
                        </h3>
                        {parseBoolean(announcement.is_urgent) && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            URGENT
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          parseBoolean(announcement.is_active)
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {parseBoolean(announcement.is_active) ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{announcement.content}</p>
                      {announcement.link_url && (
                        <p className="text-sm text-blue-600">
                          Link: <a href={announcement.link_url} target="_blank" rel="noopener noreferrer">
                            {announcement.link_text || announcement.link_url}
                          </a>
                        </p>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        {announcement.start_date && `Start: ${announcement.start_date}`}
                        {announcement.end_date && ` • End: ${announcement.end_date}`}
                        {announcement.created_at && ` • Created: ${new Date(announcement.created_at).toLocaleDateString()}`}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => toggleActive(announcement.id, parseBoolean(announcement.is_active))}
                        className={`px-3 py-1 text-xs font-medium rounded ${
                          parseBoolean(announcement.is_active)
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {parseBoolean(announcement.is_active) ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
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
      </div>
    </AdminLayout>
  );
}
