import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import SubNavTabs from "@/components/SubNavTabs";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "next/router";

export default function PhotoGalleryDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchGallery = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/photos/${id}`);
        if (response.ok) {
          const data = await response.json();
          setGallery(data);
        } else {
          setGallery(null);
          console.error("Gallery not found");
        }
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
        setGallery(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [router.isReady, id]);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);
  

  const openImage = (image, index) => {
    setSelectedIndex(index);
    setSelectedImage(image.url);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const changeImage = (direction) => {
    if (!gallery?.images?.length) return;

    const total = gallery.images.length;
    const nextIndex = (selectedIndex + direction + total) % total;

    setSelectedIndex(nextIndex);
    setSelectedImage(gallery.images[nextIndex].url);
  };

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeImage();
      }

      if (event.key === "ArrowLeft") {
        changeImage(-1);
      }

      if (event.key === "ArrowRight") {
        changeImage(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, selectedIndex, gallery]);

  if (loading) {
    return (
      <main id="main">
        <PageHeader pagePath="/media/photos" />
        <SubNavTabs />
        <section className="mt-10 py-10">
          <div className="gi-container">
            <div className="animate-pulse">
              <div className="mb-4 h-8 w-1/4 rounded bg-gray-200" />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="h-64 rounded-xl bg-gray-200"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (!gallery) {
    return (
      <main id="main">
        <PageHeader pagePath="/media/photos" />
        <SubNavTabs />
        <section className="mt-10 py-10">
          <div className="gi-container">
            <div className="py-10 text-center">
              <h2 className="mb-4 text-2xl font-bold">
                Gallery Not Found
              </h2>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <>
      <main id="main">
        <PageHeader pagePath="/media/photos" />
        <SubNavTabs />

        <section
          className="mt-10 py-10"
          style={{ borderRadius: "20px" }}
        >
          <div className="gi-container">
            {/* Gallery Header */}
            <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                  {gallery.title}
                </h1>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  {gallery.date
                    ? new Date(gallery.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </p>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  {gallery.images?.length || 0} Photos
                </span>
              </div>
            </div>

            {/* Photo Grid */}
            {gallery.images?.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {gallery.images.map((image, index) => (
                  <div
                    key={image.id ?? index}
                    className="group relative overflow-hidden rounded-xl border border-gray-200/80 bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl"
                  >
                    <img
                      src={image.url}
                      alt={`${gallery.title} - Photo ${index + 1}`}
                      className="h-64 w-full cursor-pointer object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      width={400}
                      height={400}
                      onClick={() => openImage(image, index)}
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <button
                      type="button"
                      onClick={() => openImage(image, index)}
                      aria-label={`Zoom photo ${index + 1}`}
                      className="absolute bottom-3 right-3 flex cursor-pointer items-center justify-center rounded-full border border-white/50 bg-white/90 p-2.5 text-gray-800 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black active:scale-95"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
                <p className="font-medium text-gray-500">
                  No photos available in this gallery.
                </p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-3 sm:p-6"
          onClick={closeImage}
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery viewer"
        >
          {/* Modal Container */}
          <div
            className="relative w-full max-w-[740px] overflow-hidden rounded-md shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Main Image Area */}
            <div className="relative flex h-[45vh] min-h-[240px] max-h-[500px] items-center justify-center bg-black sm:h-[55vh]">
              <img
                src={selectedImage}
                alt={`${gallery.title} - Photo ${selectedIndex + 1}`}
                className="h-full w-full object-contain"
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={closeImage}
                aria-label="Close image viewer"
                className="absolute right-2 top-2 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded bg-black/80 text-3xl leading-none text-white transition hover:bg-black"
              >
                {"×"}
              </button>
            </div>

            {/* Blue Caption Bar */}
            <div className="flex min-h-[68px] items-center justify-between gap-2 border-t border-white/40 bg-[#1e3a78] px-2 py-3 text-white sm:px-4">

              {/* Previous Button */}
              <button
                type="button"
                onClick={() => changeImage(-1)}
                aria-label="Previous image"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Gallery Title */}
              <div className="min-w-0 flex-1 text-center">
                <p className="text-sm font-medium leading-6 sm:text-lg">
                  {gallery.title}
                </p>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => changeImage(1)}
                aria-label="Next image"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}