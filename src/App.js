import React from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import OurMission from "./components/pages/OurMission";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExploreDesigns from "./components/pages/ExploreDesigns";
import FindArtists from "./components/pages/FindArtists";
import SignUp from "./components/pages/SignUp";
import Login from "./components/pages/Login";

function App() {
  return (
    <>
      <Router basename="/mehndi">
        <Navbar />
        <Routes>
          <Route path="/" exact element={<OurMission />} />
          <Route path="/ExploreDesigns" element={<ExploreDesigns />} />
          <Route path="/FindArtists" element={<FindArtists />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
