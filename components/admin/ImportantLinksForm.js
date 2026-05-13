import { useState } from 'react';

export default function ImportantLinksForm({ link, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: link?.title || '',
    url: link?.url || '',
    file_path: link?.file_path || '',
    link_type: link?.file_path ? 'file' : (link?.url ? 'url' : 'url'),
    is_active: link?.is_active !== undefined ? link.is_active : 1,
  });
  const [errors, setErrors] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
    setErrors(''); // Clear errors on input
  };

  const handleLinkTypeChange = (e) => {
    const newLinkType = e.target.value;
    setFormData(prev => ({
      ...prev,
      link_type: newLinkType,
      url: newLinkType === 'url' ? prev.url : '', // Clear URL when switching to file
      file_path: newLinkType === 'file' ? prev.file_path : '' // Clear file when switching to URL
    }));
    setErrors(''); // Clear errors on type change
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setErrors('Only PDF, DOC, and DOCX files are allowed');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setErrors('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setFormData(prev => ({
        ...prev,
        file_path: result.filePath,
        url: '' // Clear URL when file is uploaded
      }));
    } catch (error) {
      setErrors('Failed to upload file. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
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

    if (formData.link_type === 'url') {
      if (!formData.url.trim()) {
        setErrors('URL is required');
        return;
      }

      if (!validateUrl(formData.url)) {
        setErrors('Please enter a valid URL (e.g., https://example.com)');
        return;
      }
    } else if (formData.link_type === 'file') {
      if (!formData.file_path.trim()) {
        setErrors('Please upload a file');
        return;
      }
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

      {/* Link Type */}
      <div>
        <label htmlFor="link_type" className="block text-sm font-medium text-gray-700 mb-1">
          Link Type *
        </label>
        <select
          id="link_type"
          name="link_type"
          value={formData.link_type}
          onChange={handleLinkTypeChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="url">External URL</option>
          <option value="file">Upload File</option>
        </select>
      </div>

      {/* URL Field - shown only when link_type is 'url' */}
      {formData.link_type === 'url' && (
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
            required={formData.link_type === 'url'}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the full URL including https:// or http://
          </p>
        </div>
      )}

      {/* File Upload Field - shown only when link_type is 'file' */}
      {formData.link_type === 'file' && (
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            Upload File *
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={uploading}
            required={formData.link_type === 'file' && !formData.file_path}
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, DOC, DOCX (Max size: 5MB)
          </p>
          {uploading && (
            <p className="text-xs text-blue-600 mt-1">
              Uploading file...
            </p>
          )}
          {formData.file_path && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-xs text-green-700">
                ✓ File uploaded: {formData.file_path.split('/').pop()}
              </p>
            </div>
          )}
        </div>
      )}

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

      {/* Link Preview */}
      {(formData.link_type === 'url' && formData.url && validateUrl(formData.url)) || 
       (formData.link_type === 'file' && formData.file_path) ? (
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
                  {formData.link_type === 'url' ? formData.url : `📄 ${formData.file_path.split('/').pop()}`}
                </div>
              </div>
              {formData.link_type === 'url' ? (
                <a
                  href={formData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Test Link
                </a>
              ) : (
                <a
                  href={formData.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View File
                </a>
              )}
            </div>
          </div>
        </div>
      ) : null}

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
