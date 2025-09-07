import Header from "../components/Header";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import AnnouncementBar from "../components/AnnouncementBar";
import PmQuote from "../components/PmQuote";
import AboutSection from "@/components/AboutSection";
import Offerings from "../components/Offerings";

export default function Home() {
  return (
    <>
     
      <HeroSlider />
      <AnnouncementBar />
      <PmQuote />
      <AboutSection />
  <Offerings />
      <main id="main" className="p-6">
        
      </main>
    </>
  );
}
