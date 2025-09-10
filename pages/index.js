import HeroSlider from "../components/HeroSlider";
import AnnouncementBar from "../components/AnnouncementBar";
import PmQuote from "../components/PmQuote";
import AboutSection from "@/components/AboutSection";
import Offerings from "../components/Offerings";
import RecentDocs from "../components/RecentDocs";

export default function Home() {
  return (
    <>
     
      <HeroSlider />
      <AnnouncementBar />
      <PmQuote />
      <AboutSection />
  <Offerings />
  <RecentDocs />
      <main id="main" className="p-6">
        
      </main>
    </>
  );
}
