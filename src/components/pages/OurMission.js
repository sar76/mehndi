import React from "react";
import "../../App.css";
import Cards from "../Cards";
import HeroSection from "../HeroSection";
import Footer from "../Footer";

function OurMission() {
  return (
    <>
      <HeroSection />
      <div id="cards-section">
        <Cards />
      </div>
      <Footer />
    </>
  );
}

export default OurMission;
