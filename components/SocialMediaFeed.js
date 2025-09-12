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
    <div className="w-full min-h-[525px] bg-[#25355a] py-7 px-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-8 justify-center sm:justify-start sm:pl-[125px]">
        <SocialMedia className="w-10 h-10 text-white mr-4" />
        <h2 className="text-white text-2xl sm:text-3xl font-bold leading-none m-0 ml-5">
          In Social Media
        </h2>
      </div>

      {/* Social Media Sections */}
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Twitter Section */}
        {socialMediaItems.filter(item => item.type === 'twitter').map((item, index) => (
          <div key={item.type} className="mb-8">
            <h3 className="text-white text-xl font-semibold mb-4">Twitter</h3>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 h-[600px] w-full">
                <iframe
                  src={item.embedUrl}
                  className="w-full h-full border-0"
                  allowTransparency={true}
                  allowFullScreen
                  loading="lazy"
                  title="Twitter Post"
                />
              </div>
            </div>
          </div>
        ))}

        {/* YouTube Section */}
        <div className="mb-8">
          <h3 className="text-white text-xl font-semibold mb-4">YouTube Videos</h3>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px]">
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {youtubeVideos.map((videoUrl, index) => (
                <div key={index} className="aspect-video w-full rounded-md overflow-hidden shadow-sm">
                  <iframe
                    title={`YouTube Video ${index + 1}`}
                    src={getEmbedUrl(videoUrl)}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Facebook Section */}
        <div className="mb-8">
          <h3 className="text-white text-xl font-semibold mb-4">Facebook Posts</h3>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px]">
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {/* Example posts - you can pass them as props if needed */}
              {[
                'https://www.facebook.com/meityindia/posts/pfbid0ETpZZhBirRP1kqcFF1ff5qSGjFEMeMkepThq1gn8tocj6oxibTo9xFrfcBZ8f6oCl',
                'https://www.facebook.com/meityindia/posts/pfbid02Phw2HNHCngvQczo35v4HnSdPBAyLU1bTFH8JHHy1hwQi7ckoZdRAEbJcPuGL3Q8il',
                'https://www.facebook.com/meityindia/posts/pfbid024ambHS6Fa5u3UKxt5WXTDwg6ATRoQf3pbUDEF37EyC928mmAFixm14mxezuerMUrl',
                'https://www.facebook.com/meityindia/posts/pfbid0joj5xRsfsRdzVfbmCnYxL672yNBxn6k4ZB7NZvd8ViuApCMri43nDerpXZjdvTa1l',
                'https://www.facebook.com/meityindia/videos/530102659568553/'
              ].map((postUrl, index) => (
                <div key={index} className="w-full rounded-md overflow-hidden shadow-sm">
                  <iframe
                    title={`FacebookPost${index}`}
                    src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(postUrl)}&show_text=true&width=500`}
                    className="w-full h-[500px] border-0"
                    scrolling="no"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Other Social Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialMediaItems.filter(item => !['twitter', 'youtube'].includes(item.type)).map((item, index) => (
            <div
              key={item.type}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-4 border-b">
                <h3 className="text-gray-800 font-semibold">{item.title}</h3>
              </div>
              <div className="h-[400px] w-full">
                <iframe
                  src={item.embedUrl}
                  className="w-full h-full border-0"
                  allowTransparency={true}
                  allowFullScreen
                  loading="lazy"
                  title={`${item.title} Embed`}
                />
              </div>
            </div>
          ))}
        </div>






        {/* Instagram Section */}
        <div className="mb-8">
          <div className="p-4 border-b">
            <h3 className="text-gray-800 font-semibold">Instagram Posts</h3>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px]">
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {[
                'https://www.instagram.com/p/CdEhFSNMbC7/',
                'https://www.instagram.com/p/CaUrK3vsUls/',
                'https://www.instagram.com/p/CdQjYOVsYX3/'
              ].map((postUrl, index) => (
                <div key={index} className="w-full rounded-md overflow-hidden shadow-sm">
                  <iframe
                    title={`InstagramPost${index}`}
                    src={`https://www.instagram.com/p/${postUrl.split('/').filter(Boolean).pop()}/embed/captioned`}
                    className="w-full h-[700px] border-0"
                    allowTransparency="true"
                    allowFullScreen
                    scrolling="no"
                    loading="lazy"
                    style={{
                      maxWidth: '540px',
                      width: 'calc(100% - 2px)',
                      minWidth: '326px',
                      borderRadius: '3px',
                      border: '1px solid #dbdbdb',
                      boxShadow: 'none',
                      marginBottom: '12px'
                    }}
                  />
                </div>
              ))}
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
