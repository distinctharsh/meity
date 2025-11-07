import "../styles/globals.css";
import Navbar from '../components/Navbar';
import Header from "@/components/Header";
import GoToTop from "@/components/GoToTop";
import dynamic from 'next/dynamic';
const CookieBanner = dynamic(() => import('@/components/CookieBanner'), { ssr: false });
import LangAlternates from '@/components/LangAlternates';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Don't show Header and Navbar on admin pages
  const isAdminPage = router.pathname.startsWith('/admin');

  // Load translation utility only on client-side and when not in admin
  useEffect(() => {
    if (typeof window !== 'undefined' && !router.pathname.startsWith('/admin')) {
      const loadTranslationScript = () => {
        const script = document.createElement('script');
        script.src = '/bhashini/website_translation_utility.js?v=2';
        script.setAttribute('language_order', 'en,hi');
        script.setAttribute('language-icon-color', '#162F6A');
        script.setAttribute('asset-path-prefix', '/bhashini');
        script.defer = true;
        
        // Only append if the script doesn't already exist
        if (!document.querySelector('script[src*="website_translation_utility"]')) {
          document.body.appendChild(script);
        }
      };

      // Load script when DOM is ready
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        loadTranslationScript();
      } else {
        window.addEventListener('DOMContentLoaded', loadTranslationScript);
      }
    }
  }, [router.pathname]);

  return (
    <>
      {/* Script tag removed from here */}
      <LangAlternates />
      {/* Global guard to prevent malformed addEventListener calls from third-party/CMS scripts */}
      <SafeEventListenerGuard />
      {!isAdminPage && <Header />}
      {!isAdminPage && <Navbar />}
      <main id="main-content" tabIndex={-1} className="outline-none focus:outline-none">
        <Component {...pageProps} />
      </main>
      <CookieBanner />
      <GoToTop />
    </>
  );
}

function SafeEventListenerGuard() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const proto = EventTarget && EventTarget.prototype;
    if (!proto || !proto.addEventListener) return;
    const originalAdd = proto.addEventListener;
    const wrapped = function(type, listener, options) {
      try {
        // Validate params: type must be string and listener must be function
        if (typeof type !== 'string' || typeof listener !== 'function') {
          // Silently ignore or warn instead of throwing
          console.warn('Blocked invalid addEventListener call', { type, listener });
          return;
        }
        return originalAdd.call(this, type, listener, options);
      } catch (e) {
        console.error('Safe addEventListener caught error:', e);
      }
    };
    proto.addEventListener = wrapped;
    return () => { proto.addEventListener = originalAdd; };
  }, []);
  return null;
}
