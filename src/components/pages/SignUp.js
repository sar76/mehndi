import React from "react";
import "../../App.css";
import "./SignUp.css";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="signup-container">
      <video
        src="/background_video.mp4"
        autoPlay
        loop
        muted
        className="signup-background-video"
      />
      <div className="signup-content">
        <h1>Join Mehndi Pros</h1>
        <p className="signup-subtitle">
          Connect with Talented Henna Artists in your area
        </p>

        <form className="signup-form">
          <div className="form-group">
            <input type="text" placeholder="Full Name" required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email Address" required />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" required />
          </div>
          <div className="form-group">
            <select defaultValue="">
              <option value="" disabled>
                I am a...
              </option>
              <option value="artist">Henna Artist</option>
              <option value="client">Looking for an Artist</option>
            </select>
          </div>
          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
