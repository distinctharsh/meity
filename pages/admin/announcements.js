import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AnnouncementForm from '../../components/admin/AnnouncementForm';
import { parseBoolean } from '@/utils/debug';

export default function AnnouncementsManagement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements');
      
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      } else {
        // Handle specific HTTP error responses
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        console.error('Announcements fetch error:', errorMessage);
        alert(`Failed to load announcements: ${errorMessage}`);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('Announcements fetch network error:', error);
      
      // Handle different types of network errors
      let errorMessage = 'Network error occurred';
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'Request was cancelled';
      } else {
        errorMessage = `Network error: ${error.message}`;
      }
      
      alert(`Failed to load announcements: ${errorMessage}`);
      setAnnouncements([]);
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
        alert('Announcement deleted successfully!');
      } else {
        // Handle specific HTTP error responses
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        console.error('Delete error:', errorMessage);
        alert(`Failed to delete announcement: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Delete network error:', error);
      
      // Handle different types of network errors
      let errorMessage = 'Network error occurred';
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'Request was cancelled';
      } else {
        errorMessage = `Network error: ${error.message}`;
      }
      
      alert(`Failed to delete announcement: ${errorMessage}`);
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
        alert(editingAnnouncement ? 'Announcement updated successfully!' : 'Announcement created successfully!');
      } else {
        // Handle specific HTTP error responses
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        console.error('Form submit error:', errorMessage);
        alert(`Failed to save announcement: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Form submit network error:', error);
      
      // Handle different types of network errors
      let errorMessage = 'Network error occurred';
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'Request was cancelled';
      } else {
        errorMessage = `Network error: ${error.message}`;
      }
      
      alert(`Failed to save announcement: ${errorMessage}`);
    }
  };

  // Filter and sort announcements
  const filteredAnnouncements = announcements
    .filter(announcement => {
      const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'active' && parseBoolean(announcement.is_active)) ||
        (filterStatus === 'inactive' && !parseBoolean(announcement.is_active)) ||
        (filterStatus === 'urgent' && parseBoolean(announcement.is_urgent));
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

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
        alert(result.message || 'Status updated successfully!');
      } else {
        // Handle specific HTTP error responses
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        console.error('Toggle status error:', errorMessage);
        alert(`Failed to update announcement status: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Toggle status network error:', error);
      
      // Handle different types of network errors
      let errorMessage = 'Network error occurred';
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'Request was cancelled';
      } else {
        errorMessage = `Network error: ${error.message}`;
      }
      
      alert(`Failed to update announcement status: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
              <p className="text-gray-600 mt-1">Manage site announcements and notifications</p>
            </div>
            <button
              onClick={handleAdd}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow cursor-pointer"
              aria-label="Add new announcement"
              title="Add new announcement"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Announcements</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
                <option value="urgent">Urgent Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="created_at">Created Date</option>
                <option value="updated_at">Updated Date</option>
                <option value="title">Title</option>
                <option value="display_order">Display Order</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
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

        {/* Announcements List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Announcements ({filteredAnnouncements.length})
              </h2>
              <div className="text-sm text-gray-500">
                Showing {filteredAnnouncements.length} of {announcements.length} announcements
              </div>
            </div>
          </div>
          
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Get started by creating your first announcement.'
                }
              </p>
              {(!searchTerm && filterStatus === 'all') && (
                <button
                  onClick={handleAdd}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create First Announcement
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {announcement.title}
                        </h3>
                        {parseBoolean(announcement.is_urgent) && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            URGENT
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${
                          parseBoolean(announcement.is_active)
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${
                            parseBoolean(announcement.is_active) ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                          {parseBoolean(announcement.is_active) ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                      
                      {announcement.link_url && (
                        <div className="mb-3">
                          <a 
                            href={announcement.link_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {announcement.link_text || announcement.link_url}
                          </a>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {announcement.start_date && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Start: {announcement.start_date}
                          </span>
                        )}
                        {announcement.end_date && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            End: {announcement.end_date}
                          </span>
                        )}
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Created: {new Date(announcement.created_at).toLocaleDateString()}
                        </span>
                        {announcement.updated_at !== announcement.created_at && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Updated: {new Date(announcement.updated_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleActive(announcement.id, parseBoolean(announcement.is_active))}
                        className={`p-2 rounded-md focus:outline-none focus:ring-2 cursor-pointer ${
                          parseBoolean(announcement.is_active)
                            ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-200'
                            : 'text-green-600 hover:text-green-800 hover:bg-green-50 focus:ring-green-200'
                        }`}
                        title={parseBoolean(announcement.is_active) ? 'Deactivate announcement' : 'Activate announcement'}
                        aria-label={parseBoolean(announcement.is_active) ? 'Deactivate announcement' : 'Activate announcement'}
                      >
                        {parseBoolean(announcement.is_active) ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5v9a2.25 2.25 0 002.25 2.25h6a2.25 2.25 0 002.25-2.25v-9M9 7.5V6.75A2.25 2.25 0 0111.25 4.5h1.5A2.25 2.25 0 0115 6.75V7.5" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                        title="Edit announcement"
                        aria-label="Edit announcement"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687 1.687m-2.496-.79l-8.74 8.74a2.25 2.25 0 00-.57.99l-.53 2.122a.75.75 0 00.91.91l2.122-.53a2.25 2.25 0 00.99-.57l8.74-8.74m-2.496-.79l2.496.79M16.862 4.487a1.875 1.875 0 112.652 2.652" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="p-2 rounded-md text-red-600 hover:text-red-800 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer"
                        title="Delete announcement"
                        aria-label="Delete announcement"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M9 3a1 1 0 0 0-1 1v1H4.5a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5H16V4a1 1 0 0 0-1-1H9z" />
                          <path d="M6.5 7h11l-.84 11.2A2 2 0 0 1 14.67 20H9.33a2 2 0 0 1-1.99-1.8L6.5 7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
