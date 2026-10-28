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
        <AboutSection data={homeData?.homeData?.aboutSection || homeData?.aboutSection} />
        <Offerings offerings={homeData?.offerings || []} />
        <RecentDocs docs={homeData?.recentDocs || []} importantLinks={homeData?.importantLinks || []} />
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
    const homeRes = await fetch(`${baseUrl}/api/home`);
    const homeData = homeRes.ok ? await homeRes.json() : {};

    return {
      props: {
        homeData: {
          ...homeData,
          slides: homeData?.slides || [],
        }
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