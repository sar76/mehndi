"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "../../lib/firebase";
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import "./client-dashboard.css";


export default function ClientDashboardPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    
    const offersQuery = query(
      collection(db, "offers"),
      where("clientUid", "==", user.uid),
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
  }, []);
  
  const handleAcceptOffer = async (offerId) => {
    try {
      await updateDoc(doc(db, "offers", offerId), {
        status: "accepted"
      });
      
      // Create notification for artist
      const offer = offers.find(o => o.id === offerId);
      if (offer) {
        await addDoc(collection(db, "notifications"), {
          userId: offer.artistUid,
          userRole: "artist",
          type: "offer_accepted",
          title: "Offer Accepted",
          content: `Your offer for the appointment on ${offer.appointmentDate.toDateString()} has been accepted.`,
          referenceId: offerId,
          timestamp: serverTimestamp(),
          read: false
        });
      }
    } catch (error) {
      console.error("Error accepting offer:", error);
    }
  };
  
  const handleDeclineOffer = async (offerId) => {
    try {
      await updateDoc(doc(db, "offers", offerId), {
        status: "declined"
      });
      
      // Create notification for artist
      const offer = offers.find(o => o.id === offerId);
      if (offer) {
        await addDoc(collection(db, "notifications"), {
          userId: offer.artistUid,
          userRole: "artist",
          type: "offer_declined",
          title: "Offer Declined",
          content: `Your offer for the appointment on ${offer.appointmentDate.toDateString()} has been declined.`,
          referenceId: offerId,
          timestamp: serverTimestamp(),
          read: false
        });
      }
    } catch (error) {
      console.error("Error declining offer:", error);
    }
  };
  
  return (
    <main>
      <Navbar />
      <div className="client-dashboard-container">
        <h1>Your Dashboard</h1>
        
        <div className="offers-section">
          <h2>Your Offers</h2>
          
          {loading ? (
            <p>Loading offers...</p>
          ) : offers.length > 0 ? (
            <div className="offers-list">
              {offers.map(offer => (
                <div key={offer.id} className={`offer-item status-${offer.status}`}>
                  <div className="offer-header">
                    <h3>Offer for {offer.appointmentDate.toDateString()}</h3>
                    <span className="offer-status">{offer.status}</span>
                  </div>
                  
                  <div className="offer-services">
                    <h4>Services:</h4>
                    {offer.services.map((service, index) => (
                      <div key={index} className="offer-service-item">
                        <p><strong>{service.description}</strong></p>
                        <p>Quantity: {service.quantity}</p>
                        <p>Price: ${service.price.toFixed(2)} each</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="offer-total">
                    <h4>Total: ${offer.totalPrice.toFixed(2)}</h4>
                  </div>
                  
                  {offer.notes && (
                    <div className="offer-notes">
                      <h4>Notes from Artist:</h4>
                      <p>{offer.notes}</p>
                    </div>
                  )}
                  
                  {offer.status === "pending" && (
                    <div className="offer-actions">
                      <button 
                        className="accept-button"
                        onClick={() => handleAcceptOffer(offer.id)}
                      >
                        Accept Offer
                      </button>
                      <button
                        className="decline-button"
                        onClick={() => handleDeclineOffer(offer.id)}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>You have no offers at this time.</p>
          )}
        </div>
      </div>
    </main>
  );
}