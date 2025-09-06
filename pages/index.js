import Header from "../components/Header";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import AnnouncementBar from "../components/AnnouncementBar";

export default function Home() {
  return (
    <>
      <Header />
      <Navbar />
      <HeroSlider />
      <AnnouncementBar />
      <main id="main" className="p-6">
        
      </main>
    </>
  );
}
