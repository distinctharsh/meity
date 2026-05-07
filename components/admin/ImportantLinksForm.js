import { useState } from 'react';

export default function ImportantLinksForm({ link, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: link?.title || '',
    url: link?.url || '',
    is_active: link?.is_active !== undefined ? link.is_active : 1,
  });
  const [errors, setErrors] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
    setErrors(''); // Clear errors on input
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setErrors('Title is required');
      return;
    }

    if (!formData.url.trim()) {
      setErrors('URL is required');
      return;
    }

    if (!validateUrl(formData.url)) {
      setErrors('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter link title"
          required
        />
      </div>

      {/* URL */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          URL *
        </label>
        <input
          type="url"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://example.com"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter the full URL including https:// or http://
        </p>
      </div>

      {/* Error Display */}
      {errors && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {errors}
        </div>
      )}

      {/* Active Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active === 1}
          onChange={handleInputChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
          Active (show in Important Links section)
        </label>
      </div>

      {/* URL Preview */}
      {formData.url && validateUrl(formData.url) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link Preview
          </label>
          <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {formData.title}
                </div>
                <div className="text-xs text-blue-600 truncate">
                  {formData.url}
                </div>
              </div>
              <a
                href={formData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Test Link
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {link ? 'Update Link' : 'Add Link'}
        </button>
      </div>
    </form>
  );
}
