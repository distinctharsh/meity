import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SocialPostForm from '@/components/admin/SocialPostForm';
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function AdminSocialPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/social-posts');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Group posts by platform: twitter → facebook → instagram → youtube → others
  const grouped = useMemo(() => {
    const order = ['twitter', 'facebook', 'instagram', 'youtube'];
    const map = new Map();
    for (const p of posts) {
      const key = (p.platform || 'other').toLowerCase();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    // Sort within platform by display_order then id
    for (const arr of map.values()) {
      arr.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || a.id - b.id);
    }
    const entries = [];
    for (const k of order) {
      if (map.has(k)) entries.push([k, map.get(k)]);
    }
    for (const [k, v] of map.entries()) {
      if (!order.includes(k)) entries.push([k, v]);
    }
    return entries;
  }, [posts]);

  const onSaved = async () => {
    setCreating(false);
    setEditing(null);
    await load();
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    const res = await fetch(`/api/admin/social-posts/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Delete failed');
    } else {
      await load();
    }
  };

  // Initialize DataTable when posts are loaded and not in form mode
  useEffect(() => {
    if (typeof window === 'undefined' || loading || creating || editing) return;
    
    const $ = window.jQuery;
    if (!$) return;
    
    const selector = '#social-posts-table';
    
    if ($.fn.DataTable.isDataTable(selector)) {
      $(selector).DataTable().destroy();
    }
    
    $(selector).DataTable({
      paging: true,
      pageLength: 10,
      lengthChange: false,
      searching: true,
      ordering: true,
      info: true,
      autoWidth: false,
      responsive: true,
      order: [[0, 'asc'], [1, 'asc']], // Sort by platform then display_order
      columnDefs: [
        { orderable: false, targets: [3, 4] }, // Disable sorting on actions column
        { width: '20%', targets: [0] }, // Platform column
        { width: '50%', targets: [1] }, // URL column
        { width: '10%', targets: [2] }, // Order column
        { width: '10%', targets: [3] }, // Status column
        { width: '10%', targets: [4] }  // Actions column
      ]
    });
    
    return () => {
      if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
      }
    };
  }, [posts, loading, creating, editing]);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Social Media Posts</h1>
          <button
            onClick={() => { 
              setCreating(!creating); 
              setEditing(null);
              if (!creating) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            aria-label={creating ? 'Cancel' : 'Add Post'}
            title={creating ? 'Cancel' : 'Add Post'}
          >
            <span className="material-symbols-outlined">{creating ? 'close' : 'add'}</span>
          </button>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        )}

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        {creating && (
          <div className="bg-white rounded-lg shadow p-4 border border-gray-300 mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Post</h2>
            <SocialPostForm
              initial={null}
              onCancel={() => { setCreating(false); }}
              onSaved={onSaved}
            />
          </div>
        )}

        {editing && (
          <div className="bg-white rounded-lg shadow p-4 border border-gray-300 mb-6">
            <h2 className="text-lg font-semibold mb-4">Edit Post</h2>
            <SocialPostForm
              initial={editing}
              onCancel={() => { setEditing(null); }}
              onSaved={onSaved}
            />
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table id="social-posts-table" className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post URL</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {post.platform === 'twitter' && <FaTwitter className="text-sky-500 mr-2" />}
                        {post.platform === 'facebook' && <FaFacebook className="text-blue-600 mr-2" />}
                        {post.platform === 'instagram' && <FaInstagram className="text-pink-500 mr-2" />}
                        {post.platform === 'youtube' && <FaYoutube className="text-red-600 mr-2" />}
                        <span className="capitalize">{post.platform}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={post.post_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline truncate block max-w-md"
                        title={post.post_url}
                      >
                        {post.post_url}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {post.display_order || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${post.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {post.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditing(post);
                            setCreating(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border hover:bg-blue-50"
                          aria-label="Edit"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-blue-600 text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => onDelete(post.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full border text-red-600 hover:bg-red-50"
                          aria-label="Delete"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && posts.length === 0 && !creating && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No social media posts found. Click the "+" button to add a new post.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

