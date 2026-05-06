import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import Image from "next/image";
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "next/router";

export default function PhotoGalleryDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchGallery();
    }
  }, [id]);

  const fetchGallery = async () => {
    try {
      const response = await fetch(`/api/admin/photos/${id}`);
      if (response.ok) {
        const data = await response.json();
        setGallery(data);
      } else if (response.status === 404) {
        console.error('Gallery not found');
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToGalleries = () => {
    router.push('/media/photos');
  };

  if (loading) {
    return (
      <>
        <main id="main">
          <PageHeader pagePath="/media/photos" />
          <SubNavTabs />
          <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>
            <div className="gi-container">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </main>
      </>
    );
  }

  if (!gallery) {
    return (
      <>
        <main id="main">
          <PageHeader pagePath="/media/photos" />
          <SubNavTabs />
          <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>
            <div className="gi-container">
              <div className="text-center py-10">
                <h2 className="text-2xl font-bold mb-4">Gallery Not Found</h2>
              </div>
            </div>
          </section>
          <Footer />
        </main>
      </>
    );
  }

  return (
    <>
      <main id="main">
        {/* Dynamic Page Header */}
        <PageHeader pagePath="/media/photos" />

        {/* Tabs (DB-driven for current route) */}
        <SubNavTabs />

        {/* Main Content */}
        <section className="mt-10 py-10" style={{ borderRadius: '20px' }}>
          <div className="gi-container">
            {/* Header with back button */}
            <div className="flex items-center justify-between mb-6">
              <div>
               
                <h1 className="text-3xl font-bold">{gallery.title}</h1>
                <p className="text-gray-600">
                  {gallery.date ? new Date(gallery.date).toLocaleDateString('en-GB') : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">{gallery.images ? gallery.images.length : 0} Photos</p>
              </div>
            </div>

            {/* Photo Grid */}
            {gallery.images && gallery.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gallery.images.map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={image.url}
                        alt={`${gallery.title} - Photo ${index + 1}`}
                        className="w-full h-64 object-cover object-top"
                        width={400}
                        height={400}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No photos available in this gallery.</p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
