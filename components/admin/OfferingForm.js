import { useState, useEffect } from 'react';

const OfferingForm = ({ offering, onSubmit, onCancel, tabType = 'schemes' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link_url: '',
    category: '',
    is_active: true,
    tender_id: '',
    published_date: '',
    due_date: '',
    file_url: '',
    file_size: ''
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (offering) {
      setFormData({
        title: offering.title || '',
        description: offering.description || '',
        link_url: offering.link_url || '',
        category: offering.category || '',
        is_active: offering.is_active !== undefined ? offering.is_active : true,
        tender_id: offering.tender_id || '',
        published_date: offering.published_date || '',
        due_date: offering.due_date || '',
        file_url: offering.file_url || '',
        file_size: offering.file_size || ''
      });
    } else {
      // Reset form when adding new offering
      setFormData({
        title: '',
        description: '',
        link_url: '',
        category: '',
        is_active: true,
        tender_id: '',
        published_date: '',
        due_date: '',
        file_url: '',
        file_size: ''
      });
    }
  }, [offering]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Handle file upload if file is selected
      if (file && (tabType === 'vacancies' || tabType === 'tenders')) {
        setUploading(true);
        
        const formDataToUpload = new FormData();
        formDataToUpload.append('file', file);
        formDataToUpload.append('type', tabType);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataToUpload
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          // Extract just the filename from the full path for DB storage
          const fullPath = uploadResult.filePath || uploadResult.url || '';
          const pathParts = fullPath.split('/');
          formData.file_name = pathParts[pathParts.length - 1] || '';
          formData.file_size = uploadResult.fileSize;
        } else {
          throw new Error('File upload failed');
        }
        
        setUploading(false);
      }
      
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type (PDF only)
      if (selectedFile.type !== 'application/pdf') {
        alert('Please upload a PDF file only.');
        e.target.value = '';
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={tabType === 'vacancies' ? 'Enter vacancy title' : tabType === 'tenders' ? 'Enter tender title' : 'Enter offering title'}
            required
          />
        </div>

        {/* Tender ID field - only for tenders */}
        {tabType === 'tenders' && (
          <div className="sm:col-span-2 md:col-span-1">
            <label htmlFor="tender_id" className="block text-sm font-medium text-gray-700">
              Tender ID
            </label>
            <input
              type="text"
              id="tender_id"
              name="tender_id"
              value={formData.tender_id}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., CABSEC-2025"
            />
          </div>
        )}

        {/* Published Date - for vacancies and tenders */}
        {(tabType === 'vacancies' || tabType === 'tenders') && (
          <div className="sm:col-span-2 md:col-span-1">
            <label htmlFor="published_date" className="block text-sm font-medium text-gray-700">
              Published Date
            </label>
            <input
              type="date"
              id="published_date"
              name="published_date"
              value={formData.published_date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        )}

        {/* Due Date - only for tenders */}
        {tabType === 'tenders' && (
          <div className="sm:col-span-2 md:col-span-1">
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        )}

        {/* Description - for vacancies and schemes */}
        {(tabType === 'vacancies' || tabType === 'schemes') && (
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description {tabType === 'vacancies' ? '*' : '(Optional)'}
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={tabType === 'vacancies' ? 'Enter job description' : 'Enter a brief description'}
              required={tabType === 'vacancies'}
            />
          </div>
        )}

        {/* Category - only for schemes */}
        {tabType === 'schemes' && (
          <div className="sm:col-span-2 md:col-span-1">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select Category</option>
              <option value="schemes">Schemes</option>
              <option value="services">Services</option>
              <option value="whats_new">What's New</option>
              <option value="announcements">Announcements</option>
              <option value="events">Events</option>
            </select>
          </div>
        )}

        {/* Link URL - only for schemes */}
        {tabType === 'schemes' && (
          <div className="sm:col-span-2 md:col-span-1">
            <label htmlFor="link_url" className="block text-sm font-medium text-gray-700">
              Link URL (Optional)
            </label>
            <input
              type="url"
              id="link_url"
              name="link_url"
              value={formData.link_url}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="https://example.com/offering"
            />
          </div>
        )}

        {/* File Upload - for vacancies and tenders */}
        {(tabType === 'vacancies' || tabType === 'tenders') && (
          <div className="sm:col-span-2">
            <label htmlFor="file_upload" className="block text-sm font-medium text-gray-700">
              Upload PDF File *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file_upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file_upload"
                      name="file_upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf"
                      onChange={handleFileChange}
                      required={!offering} // Required for new items
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF only, up to 10MB</p>
                {file && (
                  <div className="mt-2 text-sm text-green-600">
                    Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                )}
                {offering && offering.file_url && !file && (
                  <div className="mt-2 text-sm text-gray-600">
                    Current file: <a href={offering.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center sm:col-span-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
            Make this {tabType === 'vacancies' ? 'vacancy' : tabType === 'tenders' ? 'tender' : 'offering'} visible on the website
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white ${
            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          disabled={loading}
        >
          {loading || uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {uploading ? 'Uploading...' : (offering ? 'Updating...' : 'Adding...')}
            </>
          ) : offering ? `Update ${tabType === 'vacancies' ? 'Vacancy' : tabType === 'tenders' ? 'Tender' : 'Offering'}` : `Add ${tabType === 'vacancies' ? 'Vacancy' : tabType === 'tenders' ? 'Tender' : 'Offering'}`}
        </button>
      </div>
    </form>
  );
};

export default OfferingForm;
