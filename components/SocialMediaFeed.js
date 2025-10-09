import React, { useState, useEffect } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";
import SocialMedia from "./icons/SocialMedia";

// Helper function to get embed URLs for different platforms
const getEmbedUrl = (url = '') => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Twitter/X
    if (hostname.includes('platform.twitter.com')) {
      // Already an embed URL. Validate it has an id param, otherwise it's unusable.
      const idParam = urlObj.searchParams.get('id');
      return idParam ? url : '';
    }
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      // Support /status/<id>, /statuses/<id>, and /i/web/status/<id>
      const m = url.match(/(?:status(?:es)?|i\/web\/status)\/(\d+)/);
      const tweetId = m ? m[1] : '';
      return tweetId
        ? `https://platform.twitter.com/embed/Tweet.html?dnt=true&embedId=twitter-widget&hideCard=false&hideThread=true&id=${tweetId}&lang=en&theme=light&widgetsVersion=2615f7e52b7e0%3A1702314776716&width=550`
        : '';
    }

    // Facebook post/plugin
    if (hostname.includes('facebook.com')) {
      // Pass-through if it's already the plugins URL
      if (urlObj.pathname.includes('/plugins/post.php')) return url;
      return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500`;
    }

    // Instagram post/reel/tv
    if (hostname.includes('instagram.com')) {
      // Pass-through if already /embed/
      if (urlObj.pathname.includes('/embed')) return url;
      const parts = urlObj.pathname.split('/').filter(Boolean);
      const type = parts[0];
      const code = parts[1] || '';
      if ((type === 'p' || type === 'reel' || type === 'reels' || type === 'tv') && code) {
        const t = type === 'reels' ? 'reel' : type; // normalize reels -> reel
        return `https://www.instagram.com/${t}/${code}/embed`;
      }
      return '';
    }

    // YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      // Pass-through if already /embed or /embed/
      if (urlObj.pathname.startsWith('/embed')) return url;
      const videoId = urlObj.hostname.includes('youtube.com')
        ? new URLSearchParams(urlObj.search).get('v')
        : urlObj.pathname.split('/').pop().split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : '';
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
  facebookPosts = [
    'https://www.facebook.com/meityindia/posts/944312881217817?ref=embed_post',
    'https://www.facebook.com/meityindia/posts/pfbid02Phw2HNHCngvQczo35v4HnSdPBAyLU1bTFH8JHHy1hwQi7ckoZdRAEbJcPuGL3Q8il',
    'https://www.facebook.com/meityindia/posts/pfbid024ambHS6Fa5u3UKxt5WXTDwg6ATRoQf3pbUDEF37EyC928mmAFixm14mxezuerMUrl',
    'https://www.facebook.com/meityindia/posts/pfbid0joj5xRsfsRdzVfbmCnYxL672yNBxn6k4ZB7NZvd8ViuApCMri43nDerpXZjdvTa1l'
  ],
  // Single Twitter URL
  twitterUrl = "https://x.com/GoI_MeitY/status/1959913113169305755",
  facebookUrl = "https://www.facebook.com/harshsinghjii",
  instagramUrl = "https://www.instagram.com/distinctharsh",
  enableEmbeds = true
}) => {
  const [currentPreview, setCurrentPreview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [apiData, setApiData] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        const res = await fetch('/api/social-posts');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!abort) setApiData(data);
        console.debug('Social API data loaded', data);
      } catch (e) {
        if (!abort) setApiError(e.message || 'Failed to load');
        console.warn('Social API load error:', e);
      }
    })();
    return () => { abort = true; };
  }, []);

  // Prefer DB data, fallback to props
  const youtubeList = (apiData?.youtube || [])
    .map(p => p.post_url)
    .filter(Boolean);
  const facebookList = (apiData?.facebook || [])
    .map(p => p.post_url)
    .filter(Boolean);
  const twitterFromApi = (apiData?.twitter || [])
    .map(p => p.post_url)
    .filter(Boolean);
  const instagramFromApi = (apiData?.instagram || [])
    .map(p => p.post_url)
    .filter(Boolean);

  const ytList = youtubeList.length ? youtubeList : youtubeVideos;
  const fbList = facebookList.length ? facebookList : facebookPosts;
  const twUrl = twitterFromApi[0] || twitterUrl;
  const igUrl = instagramFromApi[0] || instagramUrl;

  // Precompute embed URLs and validity
  const twList = twitterFromApi.length ? twitterFromApi : (twitterUrl ? [twitterUrl] : []);
  const twEmbeds = twList.map(u => ({ url: u, embed: getEmbedUrl(u) })).filter(x => !!x.embed);
  const fbEmbeds = fbList.map(u => ({ url: u, embed: getEmbedUrl(u) })).filter(x => !!x.embed);
  const igList = instagramFromApi.length ? instagramFromApi : (instagramUrl ? [instagramUrl] : []);
  const igEmbeds = igList.map(u => ({ url: u, embed: getEmbedUrl(u) })).filter(x => !!x.embed);

  const socialMediaItems = [
    // Twitter section
    {
      type: 'twitter',
      url: twUrl,
      title: 'X (Twitter)',
      embedUrl: getEmbedUrl(twUrl),
      isSingle: true
    },
    // Multiple YouTube videos
    ...ytList.map((videoUrl, index) => ({
      type: 'youtube',
      url: videoUrl,
      title: `Video ${index + 1}`,
      embedUrl: getEmbedUrl(videoUrl),
      isSingle: false
    })),
    // Other social media
    {
      type: 'facebook',
      url: fbList[0] || facebookUrl,
      title: 'Facebook',
      embedUrl: getEmbedUrl(fbList[0] || facebookUrl),
      isSingle: true
    },
    {
      type: 'instagram',
      url: igUrl,
      title: 'Instagram',
      embedUrl: getEmbedUrl(igUrl),
      isSingle: true
    },
  ].filter(item => item.url);

  // Build slides for mobile carousel: exactly 4 cards mirroring desktop sections
  const mobileSlides = [
    { key: 'yt', type: 'youtube', title: 'Youtube' },
    { key: 'ig', type: 'instagram', title: 'Instagram' },
    { key: 'tw', type: 'twitter', title: 'X' },
    { key: 'fb', type: 'facebook', title: 'Facebook' },
  ];

  const nextMobile = () => setMobileIndex(prev => (prev + 1) % Math.max(1, mobileSlides.length));
  const prevMobile = () => setMobileIndex(prev => (prev - 1 + Math.max(1, mobileSlides.length)) % Math.max(1, mobileSlides.length));

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
    <div className="w-full min-h-[525px] bg-[#25355a] py-4 flex flex-col">
      {/* Header */}
      <div className="gi-container flex items-center mb-4 justify-center sm:justify-start">
        <SocialMedia className="w-8 h-8 text-white mr-2" />
        <h2 className="text-white text-xl font-bold leading-none m-0">
          In Social Media
        </h2>
      </div>

      {/* API status */}
      {apiError && (
        <div className="gi-container text-sm text-red-200 mb-2">Social feed failed to load from admin. Showing defaults. ({apiError})</div>
      )}

      {/* Mobile Slider */}
      <div className="gi-container md:hidden">
        <div className="relative bg-white rounded-lg shadow overflow-hidden">
          {/* Header of current card */}
          <div className="p-3 border-b">
            <h3 className="text-gray-800 font-semibold text-center">{mobileSlides[mobileIndex]?.title || 'Social'}</h3>
          </div>
          {/* Slide body renders the same multi-item content as desktop */}
          <div className="p-2">
            {(() => {
              const slide = mobileSlides[mobileIndex];
              if (!slide) return <div className="text-center text-gray-500 p-6">No social items configured.</div>;
              if (slide.type === 'youtube') {
                return (
                  <div className="h-[360px] overflow-y-auto">
                    {ytList.slice(0, 3).map((videoUrl, index) => (
                      <div key={index} className="pb-4 mb-2 border-b last:pb-0 last:mb-0 last:border-none">
                        <div className="aspect-video w-full rounded overflow-hidden">
                          <iframe
                            title={`YouTube Video ${index + 1}`}
                            src={getEmbedUrl(videoUrl)}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              if (slide.type === 'instagram') {
                return (
                  <div className="h-[360px] overflow-y-auto space-y-4">
                    {igEmbeds.length > 0 ? igEmbeds.map(({ url: iUrl, embed }, index) => (
                      enableEmbeds ? (
                        <div key={index} className="w-full">
                          <iframe
                            src={embed}
                            className="w-full h-[320px] border-0"
                            allowFullScreen
                            scrolling="yes"
                            loading="lazy"
                            title={`Instagram Post ${index + 1}`}
                            sandbox="allow-scripts allow-same-origin allow-popups"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      ) : (
                        <a key={index} href={iUrl} target="_blank" rel="noopener noreferrer" className="block w-full rounded overflow-hidden border" aria-label={`Open Instagram post ${index + 1}`}>
                          <img src="/images/promo/digital-personal-data.jpg" alt={`Instagram preview ${index + 1}`} className="w-full h-[320px] object-cover" />
                        </a>
                      )
                    )) : (
                      igList.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {igList.map((iUrl, idx) => (
                            <a key={idx} href={iUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 underline" aria-label={`Open Instagram post ${idx + 1}`}>Open on Instagram #{idx + 1}</a>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 p-6">No valid Instagram post URLs configured.</div>
                      )
                    )}
                  </div>
                );
              }
              if (slide.type === 'twitter') {
                return (
                  <div className="h-[360px] overflow-y-auto">
                    {twList.length > 0 ? (
                      twList.map((tUrl, index) => {
                        const embed = getEmbedUrl(tUrl);
                        return enableEmbeds && embed ? (
                          <div key={index} className="pb-4 mb-2 border-b last:pb-0 last:mb-0 last:border-none">
                            <iframe src={embed} className="w-full h-[320px] border-0" allowFullScreen loading="lazy" title={`Twitter Post ${index + 1}`} />
                          </div>
                        ) : (
                          <div key={index} className="pb-2">
                            <a href={tUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" aria-label={`Open Twitter post ${index + 1}`}>Open on X (Twitter) #{index + 1}</a>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-500 p-6">No valid Twitter post URLs configured.</div>
                    )}
                  </div>
                );
              }
              if (slide.type === 'facebook') {
                return (
                  <div className="h-[360px] overflow-y-auto space-y-4">
                    {fbEmbeds.length > 0 ? fbEmbeds.map(({url: postUrl, embed}, index) => (
                      enableEmbeds ? (
                        <div key={index} className="mb-4 last:mb-0">
                          <iframe title={`FacebookPost${index}`} src={embed} className="w-full h-[320px] border-0" scrolling="no" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups" referrerPolicy="no-referrer-when-downgrade" />
                        </div>
                      ) : (
                        <a key={index} href={postUrl} target="_blank" rel="noopener noreferrer" className="block rounded overflow-hidden border" aria-label={`Open Facebook post ${index + 1}`}> 
                          <img src="/images/promo/digital-personal-data.jpg" alt={`Facebook preview ${index + 1}`} className="w-full h-[320px] object-cover" />
                        </a>
                      )
                    )) : (
                      <div className="text-center text-gray-500 p-6">No valid Facebook post URLs configured.</div>
                    )}
                  </div>
                );
              }
              return <div className="text-center text-gray-500 p-6">No social items configured.</div>;
            })()}
          </div>

          {/* Controls */}
          {mobileSlides.length > 1 && (
            <>
              <button onClick={prevMobile} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center">
                <FaChevronLeft />
              </button>
              <button onClick={nextMobile} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center">
                <FaChevronRight />
              </button>
              <div className="flex items-center justify-center gap-2 pb-3">
                {mobileSlides.map((_, i) => (
                  <button key={i} className={`w-2 h-2 rounded-full ${i === mobileIndex ? 'bg-[#25355a]' : 'bg-gray-300'}`} onClick={() => setMobileIndex(i)} aria-label={`Go to slide ${i+1}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Social Media Grid for md+ */}
      <div className="gi-container hidden md:block">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Twitter Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="p-3 border-b">
              <h3 className="text-gray-800 font-semibold text-center">X</h3>
              {twList.length === 0 && (<p className="text-center text-xs text-gray-500 m-0">No Twitter URLs configured</p>)}
            </div>
            <div className="h-[400px] overflow-y-auto p-2">
              {twList.length > 0 ? (
                twList.map((tUrl, index) => {
                  const embed = getEmbedUrl(tUrl);
                  return enableEmbeds && embed ? (
                    <div key={index} className="pb-4 mb-2 border-b last:pb-0 last:mb-0 last:border-none">
                      <iframe
                        src={embed}
                        className="w-full h-[350px] border-0"
                        allowFullScreen
                        loading="lazy"
                        title={`Twitter Post ${index + 1}`}
                      />
                    </div>
                  ) : (
                    <div key={index} className="pb-2">
                      <a
                        href={tUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                        aria-label={`Open Twitter post ${index + 1}`}
                      >
                        Open on X (Twitter) #{index + 1}
                      </a>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 p-6">No valid Twitter post URLs configured.</div>
              )}
            </div>
          </div>

          {/* YouTube Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-3 border-b">
              <h3 className="text-gray-800 font-semibold text-center">Youtube</h3>
              {ytList.length === 0 && (<p className="text-center text-xs text-gray-500 m-0">No videos configured</p>)}
            </div>
            <div className="p-2 h-[400px] overflow-y-auto">
              {ytList.slice(0, 3).map((videoUrl, index) => (
                <div key={index} className="pb-4 mb-2 border-b last:pb-0 last:mb-0 last:border-none">
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

          {/* Facebook Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="p-3 border-b">
              <h3 className="text-gray-800 font-semibold text-center">Facebook</h3>
              {fbList.length === 0 && (<p className="text-center text-xs text-gray-500 m-0">No posts configured</p>)}
            </div>
            <div className="h-[400px] overflow-y-auto p-2 space-y-4">
              {fbEmbeds.length > 0 ? fbEmbeds.map(({url: postUrl, embed}, index) => (
                enableEmbeds ? (
                  <div key={index} className="mb-4 last:mb-0">
                    <iframe
                      title={`FacebookPost${index}`}
                      src={embed}
                      className="w-full h-[350px] border-0"
                      scrolling="no"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : (
                  <a
                    key={index}
                    href={postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded overflow-hidden border"
                    aria-label={`Open Facebook post ${index + 1}`}
                  >
                    <img
                      src="/images/promo/digital-personal-data.jpg"
                      alt={`Facebook preview ${index + 1}`}
                      className="w-full h-[350px] object-cover"
                    />
                  </a>
                )
              )) : (
                <div className="text-center text-gray-500 p-6">No valid Facebook post URLs configured.</div>
              )}
            </div>
          </div>

          {/* Instagram Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="p-3 border-b">
              <h3 className="text-gray-800 font-semibold text-center">Instagram</h3>
              {igList.length === 0 && (<p className="text-center text-xs text-gray-500 m-0">No Instagram URLs configured</p>)}
            </div>
            <div className="h-[400px] overflow-y-auto p-2 space-y-4">
              {igEmbeds.length > 0 ? igEmbeds.map(({ url: iUrl, embed }, index) => (
                enableEmbeds ? (
                  <div key={index} className="w-full">
                    <iframe
                      src={embed}
                      className="w-full h-[350px] border-0"
                      allowFullScreen
                      scrolling="yes"
                      loading="lazy"
                      title={`Instagram Post ${index + 1}`}
                      sandbox="allow-scripts allow-same-origin allow-popups"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : (
                  <a
                    key={index}
                    href={iUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded overflow-hidden border"
                    aria-label={`Open Instagram post ${index + 1}`}
                  >
                    <img
                      src="/images/promo/digital-personal-data.jpg"
                      alt={`Instagram preview ${index + 1}`}
                      className="w-full h-[350px] object-cover"
                    />
                  </a>
                )
              )) : (
                igList.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {igList.map((iUrl, idx) => (
                      <a
                        key={idx}
                        href={iUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 underline"
                        aria-label={`Open Instagram post ${idx + 1}`}
                      >
                        Open on Instagram #{idx + 1}
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 p-6">No valid Instagram post URLs configured.</div>
                )
              )}
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
