import "../styles/globals.css";
import Navbar from '../components/Navbar';
import Header from "@/components/Header";
import GoToTop from "@/components/GoToTop";
import dynamic from 'next/dynamic';
const CookieBanner = dynamic(() => import('@/components/CookieBanner'), { ssr: false });
import LangAlternates from '@/components/LangAlternates';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Don't show Header and Navbar on admin pages
  const isAdminPage = router.pathname.startsWith('/admin');

  return (
    <>
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
