import "../styles/globals.css";
import Navbar from '../components/Navbar';
import Header from "@/components/Header";
import GoToTop from "@/components/GoToTop";
import dynamic from 'next/dynamic';
// const CookieBanner = dynamic(() => import('@/components/CookieBanner'), { ssr: false });
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import Head from 'next/head';
import { t } from "@/lib/translations";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => {
      if (url !== router.asPath) {
        setIsLoading(true);
      }
    };
    
    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Don't show Header and Navbar on admin pages
  const isAdminPage = router.pathname.startsWith('/admin');

  return (
    <>
      <Head>
        <title>{t("cabinet_secretariat")} | {t("government_of_india")}</title>
        <link rel="icon" type="image/svg+xml" href="/images/emblem.svg" />
      </Head>

      {/* Global Page Transition Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-950/80 z-50 backdrop-blur-sm transition-all">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Loading page...</p>
          </div>
        </div>
      )}

      {!isAdminPage && (router.pathname.startsWith('/documents') || router.pathname.startsWith('/archives')) ? (
        <>
          <Script
            id="jquery"
            src="/vendor/js/jquery-3.7.1.min.js"
            strategy="beforeInteractive"
            onLoad={() => {
              window.$ = window.jQuery;
            }}
          />

          <Script
            id="datatable"
            src="/vendor/js/jquery.dataTables.min.js"
            strategy="afterInteractive"
          />
        </>
      ) : null}
      
      <SafeEventListenerGuard />
      {!isAdminPage && (
        <div className="sticky top-0 z-[998] bg-white">
          <Header />
          <Navbar />
        </div>
      )}
      <main id="main-content" tabIndex={-1} className="outline-none focus:outline-none">
        <Component {...pageProps} />
      </main>
      {/* <CookieBanner /> */}
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
    const wrapped = function (type, listener, options) {
      try {
        if (typeof type !== 'string' || typeof listener !== 'function') {
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