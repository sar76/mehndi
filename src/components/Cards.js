"use client";

import React from "react";
import "./Cards.css";
import CardItem from "./CardItem";

function Cards() {
  const placeholderImage =
    "https://via.placeholder.com/400x300?text=Mehndi+Mission";

  return (
    <div className="cards" id="cards-section">
      <h1>Our Mission</h1>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src={placeholderImage}
              text="Connect with talented Mehndi artists in your area"
              label="Community"
              path="/find-artists"
            />
            <CardItem
              src={placeholderImage}
              text="Explore unique and traditional Mehndi designs"
              label="Designs"
              path="/explore-designs"
            />
          </ul>
          <ul className="cards__items">
            <CardItem
              src={placeholderImage}
              text="Learn about different Mehndi styles and traditions"
              label="Education"
              path="/explore-designs"
            />
            <CardItem
              src={placeholderImage}
              text="Book appointments with verified artists"
              label="Booking"
              path="/find-artists"
            />
            <CardItem
              src={placeholderImage}
              text="Join our growing community of artists and enthusiasts"
              label="Join Us"
              path="/sign-up"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
