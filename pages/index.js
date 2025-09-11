import HeroSlider from "../components/HeroSlider";
import AnnouncementBar from "../components/AnnouncementBar";
import PmQuote from "../components/PmQuote";
import AboutSection from "@/components/AboutSection";
import Offerings from "../components/Offerings";
import RecentDocs from "../components/RecentDocs";
import SocialMediaFeed from "../components/SocialMediaFeed";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <AnnouncementBar />
      <PmQuote />
      <AboutSection />
      <Offerings />
      <RecentDocs />
      <SocialMediaFeed />
      <main id="main" className="p-6">

      </main>
    </>
  );
}
