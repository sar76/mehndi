"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import "./BookAppointment.css";
import { auth, db } from "../../lib/firebase";
import { addDoc, collection, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";

const BookAppointmentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const artistId = searchParams.get('artistId');
  
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Check authentication status and load data on component mount
  useEffect(() => {
    if (!artistId) {
      setSubmitError("No artist selected. Please select an artist first.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user data
        try {
          const userSnap = await getDoc(doc(db, "users", currentUser.uid));
          if (userSnap.exists()) {
            const ud = userSnap.data();
            setUserData(ud);
          }
          
          // Get artist data using the artistId from URL params
          const artistSnap = await getDoc(doc(db, "artists", artistId));
          if (artistSnap.exists()) {
            setArtistData(artistSnap.data());
          } else {
            setSubmitError("Artist not found. Please try again.");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setSubmitError("Error loading data. Please try again.");
        }
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [artistId]);

  // Improved onSubmit function with proper error handling
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Check if user is logged in
      if (!auth.currentUser) {
        throw new Error("You must be logged in to book an appointment");
      }
      
      // Create appointment data
      const appointmentData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        notes: data.notes || "",
        clientUid: auth.currentUser.uid,
        artistUid: artistId, // Use the artistId from URL params
        artistName: `${artistData?.fname || ""} ${artistData?.lname || ""}`.trim(), // Store artist name
        status: "pending",
        createdAt: serverTimestamp(),
        appointmentDate: data.appointmentDate
      };
      
      console.log("Creating appointment with data:", appointmentData);
      
      // Add to appointments collection
      const appointmentRef = await addDoc(collection(db, "appointments"), appointmentData);
      console.log("Appointment created with ID:", appointmentRef.id);
      
      // Create notification for artist
      const notificationData = {
        userId: artistId,        
        userRole: "artist",      
        type: "request",        
        title: "New Appointment Request",
        content: `New request from ${data.name} for ${new Date(data.appointmentDate).toDateString()}`,
        referenceId: appointmentRef.id,
        timestamp: serverTimestamp(),
        read: false
      };
      
      console.log("Creating notification with data:", notificationData);
      
      const notificationRef = await addDoc(collection(db, "notifications"), notificationData);
      console.log("Notification created with ID:", notificationRef.id);
      
      alert("Your request has been sent successfully! Please await the artist's quote.");
      
      // Redirect to client dashboard or home page
      router.push("/client-dashboard");
    } catch (error) {
      console.error("Error submitting appointment:", error);
      setSubmitError(error.message || "There was an error submitting your request. Please try again.");
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="book-appointment-wrapper">
          <div className="book-appointment-container">
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  // Show error if no artist was selected
  if (!artistId || !artistData) {
    return (
      <>
        <Navbar />
        <div className="book-appointment-wrapper">
          <div className="book-appointment-container">
            <div className="error">{submitError || "No artist selected. Please select an artist first."}</div>
            <button 
              onClick={() => router.push('/artists')}
              className="submit-button"
            >
              Browse Artists
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Book Appointment | Mehndi Artists</title>
        <meta
          name="description"
          content="Book your appointment with a top mehndi artist easily and seamlessly."
        />
      </Head>
      <Navbar />
      <div className="book-appointment-wrapper">
        <video className="background-video" autoPlay loop muted>
          <source src="/videos/appointment-bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="book-appointment-container">
          {!user && (
            <div className="auth-message">
              <p>Please <a href="/login" className="auth-link">login</a> to book an appointment.</p>
            </div>
          )}
          
          {user && (
            <motion.form
              className="appointment-form"
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <section className="form-section">
                <h2>Contact Information</h2>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Enter your full name"
                    defaultValue={userData?.fullName || ""}
                  />
                  {errors.name && (
                    <span className="error">{errors.name.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                        message: "Enter a valid email",
                      },
                    })}
                    placeholder="Enter your email address"
                    defaultValue={userData?.email || ""}
                  />
                  {errors.email && (
                    <span className="error">{errors.email.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                    placeholder="Enter your phone number"
                    defaultValue={userData?.phone || ""}
                  />
                  {errors.phone && (
                    <span className="error">{errors.phone.message}</span>
                  )}
                </div>
              </section>

              <section className="form-section">
                <h2>Appointment Details</h2>
                <div className="form-group" style={{ position: "relative" }}>
                  <label htmlFor="appointmentDate">
                    Preferred Date &amp; Time
                  </label>
                  <Controller
                    control={control}
                    name="appointmentDate"
                    defaultValue={appointmentDate}
                    rules={{ required: "Please select a date and time" }}
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="Select date and time"
                        selected={field.value}
                        onChange={(date) => {
                          field.onChange(date);
                          setAppointmentDate(date);
                        }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="date-picker-input"
                        minDate={new Date()}
                      />
                    )}
                  />
                  <FaCalendarAlt className="calendar-icon" />
                  {errors.appointmentDate && (
                    <span className="error">{errors.appointmentDate.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Artist</label>
                  <p>{artistData?.fname || "Mehndi Artist"} {artistData?.lname || ""}</p>
                  {/* We don't need this hidden field anymore since we're using the URL param */}
                </div>
              </section>

              <section className="form-section">
                <h2>Additional Information</h2>
                <div className="form-group">
                  <label htmlFor="notes">Notes or Special Requests</label>
                  <textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="Enter any additional details or special requests..."
                    rows="4"
                  ></textarea>
                </div>
              </section>

              {submitError && <div className="error">{submitError}</div>}

              <motion.button
                type="submit"
                className="submit-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Contact Artist"}
              </motion.button>
            </motion.form>
          )}
        </div>
      </div>
    </>
  );
};

export default BookAppointmentPage;