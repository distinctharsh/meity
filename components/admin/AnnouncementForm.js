import { useState, useEffect } from 'react';
import { logFormData, validateFormData, parseBoolean } from '@/utils/debug';
import { showErrorMessage } from '@/utils/errorHandler';

const AnnouncementForm = ({ announcement, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    link_url: '',
    link_text: '',
    is_active: true,
    start_date: '',
    end_date: '',
    display_order: 0
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || '',
        link_url: announcement.link_url || '',
        link_text: announcement.link_text || '',
        is_active: parseBoolean(announcement.is_active),
        start_date: announcement.start_date ? announcement.start_date.split('T')[0] : '',
        end_date: announcement.end_date ? announcement.end_date.split('T')[0] : '',
        display_order: announcement.display_order || 0
      });
    }
  }, [announcement]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Debug: Log form data
      logFormData('Announcement', formData);

      // Validate form data
      const validation = validateFormData(formData, ['title']);
      if (!validation.isValid) {
        const fieldErrors = {};
        validation.errors.forEach(error => {
          // Extract field name from error message if possible
          if (error.includes('title')) fieldErrors.title = error;
          else fieldErrors.general = error;
        });
        setErrors(fieldErrors);
        showErrorMessage('form validation', validation.errors.join(', '));
        return;
      }

      // Additional custom validation
      if (formData.start_date && formData.end_date) {
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);
        
        if (startDate >= endDate) {
          setErrors({ end_date: 'End date must be after start date' });
          showErrorMessage('form validation', 'End date must be after start date');
          return;
        }
      }

      if (formData.link_url && !formData.link_url.match(/^https?:\/\/.+/)) {
        setErrors({ link_url: 'Please enter a valid URL starting with http:// or https://' });
        showErrorMessage('form validation', 'Please enter a valid URL');
        return;
      }

      await onSubmit(formData);
    } catch (error) {
      console.error('Form submit error:', error);
      showErrorMessage('save announcement', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear field-specific errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div>
      {errors.general && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{errors.general}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter announcement title"
            required
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.end_date ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="link_url" className="block text-sm font-medium text-gray-700 mb-2">
              Link URL (Optional)
            </label>
            <input
              type="url"
              id="link_url"
              name="link_url"
              value={formData.link_url}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.link_url ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="https://example.com"
            />
            {errors.link_url && (
              <p className="mt-1 text-sm text-red-600">{errors.link_url}</p>
            )}
          </div>

          <div>
            <label htmlFor="link_text" className="block text-sm font-medium text-gray-700 mb-2">
              Link Text (Optional)
            </label>
            <input
              type="text"
              id="link_text"
              name="link_text"
              value={formData.link_text}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Read More"
            />
          </div>
        </div>

        <div>
          <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 mb-2">
            Display Order
          </label>
          <input
            type="number"
            id="display_order"
            name="display_order"
            value={formData.display_order}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            min="0"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-3 block text-sm text-gray-900">
                <span className="font-medium">Active</span>
                <span className="text-gray-500 ml-1">(Shows on homepage)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : (announcement ? 'Update Announcement' : 'Create Announcement')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;
