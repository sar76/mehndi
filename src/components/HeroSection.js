"use client";

import React from "react";
import { Button } from "./Button";
import "./HeroSection.css";

function HeroSection() {
  const scrollToCards = () => {
    const cardsSection = document.getElementById("cards-section");
    if (cardsSection) {
      const yOffset = -100; // Adjust this value as needed (same as in Navbar)
      const y =
        cardsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="hero-container">
      <video src="/background_video.mp4" autoPlay loop muted />
      <h1>Mehndi Artists</h1>
      <p>The Hub for Finding Your Local Mehndi or Henna Artists</p>
      <div className="hero-btns">
        <Button
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
          onClick={scrollToCards}
        >
          OUR MISSION
        </Button>
        <Button
          className="btns"
          buttonStyle="btn--primary"
          buttonSize="btn--large"
          href="/explore-designs"
        >
          EXPLORE DESIGNS <i className="far fa-play-circle" />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
