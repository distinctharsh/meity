import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SubNavTabs from "@/components/SubNavTabs";

export default function Sitemap() {
  const [navigationData, setNavigationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      const response = await fetch("/api/navigation");
      if (response.ok) {
        const data = await response.json();
        setNavigationData(data);
      }
    } catch (error) {
      console.error("Failed to fetch navigation:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderChildren = (children, level) => {
    return children.map((child) => (
      <div key={child.id}>
        <div
          className="flex items-center py-2 border-b border-gray-200"
          style={{ paddingLeft: level * 28 + "px" }}
        >
          <span className="material-symbols-outlined text-blue-700 text-[16px] mr-2">
            chevron_right
          </span>

          <a
            href={child.href}
            className="text-[14px] text-[#222] hover:text-blue-600 transition-colors"
          >
            {child.text}
          </a>
        </div>

        {child.children &&
          child.children.length > 0 &&
          renderChildren(child.children, level + 1)}
      </div>
    ));
  };

  if (loading) {
    return (
      <main id="main">
        <PageHeader pagePath="/sitemap" />
        <SubNavTabs />
        <section className="mt-10 py-10">
          <div className="gi-container">
            <div className="animate-pulse space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main id="main">
      <PageHeader pagePath="/sitemap" />
      <SubNavTabs />

      <section className="mt-10 py-10">
        <div className="gi-container">
          <div className="bg-white">

            <div className="flex items-center py-2 border-b border-gray-300">
              <span className="material-symbols-outlined text-gray-600 text-[18px] mr-2">
                home
              </span>

              <a href="/" className="text-[14px] text-[#222] font-medium hover:text-blue-600">
                Home
              </a>
            </div>

            {navigationData && navigationData.length > 0 ? (
              navigationData.map((item) => (
                <div key={item.id}>
                  <div className="pt-6 pb-2">
                    <a href={item.href} className="text-[#1a3c6e] font-semibold text-[16px]">
                      {item.text}
                    </a>
                  </div>
                  <div className="border-b border-gray-300 mb-1" />
                  {item.children && item.children.length > 0 && renderChildren(item.children, 1)}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No navigation items available</p>
              </div>
            )}

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}