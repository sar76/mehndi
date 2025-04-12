"use client";

import React, { useState, useEffect } from "react";
import "./Login.css";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { auth } from "../../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation"; // Use the app router

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Redirect once the user logs in
        router.push("/explore-designs");
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener will handle redirection.
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    // Implement your email/password login logic here.
  };

  return (
    <main>
      <Navbar />
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

          <form className="login-form" onSubmit={handleEmailLogin}>
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

          <button onClick={handleGoogleSignIn} className="login-google-button">
            Sign in with Google
          </button>

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
    </main>
  );
}
