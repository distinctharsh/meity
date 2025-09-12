import React, { useState, useEffect } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";
import SocialMedia from "./icons/SocialMedia";

// Helper function to get embed URLs for different platforms
const getEmbedUrl = (url = '') => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Handle Twitter/X.com URLs
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      // Extract tweet ID from URL
      const tweetId = url.split('/').pop().split('?')[0];
      return `https://platform.twitter.com/embed/Tweet.html?dnt=true&embedId=twitter-widget&hideCard=false&hideThread=true&id=${tweetId}&lang=en&theme=light&widgetsVersion=2615f7e52b7e0%3A1702314776716&width=550`;
    }

    if (hostname.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500`;
    }

    if (hostname.includes('instagram.com')) {
      return `https://www.instagram.com/p/${url.split('/').filter(Boolean).pop()}/embed`;
    }

    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      const videoId = url.includes('youtube.com')
        ? new URLSearchParams(new URL(url).search).get('v')
        : url.split('/').pop().split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?rel=0`;
    }

    return '';
  } catch (e) {
    console.error('Error generating embed URL:', e);
    return '';
  }
};

// Extract YouTube video ID from URL
const getYoutubeId = (url) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('youtu.be')
      ? urlObj.pathname.slice(1)
      : new URLSearchParams(urlObj.search).get('v');
  } catch (e) {
    return '';
  }
};

const SocialMediaPreview = ({
  // Multiple YouTube videos can be passed as an array
  youtubeVideos = [
    'https://www.youtube.com/watch?v=Bkno8p81fWc',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=9bZkp7q19f0'
  ],
  // Single Twitter URL
  twitterUrl = "https://x.com/GoI_MeitY/status/1959913113169305755",
  facebookUrl = "https://www.facebook.com/harshsinghjii",
  instagramUrl = "https://www.instagram.com/distinctharsh"
}) => {
  const [currentPreview, setCurrentPreview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const socialMediaItems = [
    // Twitter section
    {
      type: 'twitter',
      url: twitterUrl,
      title: 'X (Twitter)',
      embedUrl: getEmbedUrl(twitterUrl),
      isSingle: true
    },
    // Multiple YouTube videos
    ...youtubeVideos.map((videoUrl, index) => ({
      type: 'youtube',
      url: videoUrl,
      title: `Video ${index + 1}`,
      embedUrl: getEmbedUrl(videoUrl),
      isSingle: false
    })),
    // Other social media
    {
      type: 'facebook',
      url: facebookUrl,
      title: 'Facebook',
      embedUrl: getEmbedUrl(facebookUrl),
      isSingle: true
    },
    {
      type: 'instagram',
      url: instagramUrl,
      title: 'Instagram',
      embedUrl: getEmbedUrl(instagramUrl),
      isSingle: true
    },
  ].filter(item => item.url);

  const openPreview = (index) => {
    setCurrentIndex(index);
    setCurrentPreview(socialMediaItems[index]);
    document.body.style.overflow = 'hidden';
  };

  const closePreview = () => {
    setCurrentPreview(null);
    document.body.style.overflow = 'auto';
  };

  const navigatePreview = (direction) => {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = socialMediaItems.length - 1;
    if (newIndex >= socialMediaItems.length) newIndex = 0;

    setCurrentIndex(newIndex);
    setCurrentPreview(socialMediaItems[newIndex]);
  };

  // Add custom scrollbar hiding
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="w-full min-h-[525px] bg-[#25355a] py-4 px-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-4 justify-center sm:justify-start sm:pl-8">
        <SocialMedia className="w-8 h-8 text-white mr-2" />
        <h2 className="text-white text-xl font-bold leading-none m-0">
          In Social Media
        </h2>
      </div>

      {/* Social Media Grid */}
      <div className="w-full max-w-6xl mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* YouTube Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-3 border-b">
              <h3 className="text-gray-800 font-semibold text-center">YouTube</h3>
            </div>
            <div className="p-2 h-[400px] overflow-y-auto flex flex-col gap-3">
              {youtubeVideos.slice(0, 3).map((videoUrl, index) => (
                <div key={index} className="flex-1 min-h-[120px]">
                  <div className="aspect-video w-full rounded overflow-hidden">
                    <iframe
                      title={`YouTube Video ${index + 1}`}
                      src={getEmbedUrl(videoUrl)}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Twitter Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-3 border-b">
              <h3 className="text-gray-800 font-semibold text-center">Twitter</h3>
            </div>
            <div className="h-[400px]">
              <iframe
                src={socialMediaItems.find(item => item.type === 'twitter')?.embedUrl}
                className="w-full h-full border-0"
                allowTransparency={true}
                allowFullScreen
                loading="lazy"
                title="Twitter Post"
              />
            </div>
          </div>

          {/* Facebook Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden ">
            <div className="p-3 border-b">
              <h3 className="text-gray-800 font-semibold text-center">Facebook</h3>
            </div>
            <div className="h-[400px] overflow-y-auto">
              <iframe
                src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fmeityindia%2Fposts%2Fpfbid0ETpZZhBirRP1kqcFF1ff5qSGjFEMeMkepThq1gn8tocj6oxibTo9xFrfcBZ8f6oCl&show_text=true&width=100%"
                className="w-full h-full min-h-[400px] border-0"
                scrolling="no"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                title="Facebook Post"
              />
            </div>
          </div>

          {/* Instagram Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="p-3 border-b">
              <h3 className="text-gray-800 font-semibold text-center">Instagram</h3>
            </div>
            <div className="flex-1 min-h-0">
              <div className="h-full overflow-y-auto p-2">
                <div className="w-full" style={{ minHeight: '500px' }}>
                  <iframe
                    src="https://www.instagram.com/p/CdEhFSNMbC7/embed/captioned"
                    className="w-full border-0"
                    style={{ minHeight: '500px' }}
                    allowTransparency={true}
                    allowFullScreen
                    scrolling="yes"
                    loading="lazy"
                    title="Instagram Post"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {currentPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closePreview}
            className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-all"
            aria-label="Close preview"
          >
            <FaTimes />
          </button>

          <button
            onClick={() => navigatePreview(-1)}
            className="absolute left-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-all"
            aria-label="Previous post"
          >
            <FaChevronLeft />
          </button>

          <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b">
              <h3 className="text-[#25355a] text-lg font-semibold">{currentPreview.title}</h3>
              <a
                href={currentPreview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                Open in {currentPreview.type}
                <FaExternalLinkAlt className="ml-1 text-xs" />
              </a>
            </div>
            <div className="w-full h-[80vh]">
              <iframe
                src={currentPreview.embedUrl}
                className="w-full h-full border-0"
                allowTransparency={true}
                allowFullScreen
                loading="lazy"
                title={`${currentPreview.title} Full Preview`}
              />
            </div>
          </div>

          <button
            onClick={() => navigatePreview(1)}
            className="absolute right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-all"
            aria-label="Next post"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialMediaPreview;
