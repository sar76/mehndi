"use client";

import React, { useState, useEffect } from "react";
import "./SignUp.css";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { auth, db } from "../../lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation"; // Using the app router

export default function SignUp() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  // Debug: Log when the component mounts
  console.log("SignUp component loaded");

  // Listen for authentication changes and redirect if a user is signed in.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("User signed in (in useEffect):", currentUser.uid);
        router.push("/explore-designs");
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Handle input changes for the form.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle email sign up and create a Firestore document.
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    console.log("Create Account pressed. Form values:", formValues);

    try {
      // Create user with email and password.
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      );
      const createdUser = userCredential.user;
      console.log("User created with uid:", createdUser.uid);

      // Write user data to Firestore in the "users" collection.
      await setDoc(doc(db, "users", createdUser.uid), {
        fullName: formValues.fullName,
        email: formValues.email,
        role: formValues.role,
        createdAt: serverTimestamp(),
      });
      console.log("User document created in Firestore.");
      // The onAuthStateChanged listener will handle the redirection.
    } catch (error) {
      console.error("Error signing up with email:", error);
    }
  };

  // Handle Google sign up.
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      console.log(
        "Google sign in successful. User uid:",
        userCredential.user.uid
      );
      // Optionally: Check if a Firestore document exists and create one if needed.
    } catch (error) {
      console.error("Google sign up error:", error);
    }
  };

  return (
    <main>
      <Navbar />
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

          <form className="signup-form" onSubmit={handleEmailSignUp}>
            <div className="form-group">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                value={formValues.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formValues.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formValues.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <select
                name="role"
                value={formValues.role}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  I am a...
                </option>
                <option value="artist">Henna Artist</option>
                <option value="client">Looking for an Artist</option>
              </select>
            </div>
            <button
              type="submit"
              className="signup-button"
              onClick={() => console.log("Submit button clicked")}
            >
              Create Account
            </button>
          </form>

          <button onClick={handleGoogleSignUp} className="signup-google-button">
            Sign Up with Google
          </button>

          <div className="signup-footer">
            <p>
              Already have an account? <Link href="/login">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
