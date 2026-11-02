import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AuditLogsPage() {
  const [activeTab, setActiveTab] = useState('actions'); // 'actions' or 'trails'
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchLogs(activeTab);
  }, [activeTab]);

  // Reset page and search on tab change
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm('');
  }, [activeTab]);

  const fetchLogs = async (tab) => {
    setLoading(true);
    try {
      const endpoint = tab === 'actions' ? '/api/adm/audit-actions' : '/api/adm/audit-trails';
      const res = await fetch(endpoint);
      const data = res.ok ? await res.json() : [];
      setLogs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load audit logs', e);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter logs based on search term
  const filteredLogs = logs.filter((log) => {
    const searchString = searchTerm.toLowerCase();
    if (activeTab === 'actions') {
      return (
        String(log.id).includes(searchString) ||
        String(log.module || '').toLowerCase().includes(searchString) ||
        String(log.action_type || '').toLowerCase().includes(searchString) ||
        String(log.username || '').toLowerCase().includes(searchString) ||
        String(log.description || '').toLowerCase().includes(searchString) ||
        String(log.ip_address || '').toLowerCase().includes(searchString)
      );
    } else {
      return (
        String(log.id).includes(searchString) ||
        String(log.username || '').toLowerCase().includes(searchString) ||
        String(log.action || '').toLowerCase().includes(searchString) ||
        String(log.ip_address || '').toLowerCase().includes(searchString) ||
        String(log.user_agent || '').toLowerCase().includes(searchString)
      );
    }
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="p-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor administrator CRUD actions and login session audit trails (Past 1 Month).</p>
          </div>
          <div className="flex bg-gray-200 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'actions' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Audit Actions (CRUD)
            </button>
            <button
              onClick={() => setActiveTab('trails')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'trails' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Audit Trails (Logins)
            </button>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-200 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Search & Entries Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-b border-gray-200 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>
              <div className="w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {activeTab === 'actions' ? (
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 text-gray-600 font-semibold">
                    <tr>
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Module</th>
                      <th className="px-4 py-3 text-left">Action</th>
                      <th className="px-4 py-3 text-left">User</th>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-left">IP Address</th>
                      <th className="px-4 py-3 text-left">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {currentLogs.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500">No audit actions found.</td>
                      </tr>
                    ) : (
                      currentLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900">{log.id}</td>
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                              {log.module}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                              log.action_type === 'CREATE' ? 'bg-green-100 text-green-800' :
                              log.action_type === 'UPDATE' ? 'bg-amber-100 text-amber-800' :
                              log.action_type === 'DELETE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {log.action_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium">{log.username || 'System Admin'}</td>
                          <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={log.description}>{log.description || '-'}</td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">{log.ip_address || '-'}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 text-gray-600 font-semibold">
                    <tr>
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Username</th>
                      <th className="px-4 py-3 text-left">Action / Event</th>
                      <th className="px-4 py-3 text-left">IP Address</th>
                      <th className="px-4 py-3 text-left">User Agent</th>
                      <th className="px-4 py-3 text-left">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {currentLogs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No audit trails found.</td>
                      </tr>
                    ) : (
                      currentLogs.map((trail) => (
                        <tr key={trail.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900">{trail.id}</td>
                          <td className="px-4 py-3 font-medium">{trail.username || 'Admin'}</td>
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-700">
                              {trail.action}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">{trail.ip_address || '-'}</td>
                          <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate" title={trail.user_agent}>{trail.user_agent || '-'}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">
                            {new Date(trail.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls Bar */}
            {filteredLogs.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-t border-gray-200 gap-4">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLogs.length)} of {filteredLogs.length} entries {logs.length !== filteredLogs.length && `(filtered from ${logs.length} total entries)`}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <span className="text-sm font-medium text-gray-700 px-2">
                    Page {currentPage} of {totalPages || 1}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}