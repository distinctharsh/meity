import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Client-side only component for scripts
// const ClientScripts = () => {
//   useEffect(() => {
//     // Load jQuery if not already loaded
//     if (!window.jQuery) {
//       const jquery = document.createElement('script');
//       jquery.src = '/vendor/js/jquery-3.7.1.min.js';
//       jquery.async = true;
//       jquery.onload = () => {
//         // Load DataTables after jQuery is loaded
//         if (!window.jQuery.fn.DataTable) {
//           const datatables = document.createElement('script');
//           datatables.src = '/vendor/js/jquery.dataTables.min.js';
//           document.body.appendChild(datatables);
//         }
//       };
//       document.body.appendChild(jquery);
//     } else if (!window.jQuery.fn.DataTable) {
//       // If jQuery is loaded but DataTables is not
//       const datatables = document.createElement('script');
//       datatables.src = '/vendor/js/jquery.dataTables.min.js';
//       document.body.appendChild(datatables);
//     }
//   }, []);

//   return null;
// };

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();

  const [expandedSections, setExpandedSections] = useState({
    homepage: true,
    content: true,
    structure: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // ------------------------------------------------
  // Navigation
  // ------------------------------------------------

  const navigation = [
    {
      type: 'section',
      name: 'Dashboard',
      items: [
        { name: 'Dashboard', href: '/admin', icon: '📊', description: 'Overview & Statistics' }
      ]
    },
    {
      type: 'section',
      name: 'Homepage',
      items: [
        { name: 'Hero Slider', href: '/admin/slider', icon: '🖼️', description: 'Manage homepage slider' },
        { name: 'PM Quote', href: '/admin/pm-quotes', icon: '🗣️', description: 'Manage Prime Minister quote' },
        { name: 'Social Feed', href: '/admin/social', icon: '🔗', description: 'Manage social posts' },
        { name: 'Announcements', href: '/admin/announcements', icon: '📢', description: 'Site announcements' },
        { name: 'Partner Logos', href: '/admin/partner-logos', icon: '🏢', description: 'Manage partner logos carousel' },
        { name: 'What\'s New', href: '/admin/whats-new', icon: '📰', description: 'Manage what\'s new items' },
        { name: 'Important Links', href: '/admin/important-links', icon: '🔗', description: 'Manage important links' },
        { name: 'Vacancies & Tenders', href: '/admin/offerings', icon: '🎯', description: 'Manage Vacancies & Tenders' },
        // { name: 'Recent Documents', href: '/admin/recent-docs', icon: '📄', description: 'Manage recent documents' },
        // { name: 'About Section', href: '/admin/about-section', icon: 'ℹ️', description: 'Manage About Us section' },
        // { name: 'Promo Banners', href: '/admin/promo-section', icon: '🖼️', description: 'Manage promotional banners' }
      ]
    },
    {
      type: 'section',
      name: 'Content',
      items: [
        { name: 'Pages', href: '/admin/pages', icon: '📄', description: 'Create & manage pages' },
        { name: 'About Page', href: '/admin/about', icon: 'ℹ️', description: 'Manage About page content' },
        { name: 'Our Team', href: '/admin/our-team', icon: '👥', description: 'Manage ministry team' },
        { name: 'Directory', href: '/admin/directory', icon: '📇', description: 'Manage directory' },
        { name: 'Photo Galleries', href: '/admin/photos', icon: '📷', description: 'Manage photo galleries' },
        { name: 'Documents', href: '/admin/reports', icon: '📑', description: 'Manage Documents > Reports' },
        { name: 'RTI Page', href: '/admin/rti', icon: '📋', description: 'Manage RTI content & sections' }
      ]
    },
    {
      type: 'section',
      name: 'Site Structure',
      items: [
        { name: 'Navigation', href: '/admin/navigation', icon: '🧭', description: 'Menu management' },
        { name: 'Page Headers', href: '/admin/page-headers', icon: '🏷️', description: 'Hero & breadcrumb per-page' },
        { name: 'Footer', href: '/admin/footer', icon: '🔻', description: 'Manage site footer' }
      ]
    },
    { 
      type: 'section', 
      name: 'System & Security', 
      items: [
        { name: 'Audit Logs', href: '/admin/audit', icon: '🛡️', description: 'Monitor audit actions & trails' }
      ] 
    }
  ];

  // ------------------------------------------------
  // Authentication: Verify HttpOnly cookie
  // ------------------------------------------------

  useEffect(() => {
    if (!router.isReady) return;

    let active = true;
    let checking = false;
    let firstCheck = true;

    const checkSession = async () => {
      if (!active || checking) return;

      checking = true;

      try {
        const response = await fetch('/api/adm/auth/verify', {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
          headers: {
            Accept: 'application/json'
          }
        });

        if (!active) return;

        // Missing, expired or invalid JWT
        // Proxy clears the cms_token cookie and returns 401
        if (response.status === 401) {
          setUser(null);
          router.replace('/admin/login');
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Session verification failed: HTTP ${response.status}`
          );
        }

        const data = await response.json();

        if (!active) return;

        if (!data.authenticated || !data.user) {
          setUser(null);
          router.replace('/admin/login');
          return;
        }

        setUser(data.user);
        setAuthError('');

      } catch (error) {
        console.error('Session verification error:', error);

        // Do not log out an already authenticated user
        // just because of a temporary network/server error.
        if (active && firstCheck) {
          setAuthError(
            'Unable to verify your session. Please check your connection and try again.'
          );
        }

      } finally {
        checking = false;

        if (active && firstCheck) {
          firstCheck = false;
          setAuthLoading(false);
        }
      }
    };

    // Initial session verification
    checkSession();

    // Check session every 60 seconds
    const interval = setInterval(() => {
      checkSession();
    }, 60000);

    // Check session when browser tab becomes active
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSession();
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      active = false;

      clearInterval(interval);

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };

  }, [router.isReady, router]);

  // ------------------------------------------------
  // Logout
  // ------------------------------------------------

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await fetch('/api/adm/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store'
      });

      if (response.ok || response.status === 401) {
        setUser(null);
        router.replace('/admin/login');
        return;
      }

      const errorData = await response.json().catch(() => ({}));

      alert(
        errorData.message ||
        `Logout failed. HTTP ${response.status}`
      );

    } catch (error) {
      console.error('Logout error:', error);

      alert(
        'Unable to contact the server. Please try logging out again.'
      );

    } finally {
      setIsLoggingOut(false);
    }
  };

  // ------------------------------------------------
  // Authentication loading screen
  // ------------------------------------------------

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto"></div>

          <p className="mt-4 text-sm text-gray-600">
            Verifying administrator session...
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------
  // Authentication error screen
  // ------------------------------------------------

  if (authError && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow rounded-lg p-6 max-w-md text-center">
          <p className="text-red-600 mb-4">
            {authError}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-gray-800 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // ------------------------------------------------
  // Admin Layout
  // ------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">

      <Head>
        <title>Admin Panel - Cabinet Secretariat CMS</title>
        <meta
          name="description"
          content="Cabinet Secretariat CMS Admin Panel"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 flex">

        {/* Mobile sidebar */}

        <div
          className={`fixed inset-0 z-40 lg:hidden ${
            sidebarOpen ? 'block' : 'hidden'
          }`}
        >

          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">

            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>

                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">

              <div className="flex-shrink-0 flex items-center px-4">
                <div className="flex items-center">

                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">
                      CS
                    </span>
                  </div>

                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      Cabinet Secretariat CMS
                    </h1>

                    <p className="text-xs text-gray-500">
                      Admin Panel
                    </p>
                  </div>

                </div>
              </div>

              <nav className="mt-6 px-2 space-y-1">

                {navigation.map((section) => (
                  <div key={section.name} className="mb-4">

                    {section.name !== 'Dashboard' && (
                      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {section.name}
                      </h3>
                    )}

                    <div className="space-y-1">

                      {section.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`${
                            router.pathname === item.href
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          } group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200`}
                          onClick={() => setSidebarOpen(false)}
                        >

                          <span className="mr-3 text-lg">
                            {item.icon}
                          </span>

                          <div className="flex-1">
                            <div className="font-medium">
                              {item.name}
                            </div>

                            <div className="text-xs text-gray-500">
                              {item.description}
                            </div>
                          </div>

                        </Link>
                      ))}

                    </div>
                  </div>
                ))}

              </nav>
            </div>

            {/* Mobile user profile */}

            <div className="flex-shrink-0 border-t border-gray-200 p-4">

              <div className="flex items-center">

                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-600 font-medium text-sm">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {user.username}
                  </p>

                  <p className="text-xs text-gray-500">
                    Administrator
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="ml-2 p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  title="Sign out"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>

              </div>
            </div>

          </div>
        </div>

        {/* Desktop sidebar */}

        <div className="hidden lg:flex lg:flex-shrink-0">

          <div
            className={`flex flex-col transition-all duration-300 ease-in-out ${
              sidebarCollapsed ? 'w-20' : 'w-72'
            }`}
          >

            <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-gradient-to-b from-white to-gray-50 shadow-lg">

              <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">

                <div className="flex items-center flex-shrink-0 px-6 justify-between">

                  <div
                    className={`flex items-center transition-all duration-300 ${
                      sidebarCollapsed
                        ? 'opacity-0 w-0'
                        : 'opacity-100'
                    }`}
                  >

                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                      <span className="text-white font-bold text-lg">
                        CS
                      </span>
                    </div>

                    <div>
                      <h1 className="text-xl font-bold text-gray-900">
                        Cabinet Secretariat CMS
                      </h1>

                      <p className="text-xs text-gray-500">
                        Admin Panel
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    title={
                      sidebarCollapsed
                        ? 'Expand sidebar'
                        : 'Collapse sidebar'
                    }
                  >
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${
                        sidebarCollapsed ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                      />
                    </svg>
                  </button>

                </div>

                <nav
                  className={`mt-8 flex-1 px-4 space-y-4 transition-all duration-300 ${
                    sidebarCollapsed ? 'px-2' : 'px-4'
                  }`}
                >

                  {navigation.map((section) => (
                    <div key={section.name} className="space-y-1">

                      {section.name !== 'Dashboard' && (
                        <h3
                          className={`px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider transition-all duration-300 ${
                            sidebarCollapsed
                              ? 'opacity-0 h-0 overflow-hidden'
                              : 'opacity-100'
                          }`}
                        >
                          {section.name}
                        </h3>
                      )}

                      <div className="space-y-1">

                        {section.items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`${
                              router.pathname === item.href
                                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-r-3 border-blue-600 shadow-sm'
                                : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900'
                            } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${
                              sidebarCollapsed
                                ? 'justify-center px-2'
                                : ''
                            }`}
                            title={sidebarCollapsed ? item.name : ''}
                          >

                            <span
                              className={`text-lg transition-all duration-300 ${
                                sidebarCollapsed ? 'text-xl' : 'mr-4'
                              }`}
                            >
                              {item.icon}
                            </span>

                            <div
                              className={`flex-1 transition-all duration-300 ${
                                sidebarCollapsed
                                  ? 'opacity-0 w-0 overflow-hidden'
                                  : 'opacity-100'
                              }`}
                            >
                              <div className="font-medium">
                                {item.name}
                              </div>

                              <div className="text-xs text-gray-500">
                                {item.description}
                              </div>
                            </div>

                          </Link>
                        ))}

                      </div>
                    </div>
                  ))}

                </nav>
              </div>

              {/* Desktop user profile */}

              <div
                className={`flex-shrink-0 border-t border-gray-200 p-4 transition-all duration-300 ${
                  sidebarCollapsed ? 'px-2' : 'p-4'
                }`}
              >

                <div className="flex items-center">

                  <div
                    className={`w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center transition-all duration-300 ${
                      sidebarCollapsed ? 'mr-0' : 'mr-3'
                    }`}
                  >
                    <span className="text-gray-600 font-medium">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div
                    className={`flex-1 transition-all duration-300 ${
                      sidebarCollapsed
                        ? 'opacity-0 w-0 overflow-hidden'
                        : 'opacity-100'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-700">
                      {user.username}
                    </p>

                    <p className="text-xs text-gray-500">
                      Administrator
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`ml-2 p-2 text-gray-400 hover:text-gray-600 transition-all duration-200 rounded-xl hover:bg-red-50 hover:text-red-600 disabled:opacity-50 ${
                      sidebarCollapsed ? 'ml-0' : 'ml-2'
                    }`}
                    title="Sign out"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Main content */}

        <div className="flex-1 flex flex-col min-h-screen">

          {/* Mobile header */}

          <div className="sticky top-0 z-10 lg:hidden bg-white border-b border-gray-200 px-4 py-3">

            <div className="flex items-center justify-between">

              <button
                type="button"
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">
                  Open sidebar
                </span>

                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <div className="flex items-center">

                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-sm">
                    CS
                  </span>
                </div>

                <span className="text-lg font-semibold text-gray-900">
                  Cabinet Secretariat CMS
                </span>

              </div>

              <div className="w-10"></div>

            </div>
          </div>

          {/* Main content area */}

          <main className="flex-1 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
