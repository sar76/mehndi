import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { Button } from "./Button";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const location = useLocation();
  const [loginActive, setLoginActive] = useState(false);
  const navigate = useNavigate();

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
    if (location.pathname === "/login") {
      setLoginActive(true);
    } else {
      setLoginActive(false);
    }
  }, [location]);

  useEffect(() => {
    showButton();
    window.addEventListener("resize", showButton);
    return () => {
      window.removeEventListener("resize", showButton);
    };
  }, []);

  // Scroll function with smart navigation
  const scrollToMission = (e) => {
    e.preventDefault();

    // If not on home page, navigate to home page first
    if (location.pathname !== "/") {
      navigate("/");

      // Need to wait for navigation to complete before scrolling
      setTimeout(() => {
        const cardsSection = document.getElementById("cards-section");
        if (cardsSection) {
          const yOffset = -100; // Adjust as needed
          const y =
            cardsSection.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;
          window.scrollTo({
            top: y,
            behavior: "smooth",
          });
        }
      }, 100); // Short delay to allow for page navigation
    } else {
      // Already on home page, just scroll
      const cardsSection = document.getElementById("cards-section");
      if (cardsSection) {
        const yOffset = -100; // Adjust as needed
        const y =
          cardsSection.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    }

    closeMobileMenu();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            Mehndi Pros
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={scrollToMission}>
                Our Mission
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/FindArtists"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Find Artists
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/ExploreDesigns"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Explore Designs
              </Link>
            </li>
            <li>
              <Link
                to="/sign-up"
                className="nav-links-mobile"
                onClick={closeMobileMenu}
              >
                SIGN UP
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="nav-links-mobile"
                onClick={closeMobileMenu}
              >
                LOGIN
              </Link>
            </li>
          </ul>
          <div className="button-container">
            {button && (
              <Button buttonStyle="btn--outline" to="/sign-up">
                SIGN UP
              </Button>
            )}
            {button && (
              <Button buttonStyle="btn--white" to="/login">
                LOGIN
              </Button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
