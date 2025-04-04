"use client";

import React, { useState } from "react";
import Head from "next/head";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import Navbar from "@/components/Navbar"; // Import your shared Navbar component
import "./BookAppointment.css";

const BookAppointmentPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [appointmentDate, setAppointmentDate] = useState(new Date());

  const onSubmit = (data) => {
    console.log("Appointment Data:", data);
    // Implement booking logic or API call here
    alert("Your request has been sent. Please await the artist's quote.");
  };

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
                    />
                  )}
                />
                <FaCalendarAlt className="calendar-icon" />
              </div>
              <div className="form-group">
                <label>Artist</label>
                <p>Mehndi Artist 1</p>
                <input
                  type="hidden"
                  value="mehndiArtist1"
                  {...register("artist", { required: true })}
                />
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

            <motion.button
              type="submit"
              className="submit-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Artist
            </motion.button>
          </motion.form>
        </div>
      </div>
    </>
  );
};

export default BookAppointmentPage;
