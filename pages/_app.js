
import "../styles/globals.css";
import Navbar from '../components/Navbar';
import Header from "@/components/Header";
import GoToTop from "@/components/GoToTop";
import dynamic from 'next/dynamic';
const CookieBanner = dynamic(() => import('@/components/CookieBanner'), { ssr: false });
import LangAlternates from '@/components/LangAlternates';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Don't show Header and Navbar on admin pages
  const isAdminPage = router.pathname.startsWith('/admin');

  return (
    <>
      <LangAlternates />
      {!isAdminPage && <Header />}
      {!isAdminPage && <Navbar />}
      <Component {...pageProps} />
      <CookieBanner />
      <GoToTop />
    </>
  );
}
