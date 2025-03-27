"use client";

import React from "react";
import "../../App.css";
import "./Login.css";
import Link from "next/link";

export default function Login() {
  return (
    <div className="login-container">
      <video
        src="/background_video.mp4"
        autoPlay
        loop
        muted
        className="login-background-video"
      />
      <div className="login-content">
        <h1>Welcome Back</h1>
        <p className="login-subtitle">
          Log in to continue your Search for Talented Artists with Mehndi Pros
        </p>

        <form className="login-form">
          <div className="form-group">
            <input type="email" placeholder="Email Address" required />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" required />
          </div>
          <div className="form-checkbox">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <Link href="/sign-up">Sign Up</Link>
          </p>
          <Link href="#" className="forgot-password">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
