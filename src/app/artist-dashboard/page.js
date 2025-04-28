"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "../../lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import "./artist-dashboard.css";


export default function ArtistDashboardPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      where("userRole", "==", "artist"),
      orderBy("timestamp", "desc")
    );
    
    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setNotifications(notificationList);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  const handleEmailClick = (notification) => {
    // Get client email from the appointment
    // For now, opening a default mailto link
    window.location.href = `mailto:client@example.com?subject=Regarding Your Mehndi Appointment Request`;
  };
  
  return (
    <main>
      <Navbar />
      <div className="artist-dashboard-container">
        <h1>Artist Dashboard</h1>
        
        <div className="notifications-section">
          <h2>Your Notifications</h2>
          
          {loading ? (
            <p>Loading notifications...</p>
          ) : notifications.length > 0 ? (
            <div className="notification-list">
              {notifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  <h3>{notification.title}</h3>
                  <p>{notification.content}</p>
                  <p className="notification-time">
                    {notification.timestamp.toLocaleString()}
                  </p>
                  <div className="notification-actions">
                    <button 
                      className="email-button"
                      onClick={() => handleEmailClick(notification)}
                    >
                      Respond via Email
                    </button>
                    {notification.type === "request" && (
                      <Link 
                        href={`/create-offer?appointmentId=${notification.referenceId}`}
                        className="offer-button"
                      >
                        Send Final Offer
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>You have no notifications at this time.</p>
          )}
        </div>
      </div>
    </main>
  );
}