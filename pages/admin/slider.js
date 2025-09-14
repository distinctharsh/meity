import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import SliderForm from '../../components/admin/SliderForm';

export default function HeroSliderManagement() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/admin/slider');
      if (response.ok) {
        const data = await response.json();
        setSlides(data);
      }
    } catch (error) {
      console.error('Failed to fetch slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSlide(null);
    setShowForm(true);
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const response = await fetch(`/api/admin/slider/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSlides(slides.filter(slide => slide.id !== id));
      } else {
        alert('Failed to delete slide');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete slide');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const url = editingSlide ? `/api/admin/slider/${editingSlide.id}` : '/api/admin/slider';
      const method = editingSlide ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingSlide(null);
        fetchSlides();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save slide');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save slide');
    }
  };

  const handleReorder = async (fromIndex, toIndex) => {
    const newSlides = [...slides];
    const [movedSlide] = newSlides.splice(fromIndex, 1);
    newSlides.splice(toIndex, 0, movedSlide);

    setSlides(newSlides);

    // Update display_order in database
    try {
      await fetch('/api/admin/slider/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slides: newSlides }),
      });
    } catch (error) {
      console.error('Reorder error:', error);
      // Revert on error
      fetchSlides();
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Hero Slider Management</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Slide
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <SliderForm
                slide={editingSlide}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingSlide(null);
                }}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Current Slides</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {slides.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No slides found. Click "Add New Slide" to get started.
              </div>
            ) : (
              slides.map((slide, index) => (
                <div key={slide.id} className="px-6 py-4 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => index > 0 && handleReorder(index, index - 1)}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => index < slides.length - 1 && handleReorder(index, index + 1)}
                        disabled={index === slides.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <img
                      src={slide.image_url}
                      alt={slide.title || 'Slide'}
                      className="h-16 w-24 object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {slide.title || 'Untitled Slide'}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {slide.description || 'No description'}
                    </p>
                    {slide.link_url && (
                      <p className="text-xs text-blue-600 truncate">
                        Link: {slide.link_url}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex space-x-2">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
