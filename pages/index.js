import HeroSlider from "../components/HeroSlider";
import AnnouncementBar from "../components/AnnouncementBar";
import PmQuote from "../components/PmQuote";
import AboutSection from "@/components/AboutSection";
import Offerings from "../components/Offerings";
import RecentDocs from "../components/RecentDocs";
import SocialMediaFeed from "../components/SocialMediaFeed";
import PromoSection from "../components/PromoSection";
import PartnerLogoCarousel from "../components/PartnerLogoCarousel";
import Footer from "../components/Footer";
import dynamic from 'next/dynamic';
const CCPSBanner = dynamic(() => import('@/components/CCPSBanner'), { ssr: false });
import Header from "@/components/Header";

export default function Home({ homeData }) {
  return (
    <>
      <main id="main" >
        <HeroSlider slides={homeData?.slides || []} />
        <AnnouncementBar announcements={homeData?.announcements || []} />
        <PmQuote quotes={homeData?.pmQuotes || []} />
        <AboutSection data={homeData?.aboutSection} />
        <Offerings offerings={homeData?.offerings || []} />
        <RecentDocs docs={homeData?.recentDocs || []} />
        {/* <SocialMediaFeed /> */}
        <PromoSection />
        <PartnerLogoCarousel logos={homeData?.partnerLogos || []} />
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';
    const res = await fetch(`${baseUrl}/api/home`);
    if (!res.ok) {
      throw new Error('Failed to fetch home data');
    }
    const homeData = await res.json();
    
    return {
      props: {
        homeData
      }
    };
  } catch (error) {
    console.error('Error fetching home data in getServerSideProps:', error);
    return {
      props: {
        homeData: {
          slides: [],
          announcements: [],
          pmQuotes: [],
          aboutSection: null,
          offerings: [],
          recentDocs: [],
          partnerLogos: []
        }
      }
    };
  }
}