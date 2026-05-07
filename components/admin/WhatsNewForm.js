import { useState } from 'react';

export default function WhatsNewForm({ item, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    type: item?.type || 'link',
    file_url: item?.file_url || '',
    external_url: item?.external_url || '',
    is_active: item?.is_active !== undefined ? item.is_active : 1,
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      setUploadError('Please upload a PDF file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('PDF size should be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      // If editing, pass old file path for cleanup
      if (item?.file_url) {
        uploadFormData.append('old_path', item.file_url.startsWith('/') ? item.file_url.slice(1) : item.file_url);
      }

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          file_url: data.url,
          external_url: '' // Clear external URL when PDF is uploaded
        }));
      } else {
        const error = await response.json();
        setUploadError(error.message || 'Failed to upload PDF');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      setUploadError('Title is required');
      return;
    }

    if (formData.type === 'pdf' && !formData.file_url) {
      setUploadError('Please upload a PDF file');
      return;
    }

    if (formData.type === 'link' && !formData.external_url) {
      setUploadError('Please provide an external URL');
      return;
    }

    // Clear file_url for link type and external_url for pdf type
    const submitData = {
      ...formData,
      file_url: formData.type === 'pdf' ? formData.file_url : null,
      external_url: formData.type === 'link' ? formData.external_url : null
    };

    onSubmit(submitData);
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
          placeholder="Enter title"
          required
        />
      </div>

      
      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content Type *
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="link"
              checked={formData.type === 'link'}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span>External Link</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="pdf"
              checked={formData.type === 'pdf'}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span>PDF File</span>
          </label>
        </div>
      </div>

      {/* Conditional Fields Based on Type */}
      {formData.type === 'link' ? (
        /* External URL Field */
        <div>
          <label htmlFor="external_url" className="block text-sm font-medium text-gray-700 mb-1">
            External URL *
          </label>
          <input
            type="url"
            id="external_url"
            name="external_url"
            value={formData.external_url}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com"
            required={formData.type === 'link'}
          />
        </div>
      ) : (
        /* PDF Upload Field */
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PDF File *
          </label>
          <div className="space-y-2">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {uploading && (
              <div className="text-sm text-blue-600">Uploading PDF...</div>
            )}
            {uploadError && (
              <div className="text-sm text-red-600">{uploadError}</div>
            )}
          </div>
        </div>
      )}

      {/* PDF Preview */}
      {formData.type === 'pdf' && formData.file_url && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PDF Preview
          </label>
          <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
            <div className="flex items-center space-x-2">
              <span className="text-red-600 text-2xl">📄</span>
              <div>
                <div className="text-sm font-medium text-gray-900">PDF Uploaded</div>
                <div className="text-xs text-gray-500">
                  {formData.file_url}
                </div>
              </div>
            </div>
            <a
              href={formData.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              View PDF
            </a>
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
          Active (show in What's New section)
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
          {item ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}
