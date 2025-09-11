import React, { useState, useEffect } from "react";
import { FaGlobe } from "react-icons/fa";

// Helper function to get embed URLs for different platforms
const getEmbedUrl = (url = '') => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      return `https://twitframe.com/show?url=${encodeURIComponent(url)}`;
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
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return '';
  } catch (e) {
    return '';
  }
};

const SocialMediaPreview = ({
  twitterUrl = "https://x.com/GoI_MeitY/status/1959913113169305755",
  youtubeUrl = "https://www.youtube.com/watch?v=Bkno8p81fWc",
  facebookUrl = "https://www.facebook.com/IndiaMeitY",
  instagramUrl = "https://www.instagram.com/meity_india/"
}) => {
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
  
  const youtubeId = getYoutubeId(youtubeUrl);

  return (
    <div className="w-full min-h-[525px] bg-[#25355a] py-7 px-0 flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-8 pl-[125px]">
        <FaGlobe className="w-10 h-10 text-white mr-4" />
        <h2 className="text-white text-[2rem] font-bold leading-none m-0">
          In Social Media
        </h2>
      </div>

      {/* Cards Row */}
      <div className="flex flex-row w-full justify-center gap-[32px] flex-wrap">
        {/* Twitter */}
        <div className="flex flex-col w-[320px] rounded-[10px] bg-white shadow-lg pb-3">
          <div className="text-[#25355a] text-[1.25rem] font-semibold px-6 pt-4 pb-2">X (Twitter)</div>
          <div className="flex-1 px-4 pt-1 pb-2 overflow-y-auto h-[340px]">
            {twitterUrl ? (
              <iframe 
                src={getEmbedUrl(twitterUrl)}
                className="w-full h-full min-h-[300px] border-0 overflow-hidden"
                allowTransparency={true}
                allowFullScreen
                loading="lazy"
                title="Twitter Post"
              />
            ) : (
              <p className="text-center text-gray-400 mt-20">No Twitter URL provided.</p>
            )}
          </div>
        </div>

        {/* YouTube */}
        <div className="flex flex-col w-[320px] rounded-[10px] bg-white shadow-lg pb-3">
          <div className="text-[#25355a] text-[1.25rem] font-semibold px-6 pt-4 pb-2">YouTube</div>
          <div className="flex-1 px-4 pt-1 pb-2 overflow-y-auto h-[340px]">
            {youtubeId ? (
              <iframe
                className="w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="YouTube video player"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <p className="text-center text-gray-400 mt-20">No YouTube URL provided.</p>
            )}
          </div>
        </div>

        {/* Facebook */}
        <div className="flex flex-col w-[320px] rounded-[10px] bg-white shadow-lg pb-3">
          <div className="text-[#25355a] text-[1.25rem] font-semibold px-6 pt-4 pb-2">Facebook</div>
          <div className="flex-1 px-4 pt-1 pb-2 overflow-y-auto h-[340px]">
            {facebookUrl ? (
              <iframe
                src={getEmbedUrl(facebookUrl)}
                className="w-full h-full min-h-[300px] border-0 overflow-hidden"
                allowTransparency={true}
                allowFullScreen
                loading="lazy"
                title="Facebook Post"
              />
            ) : (
              <p className="text-center text-gray-400 mt-20">No Facebook URL provided.</p>
            )}
          </div>
        </div>

        {/* Instagram */}
        <div className="flex flex-col w-[320px] rounded-[10px] bg-white shadow-lg pb-3">
          <div className="text-[#25355a] text-[1.25rem] font-semibold px-6 pt-4 pb-2">Instagram</div>
          <div className="flex-1 px-4 pt-1 pb-2 overflow-y-auto h-[340px]">
            {instagramUrl ? (
              <iframe
                src={getEmbedUrl(instagramUrl)}
                className="w-full h-full min-h-[300px] border-0 overflow-hidden"
                allowTransparency={true}
                allowFullScreen
                loading="lazy"
                title="Instagram Post"
              />
            ) : (
              <p className="text-center text-gray-400 mt-20">No Instagram URL provided.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPreview;
