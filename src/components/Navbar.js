"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./Button";
import "./Navbar.css";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../lib/firebase"; // Adjust the path if necessary

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [user, setUser] = useState(null);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  // Show/hide signup/login buttons on resize
  useEffect(() => {
    showButton();
    window.addEventListener("resize", showButton);
    return () => {
      window.removeEventListener("resize", showButton);
    };
  }, []);

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const scrollToMission = (e) => {
    e.preventDefault();
    const missionSection = document.getElementById("mission");
    if (missionSection) {
      missionSection.scrollIntoView({ behavior: "smooth" });
    } else {
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
            <>
              {user ? (
                <>
                  {/* PROFILE now links to /profile, where we pull currentUser.uid internally */}
                  <Button buttonStyle="btn--profile" href="/profile">
                    PROFILE
                  </Button>
                  <Button buttonStyle="btn--white" onClick={handleSignOut}>
                    SIGN OUT
                  </Button>
                </>
              ) : (
                <>
                  <Button buttonStyle="btn--outline" href="/sign-up">
                    SIGN UP
                  </Button>
                  <Button buttonStyle="btn--white" href="/login">
                    LOGIN
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
