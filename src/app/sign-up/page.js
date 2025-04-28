"use client";

import React, { useState } from "react";
import "./SignUp.css";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { auth, db } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((p) => ({ ...p, [name]: value }));
  };

  const isFormValid =
    formValues.fullName.trim() !== "" &&
    formValues.email.trim()    !== "" &&
    formValues.password.trim() !== "" &&
    formValues.role           !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isFormValid) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // 1) Create Auth user
      const cred = await createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      );
      const uid = cred.user.uid;

      // 2) Write to /users collection as before
      await setDoc(
        doc(db, "users", uid),
        {
          fullName: formValues.fullName,
          email:    formValues.email,
          role:     formValues.role,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      // 3) If this is an artist, bootstrap an empty artists/{uid} doc
      if (formValues.role === "artist") {
        // split fullName into fname/lname
        const parts = formValues.fullName.trim().split(" ");
        const fname = parts.shift();
        const lname = parts.join(" ");

        await setDoc(
          doc(db, "artists", uid),
          {
            fname,
            lname,
            email: formValues.email,
            phone: "",
            city: "",
            country: "",
            imageURL: "",
            languages: [],
            availability: "",
            bio: "",
            rating: 0,
            reviews: 0,
            styles: [],
            party_per_person: 0,
            AE_price_min: 0,
            BH_price_min: 0,
            BP_price_min: 0,
            FD_price_min: 0,
            SH_price_min: 0,
            ST_price_min: 0,
            portfolio: [],
            serviceOffered: [],
            yearsexperience: 0,
            isPublished: false,
          },
          { merge: true }
        );        
      }

      // 4) Finally redirect
      router.push("/explore-designs");
    } catch (err) {
      console.error("Sign‑up error:", err);
      setError(err.message || "Failed to create account.");
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

          <form className="signup-form" onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}

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
                  I am a…
                </option>
                <option value="artist">Henna Artist</option>
                <option value="client">Looking for an Artist</option>
              </select>
            </div>

            <button
              type="submit"
              className="signup-button"
              disabled={!isFormValid}
            >
              Create Account
            </button>
          </form>

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
