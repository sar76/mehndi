"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Retrieves dynamic route parameters
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../../lib/firebase"; // Adjust your path if needed

export default function UserProfile() {
  const { uid } = useParams(); // Extracts the user's uid from the URL
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const db = getFirestore(app);
        // Assuming you store extra user details in a "profiles" collection:
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    if (uid) fetchProfile();
  }, [uid]);

  return (
    <div className="user-profile">
      {profileData ? (
        <>
          <h1>{profileData.displayName || "User Profile"}</h1>
          <p>Email: {profileData.email}</p>
          {/* Render additional profile fields as needed */}
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
