import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function NavigationManagement() {
  const [navigationItems, setNavigationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      const response = await fetch('/api/admin/navigation');
      if (response.ok) {
        const data = await response.json();
        setNavigationItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch navigation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) return;

    try {
      const response = await fetch(`/api/admin/navigation/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNavigationItems(navigationItems.filter(item => item.id !== id));
      } else {
        alert('Failed to delete navigation item');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete navigation item');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const url = editingItem ? `/api/admin/navigation/${editingItem.id}` : '/api/admin/navigation';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingItem(null);
        fetchNavigation();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save navigation item');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save navigation item');
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      const response = await fetch(`/api/admin/navigation/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (response.ok) {
        fetchNavigation();
      } else {
        alert('Failed to update navigation item status');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Failed to update navigation item status');
    }
  };

  const buildNavigationTree = (items, parentId = null) => {
    return items
      .filter(item => item.parent_id === parentId)
      .sort((a, b) => a.display_order - b.display_order)
      .map(item => ({
        ...item,
        children: buildNavigationTree(items, item.id)
      }));
  };

  const renderNavigationTree = (items, level = 0) => {
    return items.map(item => (
      <div key={item.id} className={`${level > 0 ? 'ml-6' : ''}`}>
        <div className="flex items-center justify-between p-3 bg-white border rounded-lg mb-2">
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">{'  '.repeat(level)}</span>
            <span className="font-medium">{item.name}</span>
            {item.link && (
              <span className="ml-2 text-sm text-gray-500">({item.link})</span>
            )}
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
              item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {item.is_active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => toggleActive(item.id, item.is_active)}
              className={`px-2 py-1 text-xs rounded ${
                item.is_active
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {item.is_active ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => handleEdit(item)}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
        {item.children && item.children.length > 0 && (
          <div className="ml-4">
            {renderNavigationTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const navigationTree = buildNavigationTree(navigationItems);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Navigation Management</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Navigation Item
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <NavigationForm
                item={editingItem}
                navigationItems={navigationItems}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Navigation Structure</h2>
          {navigationTree.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No navigation items found. Click "Add Navigation Item" to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {renderNavigationTree(navigationTree)}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

const NavigationForm = ({ item, navigationItems, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    parent_id: null,
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        link: item.link || '',
        parent_id: item.parent_id || null,
        display_order: item.display_order || 0,
        is_active: item.is_active !== undefined ? item.is_active : true
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const topLevelItems = navigationItems.filter(item => !item.parent_id);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {item ? 'Edit Navigation Item' : 'Add Navigation Item'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter navigation item name"
            required
          />
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700">
            Link URL
          </label>
          <input
            type="text"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="/about or https://example.com"
          />
        </div>

        <div>
          <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">
            Parent Item
          </label>
          <select
            id="parent_id"
            name="parent_id"
            value={formData.parent_id || ''}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Top Level (No Parent)</option>
            {topLevelItems.map(parent => (
              <option key={parent.id} value={parent.id}>
                {parent.name}
              </option>
            ))}
          </select>
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
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {item ? 'Update Item' : 'Create Item'}
          </button>
        </div>
      </form>
    </div>
  );
};
