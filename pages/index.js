import HeroSlider from "../components/HeroSlider";
import AnnouncementBar from "../components/AnnouncementBar";
import PmQuote from "../components/PmQuote";
import AboutSection from "@/components/AboutSection";
import Offerings from "../components/Offerings";
import RecentDocs from "../components/RecentDocs";
import SocialMediaFeed from "../components/SocialMediaFeed";
import PromoSection from "@/components/PromoSection";
import PartnerLogoCarousel from "@/components/PartnerLogoCarousel";
import Footer from "@/components/Footer";
import dynamic from 'next/dynamic';
const CCPSBanner = dynamic(() => import('@/components/CCPSBanner'), { ssr: false });
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <main id="main" >
        <HeroSlider />
        <AnnouncementBar />
        <PmQuote />
        <AboutSection />
        <section className="px-[7%] mt-6">
          <h2 className="gi-h2 gi-w-bold text-deep-blue mb-3">Key Announcements</h2>
          <CCPSBanner variant="full" index={0} src="/images/sample-banner.webp" alt="Key government announcement banner" />
        </section>
        <Offerings />
        <RecentDocs />
        <SocialMediaFeed />
        <PromoSection />
        <PartnerLogoCarousel />

      </main>
      <Footer />
    </>
  );
}
