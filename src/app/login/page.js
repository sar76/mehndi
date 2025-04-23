"use client";

import React, { useState, useEffect } from "react";
import "./Login.css";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");

  // Redirect on auth state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push("/explore-designs");
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will redirect
    } catch (err) {
      console.error("Email sign in error:", err);
      setError(err.message || "Failed to sign in.");
    }
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
            {error && <p className="error-message">{error}</p>}

            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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
    </main>
  );
}
