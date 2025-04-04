"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./Button";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [loginActive, setLoginActive] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();

    // Add event listener inside useEffect
    window.addEventListener("resize", showButton);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("resize", showButton);
    };
  }, []);

  const scrollToMission = (e) => {
    e.preventDefault();
    const missionSection = document.getElementById("mission");
    if (missionSection) {
      missionSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // If we're not on the home page, navigate to home page with mission section
      window.location.href = "/#mission";
    }
    closeMobileMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo" onClick={closeMobileMenu}>
          <i className="fas fa-paint-brush"></i> Mehndi Artists
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"} />
        </div>
        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link href="/" className="nav-links" onClick={scrollToMission}>
              Our Mission
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/explore-designs"
              className="nav-links"
              onClick={closeMobileMenu}
            >
              Explore Designs
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/find-artists"
              className="nav-links"
              onClick={closeMobileMenu}
            >
              Find Artists
            </Link>
          </li>
        </ul>
        <div className="button-container">
          {button && (
            <Button buttonStyle="btn--outline" href="/sign-up">
              SIGN UP
            </Button>
          )}
          {button && (
            <Button buttonStyle="btn--white" href="/login">
              LOGIN
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
