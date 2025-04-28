// app/profile/page.js
"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import './profile.css';
import { collection, query, where, onSnapshot, orderBy, addDoc } from "firebase/firestore";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [artistData, setArtistData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [activeTab, setActiveTab] = useState("profile");
  
  // Portfolio state
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

  // Fetch user and profile data
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      setUser(u);
      try {
        // Fetch user data
        const uSnap = await getDoc(doc(db, "users", u.uid));
        if (uSnap.exists()) {
          const ud = uSnap.data();
          setUserData(ud);
          
          // If artist, fetch artist data
          if (ud.role === "artist") {
            const aSnap = await getDoc(doc(db, "artists", u.uid));
            const ad = aSnap.exists() ? aSnap.data() : {};
            setArtistData(ad);
            setFormValues(ad);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    });
    
    return () => unsub();
  }, [router]);

  // Form input handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
  };

  const handleServiceChange = (e) => {
    const { checked, value } = e.target;
    const currentServices = [...(formValues.serviceOffered || [])];
    
    if (checked && !currentServices.includes(value)) {
      setFormValues((prev) => ({
        ...prev,
        serviceOffered: [...currentServices, value]
      }));
    } else if (!checked && currentServices.includes(value)) {
      setFormValues((prev) => ({
        ...prev,
        serviceOffered: currentServices.filter(service => service !== value)
      }));
    }
  };

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

  const handleStyleChange = (e) => {
    const selectedStyle = e.target.value;
    if (selectedStyle && !formValues.styles?.includes(selectedStyle)) {
      setFormValues(prev => ({
        ...prev,
        styles: [...(prev.styles || []), selectedStyle]
      }));
    }
  };

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

  // Format data for saving to Firestore
  const formatDataForSave = () => {
    let formattedData = {...formValues};
    
    // Format portfolio items
    if (formattedData.portfolio && Array.isArray(formattedData.portfolio)) {
      formattedData.portfolio = formattedData.portfolio.map(item => {
        if (item.length >= 4 && (item[3] instanceof Date || item[3]?.seconds)) {
          return item;
        }
        return [
          item[0] || "", // URL
          item[1] || "", // Title
          item[2] || "", // Description
          new Date()     // Timestamp
        ];
      });
    }
    
    // Remove system-calculated fields
    const { rating, reviews, ...dataToUpdate } = formattedData;
    return dataToUpdate;
  };

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    try {
      const dataToUpdate = formatDataForSave();
      await updateDoc(doc(db, "artists", user.uid), dataToUpdate);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  const handleUnpublish = async () => {
    if (!user) return;
    
    const confirmUnpublish = window.confirm(
      "Are you sure you want to unpublish your profile? It will no longer be visible to clients."
    );
    
    if (!confirmUnpublish) return;
    
    setPublishing(true); // You can reuse the publishing state
    try {
      await updateDoc(doc(db, "artists", user.uid), {
        isPublished: false,
        updatedAt: serverTimestamp()
      });
      alert("Your profile has been unpublished and is no longer visible to clients.");
    } catch (err) {
      console.error("Error unpublishing profile:", err);
      alert("Failed to unpublish: " + (err.message || err));
    } finally {
      setPublishing(false);
    }
  };

  // Add this as a new component in the file
const ArtistNotifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
        // wait until we know who’s logged in
        if (!user?.uid) {
          setLoading(false);
          return;
        }
    
        const notifQ = query(
          collection(db, "notifications"),
          where("userId", "==", user.uid),       // make sure you’re using the real uid
          orderBy("timestamp", "desc")
        );
    
        const unsubscribe = onSnapshot(
         notifQ,
          (snap) => {
            setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);                    // ← turn off loading here
          },
          (error) => {
           console.error("Notifications error:", error);
            setLoading(false);                    // ← and here on error
          }
        );
    
        return () => unsubscribe();
      }, [user?.uid]);                            // ← listen for the actual user.uid
  
  const handleEmailResponse = async (notification) => {
    // If this is an appointment request, get client email
    if (notification.type === "request" && notification.referenceId) {
      try {
        const appointmentDoc = await getDoc(doc(db, "appointments", notification.referenceId));
        if (appointmentDoc.exists()) {
          const appointmentData = appointmentDoc.data();
          // Open email client with pre-filled email
          window.location.href = `mailto:${appointmentData.email}?subject=Regarding Your Mehndi Appointment Request&body=Thank you for your interest in booking an appointment.`;
        }
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    }
  };
  
  const handleCreateOffer = (notification) => {
    // Redirect to create offer page
    window.location.href = `/create-offer?appointmentId=${notification.referenceId}`;
  };
  
  if (loading) {
    return <div>Loading notifications...</div>;
  }
  
  if (notifications.length === 0) {
    return <div className="no-notifications">You have no notifications at this time.</div>;
  }
  
  return (
    <div className="notifications-container">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification-item ${!notification.read ? 'unread' : ''}`}>
          <div className="notification-header">
            <h3>{notification.title}</h3>
            <span className="notification-time">
              {notification.timestamp.toLocaleString()}
            </span>
          </div>
          <p>{notification.content}</p>
          <div className="notification-actions">
            {notification.type === "request" && (
              <>
                <button 
                  className="email-response-btn"
                  onClick={() => handleEmailResponse(notification)}
                >
                  Respond via Email
                </button>
                <button 
                  className="create-offer-btn"
                  onClick={() => handleCreateOffer(notification)}
                >
                  Send Final Offer
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Add this as a new component in the file
const ArtistOffers = ({ userId }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!userId) return;
    
    const offersQuery = query(
      collection(db, "offers"),
      where("artistUid", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(offersQuery, (snapshot) => {
      const offersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        appointmentDate: doc.data().appointmentDate?.toDate() || new Date()
      }));
      setOffers(offersList);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [userId]);
  
  if (loading) {
    return <div>Loading offers...</div>;
  }
  
  if (offers.length === 0) {
    return <div className="no-offers">You haven't sent any offers yet.</div>;
  }
  
  return (
    <div className="offers-container">
      {offers.map(offer => (
        <div key={offer.id} className={`offer-item status-${offer.status}`}>
          <div className="offer-header">
            <h3>Offer for {offer.appointmentDate.toLocaleDateString()}</h3>
            <span className={`offer-status ${offer.status}`}>
              {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
            </span>
          </div>
          
          <div className="offer-details">
            <h4>Services:</h4>
            <ul className="services-list">
              {offer.services.map((service, index) => (
                <li key={index}>
                  <strong>{service.description}</strong> - ${service.price} x {service.quantity}
                </li>
              ))}
            </ul>
            <p className="total-price"><strong>Total:</strong> ${offer.totalPrice.toFixed(2)}</p>
            {offer.notes && (
              <div className="offer-notes">
                <h4>Notes:</h4>
                <p>{offer.notes}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Add this as a new component in the file
const ClientOffers = ({ userId }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!userId) return;
    
    const offersQuery = query(
      collection(db, "offers"),
      where("clientUid", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(offersQuery, (snapshot) => {
      const offersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        appointmentDate: doc.data().appointmentDate?.toDate() || new Date()
      }));
      setOffers(offersList);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [userId]);
  
  const handleAcceptOffer = async (offerId) => {
    try {
      // Update offer status
      await updateDoc(doc(db, "offers", offerId), {
        status: "accepted",
        updatedAt: serverTimestamp()
      });
      
      // Get offer data for notification
      const offerData = offers.find(o => o.id === offerId);
      
      // Create notification for artist
      await addDoc(collection(db, "notifications"), {
        userId: offerData.artistUid,
        userRole: "artist",
        type: "offer_accepted",
        title: "Offer Accepted",
        content: `Your offer for ${offerData.appointmentDate.toLocaleDateString()} has been accepted!`,
        referenceId: offerId,
        timestamp: serverTimestamp(),
        read: false
      });
    } catch (error) {
      console.error("Error accepting offer:", error);
      alert("Failed to accept offer: " + error.message);
    }
  };
  
  const handleDeclineOffer = async (offerId) => {
    try {
      // Update offer status
      await updateDoc(doc(db, "offers", offerId), {
        status: "declined",
        updatedAt: serverTimestamp()
      });
      
      // Get offer data for notification
      const offerData = offers.find(o => o.id === offerId);
      
      // Create notification for artist
      await addDoc(collection(db, "notifications"), {
        userId: offerData.artistUid,
        userRole: "artist",
        type: "offer_declined",
        title: "Offer Declined",
        content: `Your offer for ${offerData.appointmentDate.toLocaleDateString()} has been declined.`,
        referenceId: offerId,
        timestamp: serverTimestamp(),
        read: false
      });
    } catch (error) {
      console.error("Error declining offer:", error);
      alert("Failed to decline offer: " + error.message);
    }
  };
  
  if (loading) {
    return <div>Loading offers...</div>;
  }
  
  if (offers.length === 0) {
    return <div className="no-offers">You haven't received any offers yet.</div>;
  }
  
  return (
    <div className="client-offers-container">
      {offers.map(offer => (
        <div key={offer.id} className={`offer-item status-${offer.status}`}>
          <div className="offer-header">
            <h3>Offer for {offer.appointmentDate.toLocaleDateString()}</h3>
            <span className={`offer-status ${offer.status}`}>
              {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
            </span>
          </div>
          
          <div className="offer-details">
            <h4>Services:</h4>
            <ul className="services-list">
              {offer.services.map((service, index) => (
                <li key={index}>
                  <strong>{service.description}</strong> - ${service.price} x {service.quantity}
                </li>
              ))}
            </ul>
            <p className="total-price"><strong>Total:</strong> ${offer.totalPrice.toFixed(2)}</p>
            {offer.notes && (
              <div className="offer-notes">
                <h4>Notes from Artist:</h4>
                <p>{offer.notes}</p>
              </div>
            )}
          </div>
          
          {offer.status === "pending" && (
            <div className="offer-actions">
              <button 
                onClick={() => handleAcceptOffer(offer.id)}
                className="accept-btn"
              >
                Accept Offer
              </button>
              <button 
                onClick={() => handleDeclineOffer(offer.id)}
                className="decline-btn"
              >
                Decline Offer
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
  // Publish profile
  const handlePublish = async () => {
    if (!user) return;
    
    const confirmPublish = window.confirm(
      "Are you sure you want to publish your profile? It will be visible to all users."
    );
    
    if (!confirmPublish) return;
    
    setPublishing(true);
    try {
      const dataToUpdate = formatDataForSave();
      
      // Add publish-specific fields
      dataToUpdate.isPublished = true;
      dataToUpdate.updatedAt = serverTimestamp();
      
      await updateDoc(doc(db, "artists", user.uid), dataToUpdate);
      alert("Your profile is now live!");
    } catch (err) {
      console.error("Error publishing profile:", err);
      alert("Failed to publish: " + (err.message || err));
    } finally {
      setPublishing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="profile-container">
          <div className="loading">Loading your profile...</div>
        </main>
      </>
    );
  }

  // Client view (read-only)
  if (userData?.role === "client") {
    return (
      <>
        <Navbar />
        <main className="profile-container">
          <h1>Your Profile</h1>
          <p><strong>Name:</strong> {userData.fullName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <button onClick={() => signOut(auth)} className="logout-btn">Log out</button>
        </main>
      </>
    );
  }

  const renderTabs = () => (
    <div className="profile-tabs">
      <button 
        className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
        onClick={() => setActiveTab("profile")}
      >
        Profile
      </button>
      {userData?.role === "artist" && (
        <>
          <button 
            className={`tab-button ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button 
            className={`tab-button ${activeTab === "offers" ? "active" : ""}`}
            onClick={() => setActiveTab("offers")}
          >
            Offers
          </button>
        </>
      )}
      {userData?.role === "client" && (
        <button 
          className={`tab-button ${activeTab === "offers" ? "active" : ""}`}
          onClick={() => setActiveTab("offers")}
        >
          Offers
        </button>
      )}
    </div>
  );
  // Artist view (editable)
  // Artist view (editable with tabs)
return (
  <>
    <Navbar />
    <main className="profile-container">
      <h1>Your Artist Profile</h1>
      
      {renderTabs()}
      
      {activeTab === "profile" && (
        <>
          <div className="publish-status">
            {formValues.isPublished ? (
              <div className="status-published">Your profile is published and visible to clients</div>
            ) : (
              <div className="status-draft">Your profile is currently in draft mode and not visible to clients</div>
            )}
          </div>
          
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
                  disabled={!portfolioItem.url || !portfolioItem.title}
                >
                  Add to Portfolio
                </button>
              </div>
              
              {/* Current portfolio items */}
              {(formValues.portfolio || []).length > 0 && (
                <div className="portfolio-list">
                  <h3>Your Portfolio ({(formValues.portfolio || []).length} items)</h3>
                  {(formValues.portfolio || []).map((item, index) => (
                    <div key={index} className="portfolio-item">
                      <div className="portfolio-item-details">
                        <div className="portfolio-image">
                          <img src={item[0]} alt={item[1]} />
                        </div>
                        <div className="portfolio-text">
                          <h4>{item[1]}</h4>
                          <p>{item[2] || "No description"}</p>
                          <p className="date-added">
                            Added: {item[3] instanceof Date ? 
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
            
            <div className="action-buttons">
              <button 
                type="submit" 
                className="save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
              
              {!formValues.isPublished ? (
                <button
                  type="button"
                  className="publish-btn"
                  onClick={handlePublish}
                  disabled={publishing || saving}
                >
                  {publishing ? "Publishing..." : "Publish Profile"}
                </button>
              ) : (
                <button
                  type="button"
                  className="unpublish-btn"
                  onClick={handleUnpublish}
                  disabled={publishing || saving}
                >
                  {publishing ? "Unpublishing..." : "Unpublish Profile"}
                </button>
              )}
            </div>
          </form>
        </>
      )}
      
      {activeTab === "notifications" && userData?.role === "artist" && (
        <ArtistNotifications userId={user.uid} />
      )}
      
      {activeTab === "offers" && userData?.role === "artist" && (
        <ArtistOffers userId={user.uid} />
      )}
      
      {activeTab === "offers" && userData?.role === "client" && (
        <ClientOffers userId={user.uid} />
      )}
      
      <button 
        onClick={() => signOut(auth)} 
        className="logout-btn"
        disabled={saving || publishing}
      >
        Log out
      </button>
    </main>
  </>
);
}