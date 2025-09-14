import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function MediaLibrary() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/admin/media');
      if (response.ok) {
        const data = await response.json();
        setMedia(data);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    selectedFiles.forEach((file, index) => {
      formData.append(`files`, file);
    });

    try {
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setShowUpload(false);
        setSelectedFiles([]);
        fetchMedia();
        alert('Files uploaded successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this media file?')) return;

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMedia(media.filter(item => item.id !== id));
      } else {
        alert('Failed to delete media file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete media file');
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Media
          </button>
        </div>

        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Media Files</h2>
              <form onSubmit={handleUpload}>
                <div className="mb-4">
                  <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Files
                  </label>
                  <input
                    type="file"
                    id="files"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Selected files:</p>
                    <ul className="text-sm text-gray-500">
                      {selectedFiles.map((file, index) => (
                        <li key={index}>{file.name} ({formatFileSize(file.size)})</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpload(false);
                      setSelectedFiles([]);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={selectedFiles.length === 0 || uploading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📁</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No media files</h3>
              <p className="text-gray-500">Upload your first media file to get started.</p>
            </div>
          ) : (
            media.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {item.file_type.startsWith('image/') ? (
                    <img
                      src={item.file_path}
                      alt={item.alt_text || item.original_name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <div className="text-4xl mb-2">
                          {item.file_type.includes('pdf') ? '📄' : 
                           item.file_type.includes('doc') ? '📝' : '📎'}
                        </div>
                        <p className="text-xs text-gray-500">{item.file_type}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 truncate" title={item.original_name}>
                    {item.original_name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(item.file_size)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(item.file_path)}
                      className="flex-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 bg-red-100 text-red-700 text-xs px-2 py-1 rounded hover:bg-red-200"
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
    </AdminLayout>
  );
}
