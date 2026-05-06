import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function PhotosAdmin() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    images: [],
    alt_text: ''
  });

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await fetch('/api/admin/photos');
      if (response.ok) {
        const data = await response.json();
        setGalleries(data);
      }
    } catch (error) {
      console.error('Failed to fetch galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Upload images first
    const uploadedImages = await uploadImages();
    
    const submitData = {
      title: formData.title,
      date: formData.date,
      images: uploadedImages,
      alt_text: formData.alt_text
    };
    
    const url = editingGallery ? `/api/admin/photos/${editingGallery.id}` : '/api/admin/photos';
    const method = editingGallery ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingGallery(null);
        setFormData({ title: '', date: '', images: [], alt_text: '' });
        fetchGalleries();
        alert(editingGallery ? 'Gallery updated successfully!' : 'Gallery created successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;

    try {
      const response = await fetch(`/api/admin/photos/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setGalleries(galleries.filter(item => item.id !== id));
      } else {
        alert('Failed to delete gallery');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete gallery');
    }
  };

const handleEdit = (gallery) => {
  setEditingGallery(gallery);

  const dateObj = new Date(gallery.date);

  const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

  setFormData({
    title: gallery.title,
    date: formattedDate, 
    images: gallery.images || [],
    alt_text: gallery.alt_text || ''
  });

  setShowForm(true);
};

  const handleImageAdd = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: '', alt: '', file: null }]
    });
  };

  const handleImageChange = (index, field, value) => {
    const newImages = [...formData.images];
    newImages[index][field] = value;
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const handleFileSelect = (index, file) => {
    const newImages = [...formData.images];
    newImages[index].file = file;
    newImages[index].url = URL.createObjectURL(file); // Preview
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const handleImageRemove = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const uploadImages = async () => {
    const uploadedImages = [];
    
    for (const image of formData.images) {
      if (image.file) {
        // Upload file
        const formData = new FormData();
        formData.append('file', image.file);
        
        try {
          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            const result = await response.json();
            uploadedImages.push({
              url: result.url,
              alt: image.alt
            });
          } else {
            throw new Error('Upload failed');
          }
        } catch (error) {
          console.error('Upload error:', error);
          // Fallback to existing URL if upload fails
          uploadedImages.push({
            url: image.url,
            alt: image.alt
          });
        }
      } else if (image.url) {
        // Use existing URL
        uploadedImages.push({
          url: image.url,
          alt: image.alt
        });
      }
    }
    
    return uploadedImages;
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
          <h1 className="text-3xl font-bold text-gray-900">Photo Galleries</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Gallery
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => {
                setShowForm(false);
                setEditingGallery(null);
              }}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingGallery ? 'Edit Gallery' : 'Add New Gallery'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gallery Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery Images
                  </label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Upload Image File
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) handleFileSelect(index, file);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Or Enter Image URL
                          </label>
                          <input
                            type="url"
                            placeholder="Image URL"
                            value={image.file ? '' : image.url}
                            onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            disabled={!!image.file}
                          />
                        </div>
                      </div>
                      
                      {image.url && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Preview
                          </label>
                          <img
                            src={image.url}
                            alt="Preview"
                            className="h-32 w-auto object-cover rounded border border-gray-200"
                          />
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Alt text"
                          value={image.alt}
                          onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageRemove(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleImageAdd}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Add Image
                  </button>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery Alt Text (for main thumbnail)
                  </label>
                  <input
                    type="text"
                    value={formData.alt_text}
                    onChange={(e) => setFormData({...formData, alt_text: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingGallery(null);
                      setFormData({ title: '', date: '', images: [], alt_text: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {editingGallery ? 'Update Gallery' : 'Create Gallery'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📷</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No photo galleries</h3>
              <p className="text-gray-500">Create your first photo gallery to get started.</p>
            </div>
          ) : (
            galleries.map((gallery) => (
              <div key={gallery.id} className="bg-white rounded-lg shadow overflow-hidden">
                {gallery.images && gallery.images.length > 0 ? (
                  <img
                    src={gallery.images[0].url}
                    alt={gallery.images[0].alt || gallery.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-xs text-gray-500">No images</p>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{gallery.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {gallery.date && new Date(gallery.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {gallery.images ? gallery.images.length : 0} images
                  </p>
                  
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(gallery)}
                      className="flex-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(gallery.id)}
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
