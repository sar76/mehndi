"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db, auth } from "../../lib/firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import "./create-offer.css";

export default function CreateOfferPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  
  const [appointmentData, setAppointmentData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [notes, setNotes] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!appointmentId) return;
        
        // Fetch appointment data
        const appointmentDoc = await getDoc(doc(db, "appointments", appointmentId));
        if (appointmentDoc.exists()) {
          const data = appointmentDoc.data();
          setAppointmentData(data);
          
          // Fetch client data
          const clientDoc = await getDoc(doc(db, "users", data.clientUid));
          if (clientDoc.exists()) {
            setClientData(clientDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [appointmentId]);
  
  const addService = () => {
    setServices([
      ...services,
      {
        serviceType: "singleHandDesign",
        description: "Single Hand Design",
        price: 0,
        quantity: 1
      }
    ]);
  };
  
  const updateService = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
    
    // Recalculate total
    const sum = updatedServices.reduce((total, service) => {
      return total + (service.price * service.quantity);
    }, 0);
    setTotalPrice(sum);
  };
  
  const removeService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
    
    // Recalculate total
    const sum = updatedServices.reduce((total, service) => {
      return total + (service.price * service.quantity);
    }, 0);
    setTotalPrice(sum);
  };
  
  const sendOffer = async () => {
    try {
      if (!auth.currentUser || !appointmentData) return;
      
      // Create the offer
      const offerData = {
        artistUid: auth.currentUser.uid,
        clientUid: appointmentData.clientUid,
        services: services,
        totalPrice: totalPrice,
        status: "pending",
        createdAt: serverTimestamp(),
        appointmentDate: appointmentData.appointmentDate,
        notes: notes,
        originalAppointmentId: appointmentId
      };
      
      const offerRef = await addDoc(collection(db, "offers"), offerData);
      
      // Create notification for client
      const notificationData = {
        userId: appointmentData.clientUid,
        userRole: "client",
        type: "offer",
        title: "New Offer Received",
        content: `You received a new offer for your appointment on ${new Date(appointmentData.appointmentDate).toDateString()}`,
        referenceId: offerRef.id,
        timestamp: serverTimestamp(),
        read: false
      };
      
      await addDoc(collection(db, "notifications"), notificationData);
      
      // Redirect to success page or dashboard
      router.push("/artist-dashboard?offerSent=true");
    } catch (error) {
      console.error("Error sending offer:", error);
    }
  };
  
  if (loading) {
    return (
      <main>
        <Navbar />
        <div>Loading appointment details...</div>
      </main>
    );
  }
  
  return (
    <main>
      <Navbar />
      <div className="create-offer-container">
        <h1>Create Client Offer</h1>
        
        {appointmentData ? (
          <>
            <div className="appointment-summary">
              <h2>Appointment Details</h2>
              <p><strong>Client:</strong> {clientData?.fullName}</p>
              <p><strong>Date:</strong> {new Date(appointmentData.appointmentDate).toLocaleString()}</p>
              <p><strong>Notes:</strong> {appointmentData.notes || "None"}</p>
            </div>
            
            <div className="offer-services">
              <h2>Services</h2>
              
              {services.map((service, index) => (
                <div key={index} className="service-item">
                  <select
                    value={service.serviceType}
                    onChange={(e) => updateService(index, "serviceType", e.target.value)}
                  >
                    <option value="singleHandDesign">Single Hand Design</option>
                    <option value="bothHandsDesign">Both Hands Design</option>
                    <option value="feetDesign">Feet Design</option>
                    <option value="armExtension">Arm Extension</option>
                    <option value="bridalPackage">Bridal Package</option>
                    <option value="partyEventPackage">Party/Event Package</option>
                  </select>
                  
                  <input
                    type="text"
                    placeholder="Description"
                    value={service.description}
                    onChange={(e) => updateService(index, "description", e.target.value)}
                  />
                  
                  <input
                    type="number"
                    placeholder="Price"
                    value={service.price}
                    onChange={(e) => updateService(index, "price", parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                  
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={service.quantity}
                    onChange={(e) => updateService(index, "quantity", parseInt(e.target.value))}
                    min="1"
                  />
                  
                  <button onClick={() => removeService(index)}>Remove</button>
                </div>
              ))}
              
              <button onClick={addService}>Add Service</button>
            </div>
            
            <div className="offer-total">
              <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
            </div>
            
            <div className="offer-notes">
              <h3>Additional Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional information about your offer..."
                rows="4"
              ></textarea>
            </div>
            
            <div className="offer-actions">
              <button 
                className="send-offer-button" 
                onClick={sendOffer}
                disabled={services.length === 0}
              >
                Send Offer to Client
              </button>
            </div>
          </>
        ) : (
          <p>Appointment not found</p>
        )}
      </div>
    </main>
  );
}