import { useState, useEffect } from 'react';

const OfferingForm = ({ offering, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    link_url: '',
    category: '',
    display_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (offering) {
      setFormData({
        title: offering.title || '',
        description: offering.description || '',
        icon: offering.icon || '',
        link_url: offering.link_url || '',
        category: offering.category || '',
        display_order: offering.display_order || 0,
        is_active: offering.is_active !== undefined ? offering.is_active : true
      });
    }
  }, [offering]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
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
  };

  const iconOptions = [
    '🎯', '💡', '📱', '💻', '🌐', '🔒', '📊', '🚀', '⚡', '🎨',
    '📈', '🔧', '📋', '🎪', '🌟', '💼', '🏆', '🎁', '🔍', '📞'
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {offering ? 'Edit Offering' : 'Add New Offering'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter offering title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter offering description"
            required
          />
        </div>

        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
            Icon
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Select or enter emoji"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className={`p-2 rounded border ${
                    formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Category</option>
            <option value="schemes">Schemes</option>
            <option value="services">Services</option>
            <option value="initiatives">Initiatives</option>
            <option value="programs">Programs</option>
            <option value="tools">Tools</option>
            <option value="resources">Resources</option>
          </select>
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
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="https://example.com"
          />
        </div>

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
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            min="0"
          />
        </div>

        <div className="flex items-center">
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

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (offering ? 'Update Offering' : 'Create Offering')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfferingForm;
