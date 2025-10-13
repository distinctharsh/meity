import { useState, useEffect } from 'react';

const SliderForm = ({ slide, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    image_url: '',
    link_url: '',
    display_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (slide) {
      setFormData({
        image_url: slide.image_url || '',
        link_url: slide.link_url || '',
        display_order: slide.display_order || 0,
        is_active: slide.is_active !== undefined ? slide.is_active : true
      });
    }
  }, [slide]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic client-side validation to avoid API 'Image URL is required'
    if (!formData.image_url || String(formData.image_url).trim() === '') {
      alert('Please upload an image or provide an image URL.');
      return;
    }
    if (uploading) {
      alert('Please wait for the image upload to finish.');
      return;
    }
    setLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {slide ? 'Edit Slide' : 'Create Slide'}
        </h2>
      </div>

      <div>
        {/* Form Section */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadError('');
                    setUploading(true);
                    try {
                      const fd = new FormData();
                      fd.append('file', file);
                      // If current image is an uploaded one, request deletion
                      if (formData.image_url && formData.image_url.startsWith('/uploads/slider/')) {
                        fd.append('old_path', `public${formData.image_url}`);
                      }
                      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
                      if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        throw new Error(err.message || 'Upload failed');
                      }
                      const data = await res.json();
                      setFormData((prev) => ({ ...prev, image_url: data.url }));
                    } catch (err) {
                      setUploadError(err.message || 'Upload failed');
                    } finally {
                      setUploading(false);
                    }
                  }}
                  className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {uploadError && (
                <p className="mt-2 text-sm text-red-600">{uploadError}</p>
              )}
              {uploading && (
                <p className="mt-2 text-sm text-gray-500">Uploading...</p>
              )}
              {formData.image_url && (
                <div className="mt-3">
                  <img src={formData.image_url} alt="Selected" className="h-28 w-full object-cover rounded border" />
                </div>
              )}
            </div>

            

            {/* In case someone still wants to paste URL manually, keep this optional field */}
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                Or paste Image URL (optional)
              </label>
              <input
                type="text"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                placeholder="/uploads/slider/your-image.jpg or https://..."
              />
              <p className="mt-1 text-xs text-gray-500">You can paste a relative path like <code>/uploads/slider/abc.jpg</code> or a full URL.</p>
            </div>

            <div>
              <label htmlFor="link_url" className="block text-sm font-medium text-gray-700">
                Link URL (Optional)
              </label>
              <input
                type="url"
                id="link_url"
                name="link_url"
                value={formData.link_url}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="display_order" className="block text-sm font-medium text-gray-700">
                  Display Order
                </label>
                <input
                  type="number"
                  id="display_order"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  min="0"
                />
              </div>
              <div className="flex items-center mt-6">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 pt-4 bg-white">
              <div className="flex justify-end space-x-3 border-t pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading || !formData.image_url}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : (slide ? 'Update Slide' : 'Create Slide')}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview Section removed */}
      </div>
    </div>
  );
};

export default SliderForm;