import Header from "../components/Header";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import AnnouncementBar from "../components/AnnouncementBar";
import PmQuote from "../components/PmQuote";

export default function Home() {
  return (
    <>
      <Header />
      <Navbar />
      <HeroSlider />
      <AnnouncementBar />
      <PmQuote />
      <main id="main" className="p-6">
        
      </main>
    </>
  );
}
