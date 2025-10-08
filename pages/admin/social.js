import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SocialPostForm from '@/components/admin/SocialPostForm';

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

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Social Media Posts</h1>
        <button onClick={() => { setCreating(true); setEditing(null); }} className="px-4 py-2 bg-blue-600 text-white rounded-md">Add Post</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !creating && !editing && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post URL</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2 text-sm text-gray-700">{p.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 capitalize">{p.platform}</td>
                  <td className="px-4 py-2 text-sm text-blue-700 truncate max-w-xs"><a href={p.post_url} target="_blank" rel="noreferrer" className="underline">{p.post_url}</a></td>
                  <td className="px-4 py-2 text-sm text-gray-700">{p.display_order}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{p.is_active ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-sm text-right space-x-2">
                    <button onClick={() => { setEditing(p); setCreating(false); }} className="px-3 py-1 border rounded">Edit</button>
                    <button onClick={() => onDelete(p.id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(creating || editing) && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-300">
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Post' : 'Add Post'}</h2>
          <SocialPostForm
            initial={editing}
            onCancel={() => { setCreating(false); setEditing(null); }}
            onSaved={onSaved}
          />
        </div>
      )}
    </AdminLayout>
  );
}
