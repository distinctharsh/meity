import { useState } from 'react';

export default function PartnerLogoForm({ logo, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: logo?.title || '',
    image_url: logo?.image_url || '',
    alt_text: logo?.alt_text || '',
    display_order: logo?.display_order || 0,
    is_active: logo?.is_active !== undefined ? logo.is_active : 1,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      // If editing, pass old image path for cleanup
      if (logo?.image_url) {
        uploadFormData.append('old_path', logo.image_url.startsWith('/') ? logo.image_url.slice(1) : logo.image_url);
      }

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          image_url: data.url,
          alt_text: prev.alt_text || file.name.split('.')[0] // Use filename as default alt text
        }));
      } else {
        const error = await response.json();
        setUploadError(error.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      setUploadError('Please upload an image');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title (Optional)
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Partner name or title"
          />
        </div>

        {/* Display Order */}
        <div>
          <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 mb-1">
            Display Order
          </label>
          <input
            type="number"
            id="display_order"
            name="display_order"
            value={formData.display_order}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Alt Text */}
      <div>
        <label htmlFor="alt_text" className="block text-sm font-medium text-gray-700 mb-1">
          Alt Text
        </label>
        <input
          type="text"
          id="alt_text"
          name="alt_text"
          value={formData.alt_text}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Description for accessibility"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Logo Image *
        </label>
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {uploading && (
            <div className="text-sm text-blue-600">Uploading image...</div>
          )}
          {uploadError && (
            <div className="text-sm text-red-600">{uploadError}</div>
          )}
        </div>
      </div>

      {/* Image Preview */}
      {formData.image_url && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image Preview
          </label>
          <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
            <img
              src={formData.image_url}
              alt={formData.alt_text || 'Logo preview'}
              className="h-20 object-contain mx-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAzMkMxMi4yNjggMzIgNiAyNS43MzIgNiAyMEM2IDE0LjI2OCAxMi4yNjggOCAyMCA4QzI3LjczMiA4IDM0IDE0LjI2OCAzNCAyMEMzNCAyNS43MzIgMjcuNzMyIDMyIDIwIDMyWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjAgMTZDMTguMDY3IDE2IDE2LjUgMTcuNTY3IDE2LjUgMTlDMTYuNSAyMC40MzMgMTguMDY3IDIyIDIwIDIyQzIxLjkzMyAyMiAyMy41IDIwLjQzMyAyMy41IDE5QzIzLjUgMTcuNTY3IDIxLjkzMyAxNiAyMCAxNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';
              }}
            />
            <div className="mt-2 text-xs text-gray-500 text-center">
              {formData.image_url}
            </div>
          </div>
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
          Active (show in carousel)
        </label>
      </div>

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
          disabled={uploading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {logo ? 'Update Logo' : 'Add Logo'}
        </button>
      </div>
    </form>
  );
}
