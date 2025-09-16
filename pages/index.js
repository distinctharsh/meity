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
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <main id="main" >
        <HeroSlider />
        <AnnouncementBar />
        <PmQuote />
        <AboutSection />
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
