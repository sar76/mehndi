// app/profile/page.js
"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";       // adjust path
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import './profile.css';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [artistData, setArtistData] = useState(null);
  const [formValues, setFormValues] = useState({});
  
  // Portfolio state - declare hooks BEFORE any conditional returns
  const [portfolioItem, setPortfolioItem] = useState({
    url: "",
    title: "",
    description: ""
  });
  
  // Service types for dropdown selection
  const serviceTypes = [
    { id: "singleHandDesign", label: "Single Hand Design (SH)", priceField: "SH_price_min" },
    { id: "bothHandsDesign", label: "Both Hands Design (BH)", priceField: "BH_price_min" },
    { id: "feetDesign", label: "Feet Design (FD)", priceField: "FD_price_min" },
    { id: "armExtension", label: "Arm Extension (AE)", priceField: "AE_price_min" },
    { id: "bridalPackage", label: "Bridal Package (BP)", priceField: "BP_price_min" },
    { id: "specialtyTechniques", label: "Specialty Techniques (ST)", priceField: "ST_price_min" },
    { id: "partyEventPackage", label: "Party/Event Package", priceField: "party_per_person" },
  ];

  // Common style options
  const styleOptions = ["Bridal", "Arabic", "Indo-Arabic", "Traditional", "Modern", "Rajasthani", "Moroccan", "Gulf"];
  
  // Language options
  const languageOptions = ["English", "Hindi", "Urdu", "Arabic", "Punjabi", "Bengali", "Spanish", "French"];

  // 1) Listen for auth & fetch profile docs
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      setUser(u);
      // fetch /users/{uid}
      const uSnap = await getDoc(doc(db, "users", u.uid));
      if (uSnap.exists()) {
        const ud = uSnap.data();
        setUserData(ud);
        
        // if artist, fetch /artists/{uid} and seed formValues
        if (ud.role === "artist") {
          const aSnap = await getDoc(doc(db, "artists", u.uid));
          const ad = aSnap.exists() ? aSnap.data() : {};
          setArtistData(ad);
          setFormValues(ad);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []); // We only want to re-run once on mount

  // Define all handler functions before any conditional returns
  // Handle regular text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((f) => ({ ...f, [name]: value }));
  };

  // Handle number input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormValues((f) => ({ ...f, [name]: value === "" ? "" : Number(value) }));
  };

  // Handle service selection changes
  const handleServiceChange = (e) => {
    const { checked, value } = e.target;
    const currentServices = [...(formValues.serviceOffered || [])];
    
    if (checked && !currentServices.includes(value)) {
      setFormValues((f) => ({
        ...f,
        serviceOffered: [...currentServices, value]
      }));
    } else if (!checked && currentServices.includes(value)) {
      setFormValues((f) => ({
        ...f,
        serviceOffered: currentServices.filter(service => service !== value)
      }));
    }
  };

  // Handle multi-select dropdown for languages
  const handleLanguageChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setFormValues(prev => ({
      ...prev,
      languages: selectedValues
    }));
  };

  // Handle style selection
  const handleStyleChange = (e) => {
    const selectedStyle = e.target.value;
    if (selectedStyle && !formValues.styles?.includes(selectedStyle)) {
      setFormValues(prev => ({
        ...prev,
        styles: [...(prev.styles || []), selectedStyle]
      }));
    }
  };

  // Remove a style
  const removeStyle = (styleToRemove) => {
    setFormValues(prev => ({
      ...prev,
      styles: (prev.styles || []).filter(style => style !== styleToRemove)
    }));
  };

  // Portfolio handlers
  const handlePortfolioItemChange = (e) => {
    const { name, value } = e.target;
    setPortfolioItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addPortfolioItem = () => {
    if (portfolioItem.url && portfolioItem.title) {
      const newPortfolioEntry = [
        portfolioItem.url,
        portfolioItem.title,
        portfolioItem.description,
        new Date() // Timestamp for when added
      ];
      
      setFormValues(prev => ({
        ...prev,
        portfolio: [...(prev.portfolio || []), newPortfolioEntry]
      }));
      
      // Reset form
      setPortfolioItem({
        url: "",
        title: "",
        description: ""
      });
    }
  };

  const removePortfolioItem = (index) => {
    setFormValues(prev => ({
      ...prev,
      portfolio: (prev.portfolio || []).filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Make sure portfolio items have correct format
      let formattedData = {...formValues};
      
      // Ensure portfolio format is correct
      if (formattedData.portfolio && Array.isArray(formattedData.portfolio)) {
        // Make sure each portfolio item has timestamp as the fourth element
        formattedData.portfolio = formattedData.portfolio.map(item => {
          // If it's already a Date or Firestore timestamp, keep it
          if (item.length >= 4 && (item[3] instanceof Date || item[3]?.seconds)) {
            return item;
          }
          // Otherwise ensure we have all 4 elements with a new Date for timestamp
          return [
            item[0] || "", // URL
            item[1] || "", // Title
            item[2] || "", // Description
            new Date()     // Timestamp
          ];
        });
      }
      
      // Don't update system-calculated fields
      const { rating, reviews, ...dataToUpdate } = formattedData;
      
      console.log("Saving data to Firestore:", dataToUpdate);
      
      await updateDoc(doc(db, "artists", user.uid), dataToUpdate);
      alert("Profile updated!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save: " + (err.message || err));
    }
  };

  // Only after all hooks and handlers are defined, we can have conditional returns
  if (loading) return <p>Loading…</p>;

  // 2) Client view (read-only)
  if (userData?.role === "client") {
    return (
      <>
        <Navbar />
        <main>
          <h1>Your Profile</h1>
          <p><strong>Name:</strong> {userData.fullName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          {/* add more client‑only fields if desired */}
          <button onClick={() => signOut(auth)}>Log out</button>
        </main>
      </>
    );
  }

  // 3) Artist view (editable)
  return (
    <>
      <Navbar />
      <main className="profile-container">
        <h1>Your Artist Profile</h1>
        <form onSubmit={handleSave}>
          {/* Basic Information */}
          <section className="form-section">
            <h2>Basic Information</h2>
            <div className="form-field">
              <label>First Name</label>
              <input
                name="fname"
                value={formValues.fname || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-field">
              <label>Last Name</label>
              <input
                name="lname"
                value={formValues.lname || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-field">
              <label>City</label>
              <input
                name="city"
                value={formValues.city || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-field">
              <label>Country</label>
              <input
                name="country"
                value={formValues.country || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-field">
              <label>Phone</label>
              <input
                name="phone"
                value={formValues.phone || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-field">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={formValues.email || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-field">
              <label>Years of Experience</label>
              <input
                name="yearsexperience"
                type="number"
                min="0"
                value={formValues.yearsexperience || ""}
                onChange={handleNumberChange}
                required
              />
            </div>
            
            <div className="form-field">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formValues.bio || ""}
                onChange={handleChange}
                rows="4"
                placeholder="Share your experience, inspiration, and unique approach to mehndi art..."
              />
            </div>
            
            <div className="form-field">
              <label>Availability</label>
              <select 
                name="availability"
                value={formValues.availability || ""}
                onChange={handleChange}
              >
                <option value="">Select availability</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
                <option value="Evenings">Evenings</option>
                <option value="All days">All days</option>
                <option value="By appointment only">By appointment only</option>
              </select>
            </div>
          </section>
          
          {/* Languages */}
          <section className="form-section">
            <h2>Languages</h2>
            <div className="form-field">
              <label>Select Languages (hold Ctrl/Cmd to select multiple)</label>
              <select 
                multiple
                name="languages" 
                value={formValues.languages || []}
                onChange={handleLanguageChange}
                className="multi-select"
              >
                {languageOptions.map(language => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
              <p className="helper-text">Selected: {(formValues.languages || []).join(", ") || "None"}</p>
            </div>
          </section>
          
          {/* Styles */}
          <section className="form-section">
            <h2>Mehndi Styles</h2>
            <div className="form-field">
              <label>Add Style</label>
              <div className="select-with-button">
                <select 
                  name="styleToAdd"
                  onChange={handleStyleChange}
                  value=""
                >
                  <option value="" disabled>Select a style to add</option>
                  {styleOptions.filter(style => 
                    !(formValues.styles || []).includes(style)
                  ).map(style => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>
              
              {(formValues.styles || []).length > 0 && (
                <div className="selected-items">
                  <label>Your Styles:</label>
                  <div className="tag-container">
                    {(formValues.styles || []).map(style => (
                      <span key={style} className="tag">
                        {style}
                        <button 
                          type="button" 
                          className="tag-remove"
                          onClick={() => removeStyle(style)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
          
          {/* Services and Pricing */}
          <section className="form-section">
            <h2>Services & Pricing</h2>
            <p className="helper-text">Select the services you offer and set your minimum prices</p>
            
            {serviceTypes.map(service => (
              <div key={service.id} className="service-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value={service.id}
                    checked={(formValues.serviceOffered || []).includes(service.id)}
                    onChange={handleServiceChange}
                  />
                  {service.label}
                </label>
                
                {(formValues.serviceOffered || []).includes(service.id) && (
                  <div className="price-input">
                    <label>Minimum Price ($)</label>
                    <input
                      type="number"
                      name={service.priceField}
                      value={formValues[service.priceField] || ""}
                      onChange={handleNumberChange}
                      min="0"
                      required={formValues.serviceOffered?.includes(service.id)}
                    />
                  </div>
                )}
              </div>
            ))}
          </section>
          
          {/* Portfolio */}
          <section className="form-section">
            <h2>Portfolio</h2>
            <p className="helper-text">Add images of your work to showcase your skills</p>
            
            {/* Add new portfolio item */}
            <div className="add-portfolio">
              <h3>Add New Portfolio Item</h3>
              <div className="form-field">
                <label>Image URL</label>
                <input
                  name="url"
                  value={portfolioItem.url}
                  onChange={handlePortfolioItemChange}
                  placeholder="https://example.com/your-work.jpg"
                />
              </div>
              <div className="form-field">
                <label>Title</label>
                <input
                  name="title"
                  value={portfolioItem.title}
                  onChange={handlePortfolioItemChange}
                  placeholder="Bridal Mehndi Design"
                />
              </div>
              <div className="form-field">
                <label>Description</label>
                <textarea
                  name="description"
                  value={portfolioItem.description}
                  onChange={handlePortfolioItemChange}
                  placeholder="Brief description of the design and occasion"
                  rows="2"
                />
              </div>
              <button 
                type="button" 
                onClick={addPortfolioItem}
                className="add-btn"
              >
                Add to Portfolio
              </button>
            </div>
            
            {/* Current portfolio items */}
            {(formValues.portfolio || []).length > 0 && (
              <div className="portfolio-list">
                <h3>Your Portfolio</h3>
                {(formValues.portfolio || []).map((item, index) => (
                  <div key={index} className="portfolio-item">
                    <div className="portfolio-item-details">
                      <div className="portfolio-image">
                        <img src={item[0]} alt={item[1]} />
                      </div>
                      <div className="portfolio-text">
                        <h4>{item[1]}</h4>
                        <p>{item[2] || "No description"}</p>
                        <p className="date-added">Added: {item[3] instanceof Date ? 
                          item[3].toLocaleDateString() : 
                          new Date(item[3]?.seconds * 1000 || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removePortfolioItem(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
          
          <button type="submit" className="save-btn">Save Profile</button>
        </form>

        <button onClick={() => signOut(auth)} className="logout-btn">Log out</button>
      </main>
    </>
  );
}