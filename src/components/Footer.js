"use client";

import React from "react";
import "./Footer.css";
import { Button } from "./Button";
import Link from "next/link";

function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Add your subscription logic here
  };

  return (
    <div className="footer-container">
      <section className="footer-subscription">
        <p className="footer-subscription-heading">
          Any other info regarding the site will go here
        </p>
        <p className="footer-subscription-text">Subscribe to ShaadiPros:</p>
        <div className="input-areas">
          <form onSubmit={handleSubscribe}>
            <input
              className="footer-input"
              name="email"
              type="email"
              placeholder="Your Email"
            />
            <Button buttonStyle="btn--outline" onClick={handleSubscribe}>
              Subscribe
            </Button>
          </form>
        </div>
      </section>
      <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>About Us</h2>
            <Link href="/sign-up">How it works</Link>
            <Link href="/">Testimonials</Link>
            <Link href="/">Careers</Link>
            <Link href="/">Investors</Link>
            <Link href="/">Terms of Service</Link>
          </div>
          <div className="footer-link-items">
            <h2>Contact Us</h2>
            <Link href="/">Contact</Link>
            <Link href="/">Support</Link>
            <Link href="/">Destinations</Link>
            <Link href="/">Sponsorships</Link>
          </div>
        </div>
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Videos</h2>
            <Link href="/">Submit Video</Link>
            <Link href="/">Ambassadors</Link>
            <Link href="/">Agency</Link>
            <Link href="/">Influencer</Link>
          </div>
          <div className="footer-link-items">
            <h2>Social Media</h2>
            <Link href="/">Instagram</Link>
            <Link href="/">Facebook</Link>
            <Link href="/">Youtube</Link>
            <Link href="/">Twitter</Link>
          </div>
        </div>
      </div>
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <Link href="/" className="social-logo">
              MehndiPros
            </Link>
          </div>
          <small className="website-rights">MehndiPros ©</small>
          <div className="social-icons">
            <Link
              className="social-icon-link facebook"
              href="/"
              target="_blank"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f" />
            </Link>
            <Link
              className="social-icon-link instagram"
              href="/"
              target="_blank"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram" />
            </Link>
            <Link
              className="social-icon-link youtube"
              href="/"
              target="_blank"
              aria-label="Youtube"
            >
              <i className="fab fa-youtube" />
            </Link>
            <Link
              className="social-icon-link twitter"
              href="/"
              target="_blank"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
