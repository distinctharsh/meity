import { useState, useEffect } from 'react';
import { authenticatedFetch } from '../../utils/auth';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    heroSlides: 0,
    announcements: 0,
    offerings: 0,
    documents: 0,
    socialPosts: 0,
    partners: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await authenticatedFetch('/api/admin/stats');
        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Overview</h2>
        <div className="animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statItems = [
    { label: 'Hero Slides', value: stats.heroSlides, color: 'bg-blue-500', icon: '🖼️' },
    { label: 'Announcements', value: stats.announcements, color: 'bg-green-500', icon: '📢' },
    { label: 'Offerings', value: stats.offerings, color: 'bg-purple-500', icon: '🎯' },
    { label: 'Documents', value: stats.documents, color: 'bg-orange-500', icon: '📄' },
    { label: 'Social Posts', value: stats.socialPosts, color: 'bg-pink-500', icon: '📱' },
    { label: 'Partners', value: stats.partners, color: 'bg-indigo-500', icon: '🤝' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className={`${item.color} rounded-lg p-2 mr-3`}>
                <span className="text-white text-lg">{item.icon}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
