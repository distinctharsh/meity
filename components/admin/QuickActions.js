import Link from 'next/link';

const QuickActions = () => {
  const quickActions = [
    {
      title: 'Add Hero Slide',
      description: 'Add a new slide to the homepage carousel',
      href: '/admin/slider?action=add',
      icon: '🖼️',
      color: 'bg-blue-500'
    },
    {
      title: 'Create Announcement',
      description: 'Post a new announcement',
      href: '/admin/announcements?action=add',
      icon: '📢',
      color: 'bg-green-500'
    },
    {
      title: 'Add Offering',
      description: 'Add a new service or scheme',
      href: '/admin/offerings?action=add',
      icon: '🎯',
      color: 'bg-purple-500'
    },
    {
      title: 'Upload Document',
      description: 'Upload a new document',
      href: '/admin/documents?action=add',
      icon: '📄',
      color: 'bg-orange-500'
    },
    {
      title: 'Add Partner',
      description: 'Add a new partner logo',
      href: '/admin/partners?action=add',
      icon: '🤝',
      color: 'bg-indigo-500'
    },
    {
      title: 'Media Upload',
      description: 'Upload images or files',
      href: '/admin/media?action=upload',
      icon: '📁',
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="block p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center">
              <div className={`${action.color} rounded-lg p-2 mr-3`}>
                <span className="text-white text-sm">{action.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
                <p className="text-xs text-gray-600">{action.description}</p>
              </div>
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
