import OurMissionPage from "./our-mission/page";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <OurMissionPage />
      <Footer />
    </main>
  );
}
