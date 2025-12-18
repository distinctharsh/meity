import { useState, useEffect, useRef } from 'react';
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
        <div className="flex items-center justify-between p-3 bg-white/70 border border-gray-200 rounded-xl mb-2 shadow-sm backdrop-blur-sm">
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">{'  '.repeat(level)}</span>
            <span className="font-medium">{item.name}</span>
            {item.link && (
              <span className="ml-2 text-sm text-gray-500">({item.link})</span>
            )}
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
              {item.is_active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleActive(item.id, item.is_active)}
              className={`px-2 py-1 text-xs rounded ${item.is_active
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
            >
              {item.is_active ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => handleEdit(item)}
              className="p-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
              title="Edit"
              aria-label="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687 1.687m-2.496-0.79l-8.74 8.74a2.25 2.25 0 00-.57.99l-.53 2.122a.75.75 0 00.91.91l2.122-.53a2.25 2.25 0 00.99-.57l8.74-8.74m-2.496-0.79l2.496 0.79M16.862 4.487a1.875 1.875 0 112.652 2.652" />
              </svg>
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-2 rounded-md text-red-600 hover:text-red-800 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer"
              title="Delete"
              aria-label="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M9 3a1 1 0 0 0-1 1v1H4.5a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5H16V4a1 1 0 0 0-1-1H9z" />
                <path d="M6.5 7h11l-.84 11.2A2 2 0 0 1 14.67 20H9.33a2 2 0 0 1-1.99-1.8L6.5 7z" />
              </svg>
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
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow cursor-pointer"
            aria-label="Add Navigation Item"
            title="Add Navigation Item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            />
            <div className="relative bg-white border border-gray-200 shadow-2xl rounded-xl w-full max-w-4xl max-h-[92vh] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50/70">
                <h3 className="text-lg font-semibold text-gray-900">{editingItem ? 'Edit Navigation Item' : 'Add Navigation Item'}</h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(92vh - 52px)' }}>
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
  const linkInputRef = useRef(null);
  const prevNameRef = useRef('');
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
      prevNameRef.current = item.name || '';
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleLinkPaste = (e) => {
    const base = getEffectiveParentBase(formData.parent_id);
    if (!base) return; // allow default when no parent
    const text = (e.clipboardData || window.clipboardData).getData('text');
    if (typeof text !== 'string') return;
    e.preventDefault();
    const parentNoSlash = base.replace(/\/$/, '');
    const stripped = text
      .replace(new RegExp('^' + parentNoSlash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\/'), '')
      .replace(/^\//, '');
    const combined = joinParentChild(base, stripped);
    // Update state and input value, move caret to end
    setFormData((prev) => ({ ...prev, link: combined }));
    setTimeout(() => {
      if (linkInputRef.current) {
        const caret = combined.length;
        linkInputRef.current.setSelectionRange(caret, caret);
      }
    }, 0);
  };

  const getEffectiveParentBase = (parentId) => {
    const parent = getParentById(parentId);
    if (!parent) return '';
    const link = parent.link || '';
    const base = link && !isExternal(link) ? link : (parent.name ? `/${slugify(parent.name)}` : '');
    return ensureLeadingSlash(base.replace(/\/$/, ''));
  };

  const ensureLeadingSlash = (s) => {
    if (!s) return s;
    return s.startsWith('/') ? s : '/' + s;
  };

  const isExternal = (url) => /^https?:\/\//i.test(url || '');

  const getParentById = (id) => navigationItems.find((it) => String(it.id) === String(id));

  const slugify = (s = '') => {
    return String(s)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-/]/g, '');
  };

  const joinParentChild = (parentLink, childPart) => {
    const base = ensureLeadingSlash((parentLink || '').replace(/\/$/, ''));
    const child = (childPart || '').replace(/^\//, '');
    return child ? `${base}/${child}` : `${base}/`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Pre-compute parent link if parent_id is changing to drive focus/selection after state update
    const parentForFocus = name === 'parent_id' ? getParentById(value) : null;
    const parentLinkForFocus = parentForFocus?.link || '';
    setFormData(prev => {
      let next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'parent_id') {
        const effectiveParent = getEffectiveParentBase(value) || '/';
        // If a name is already present, append its slug to the parent prefix.
        const childSlug = slugify(prev.name || '');
        next.link = joinParentChild(effectiveParent, childSlug);
      }
      if (name === 'link') {
        // When typing link, if a parent is selected and it's not an external URL, keep parent prefix
        const effectiveParent = getEffectiveParentBase(prev.parent_id);
        if (effectiveParent && !isExternal(value)) {
          const parentNoSlash = effectiveParent.replace(/\/$/, '');
          const stripped = String(value || '')
            .replace(new RegExp('^' + parentNoSlash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\/'), '')
            .replace(/^\//, '');
          next.link = joinParentChild(effectiveParent, stripped);
        } else if (!isExternal(value)) {
          next.link = ensureLeadingSlash(value);
        }
      }

      // If admin is editing the `name` field, auto-generate the child slug when appropriate.
      if (name === 'name') {
        const newName = String(value || '');
        const newSlug = slugify(newName);
        const prevSlug = slugify(prevNameRef.current || '');
        const effectiveParent = getEffectiveParentBase(prev.parent_id) || '';
        const parentNoSlash = (effectiveParent || '').replace(/\/$/, '');
        const currentLink = String(prev.link || next.link || '');
        let currentChildPart = currentLink;
        if (parentNoSlash && currentLink.startsWith(parentNoSlash)) {
          currentChildPart = currentLink.replace(new RegExp('^' + parentNoSlash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\/'), '');
        } else {
          currentChildPart = currentLink.replace(/^\//, '');
        }

        // Update link if it's empty, or equals previous auto-generated slug, or only parent prefix
        const shouldUpdate = !currentLink || currentChildPart === '' || currentChildPart === prevSlug;
        if (shouldUpdate) {
          next.link = joinParentChild(effectiveParent || '/', newSlug);
        }
        // schedule prevName update
        setTimeout(() => { prevNameRef.current = newName; }, 0);
      }

      return next;
    });
    if (name === 'parent_id' && parentLinkForFocus) {
      // Focus the Link input and move cursor to end so admin can continue typing child path
      const preset = joinParentChild(getEffectiveParentBase(value) || parentLinkForFocus, '');
      setTimeout(() => {
        if (linkInputRef.current) {
          linkInputRef.current.focus();
          try {
            const caret = preset.length;
            linkInputRef.current.setSelectionRange(caret, caret);
          } catch (_) { }
        }
      }, 0);
    }
  };

  const guardCaretAtPrefix = () => {
    const base = getEffectiveParentBase(formData.parent_id);
    if (!base || !linkInputRef.current) return;
    const prefix = joinParentChild(base, '');
    try {
      const start = linkInputRef.current.selectionStart ?? 0;
      const end = linkInputRef.current.selectionEnd ?? 0;
      const guard = prefix.length;
      if (start < guard || end < guard) {
        linkInputRef.current.setSelectionRange(guard, guard);
      }
    } catch (_) { }
  };

  const handleLinkKeyDown = (e) => {
    const base = getEffectiveParentBase(formData.parent_id);
    if (!base) return;
    const prefix = joinParentChild(base, '');
    const guard = prefix.length;
    const input = linkInputRef.current;
    if (!input) return;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    // Prevent deleting any part of the prefix
    if ((e.key === 'Backspace' && start <= guard) || (e.key === 'Delete' && end < guard)) {
      e.preventDefault();
      input.setSelectionRange(guard, guard);
    }
  };

  const topLevelItems = navigationItems.filter(item => !item.parent_id);

  return (
    <div>
      {/* <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {item ? 'Edit Navigation Item' : 'Add Navigation Item'}
      </h2> */}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name + Parent in one row on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white px-3 py-2.5"
              placeholder="Enter navigation item name"
              required
            />
          </div>

          {/* Parent Item */}
          <div>
            <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">Parent Item</label>
            <select
              id="parent_id"
              name="parent_id"
              value={formData.parent_id || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white px-3 py-2.5"
            >
              <option value="">Top Level (No Parent)</option>
              {topLevelItems.map(parent => (
                <option key={parent.id} value={parent.id}>{parent.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Link + Meta (two columns on md+) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700">Link URL</label>
            <input
              type="text"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              ref={linkInputRef}
              onKeyDown={handleLinkKeyDown}
              onFocus={guardCaretAtPrefix}
              onClick={guardCaretAtPrefix}
              onMouseUp={guardCaretAtPrefix}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white px-3 py-2.5 placeholder-gray-400"
              placeholder="Type child part, e.g. team (parent prefix auto-added)"
            />
            <p className="text-xs text-gray-500 mt-1">If a parent is selected, we’ll prefix its link automatically. External URLs are kept as is.</p>
          </div>
          <div>
            <div>
              <label htmlFor="display_order" className="block text-sm font-medium text-gray-700">Display Order</label>
              <input
                type="number"
                id="display_order"
                name="display_order"
                value={formData.display_order}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white px-3 py-2.5"
                min="0"
              />
            </div>
            <div className="flex items-center mt-4">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active</label>
            </div>
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {item ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
