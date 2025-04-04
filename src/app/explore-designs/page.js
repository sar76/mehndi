"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiX,
  FiHeart,
  FiShare2,
  FiFilter,
  FiArrowLeft,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";

// Import the enhanced CSS
import "./ExploreDesigns.css";
import "../globals.css";

export default function ExploreDesignsPage() {
  // Sample design data (replace with your actual designs later)
  const [designs, setDesigns] = useState([
    {
      id: 1,
      title: "Traditional Bridal Mehndi",
      category: "Bridal",
      region: "North Indian",
      difficulty: "Complex",
      occasion: "Wedding",
      description:
        "Traditional North Indian bridal mehndi features intricate patterns covering the entire hand and extending up to the elbow. Common motifs include the dulha-dulhan (bride and groom), peacocks, lotus flowers, and detailed paisleys, symbolizing joy, love, and prosperity.",
      culturalSignificance:
        "In Indian weddings, the darkness of the bride's mehndi is believed to represent the strength of love in the marriage. Traditionally, the groom's name is hidden within the design, and it becomes a playful game for him to find it on the wedding night.",
    },
    {
      id: 2,
      title: "Arabic Floral Design",
      category: "Arabic",
      region: "Middle Eastern",
      difficulty: "Moderate",
      occasion: "Festive",
      description:
        "Arabic mehndi designs are characterized by their bold, floral patterns with large, open spaces. These designs usually feature flowing vines, flowers, and geometric shapes that create an elegant and striking appearance.",
      culturalSignificance:
        "In Middle Eastern cultures, henna is applied during celebrations and special occasions. The floral motifs often represent beauty, joy, and femininity, while the open designs allow for faster application and drying.",
    },
    {
      id: 3,
      title: "Minimalist Modern",
      category: "Contemporary",
      region: "Indo-Western",
      difficulty: "Simple",
      occasion: "Casual",
      description:
        "Minimalist modern mehndi designs feature clean lines, simple geometric patterns, and strategic negative space. These contemporary designs often incorporate elements like mandalas, simple vines, or abstract patterns that are quick to apply and perfect for casual occasions.",
      culturalSignificance:
        "These fusion designs represent the blend of traditional art with modern aesthetics, appealing to younger generations who want to honor cultural traditions while expressing their personal style.",
    },
    {
      id: 4,
      title: "Rajasthani Marwari Design",
      category: "Traditional",
      region: "Rajasthani",
      difficulty: "Complex",
      occasion: "Wedding",
      description:
        "Rajasthani Marwari mehndi is known for its intricate detailing and density. These designs typically cover the entire hand and feature motifs like peacocks, elephants, and geometric patterns arranged in a symmetrical layout.",
      culturalSignificance:
        "In Rajasthan, mehndi designs reflect the region's vibrant culture and artistic heritage. The intricate details symbolize the elaborate traditions of Marwari weddings, with specific motifs representing prosperity and fertility.",
    },
    {
      id: 5,
      title: "Indo-Arabic Fusion",
      category: "Fusion",
      region: "Multicultural",
      difficulty: "Moderate",
      occasion: "Engagement",
      description:
        "Indo-Arabic fusion combines the intricate filling patterns of Indian mehndi with the bold, spacious elements of Arabic designs. These fusion designs offer a balance of detail and negative space, creating a contemporary yet traditional look.",
      culturalSignificance:
        "Fusion designs represent the cultural exchange and evolution of mehndi art across different regions. They're particularly popular among modern brides who want to honor multiple cultural traditions.",
    },
  ]);

  // Filter states
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [occasion, setOccasion] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDesigns, setFilteredDesigns] = useState(designs);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Modal state
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter dropdowns data
  const categories = [
    "Bridal",
    "Arabic",
    "Contemporary",
    "Traditional",
    "Fusion",
  ];
  const regions = [
    "North Indian",
    "South Indian",
    "Middle Eastern",
    "Indo-Western",
    "Rajasthani",
    "Multicultural",
  ];
  const difficulties = ["Simple", "Moderate", "Complex"];
  const occasions = ["Wedding", "Engagement", "Festive", "Casual"];

  // Get active filters
  const getActiveFilters = () => {
    const filters = [];
    if (category) filters.push({ type: "category", value: category });
    if (region) filters.push({ type: "region", value: region });
    if (difficulty) filters.push({ type: "difficulty", value: difficulty });
    if (occasion) filters.push({ type: "occasion", value: occasion });
    return filters;
  };

  // Remove single filter
  const removeFilter = (type) => {
    switch (type) {
      case "category":
        setCategory("");
        break;
      case "region":
        setRegion("");
        break;
      case "difficulty":
        setDifficulty("");
        break;
      case "occasion":
        setOccasion("");
        break;
      default:
        break;
    }
  };

  // Apply filters when they change
  useEffect(() => {
    let result = designs;

    if (category) {
      result = result.filter((design) => design.category === category);
    }

    if (region) {
      result = result.filter((design) => design.region === region);
    }

    if (difficulty) {
      result = result.filter((design) => design.difficulty === difficulty);
    }

    if (occasion) {
      result = result.filter((design) => design.occasion === occasion);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (design) =>
          design.title.toLowerCase().includes(term) ||
          design.description.toLowerCase().includes(term) ||
          design.culturalSignificance.toLowerCase().includes(term)
      );
    }

    setFilteredDesigns(result);
  }, [category, region, difficulty, occasion, searchTerm, designs]);

  // Reset all filters
  const resetFilters = () => {
    setCategory("");
    setRegion("");
    setDifficulty("");
    setOccasion("");
    setSearchTerm("");
  };

  // Open design modal
  const openDesignModal = (design) => {
    setSelectedDesign(design);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  // Close design modal
  const closeDesignModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) closeDesignModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Placeholder image for missing images
  const placeholderImage =
    "https://via.placeholder.com/500x500?text=Mehndi+Design";

  // Get tag color class based on type
  const getTagClass = (type, value) => {
    switch (type) {
      case "category":
        return "tag-category";
      case "region":
        return "tag-region";
      case "difficulty":
        return "tag-difficulty";
      case "occasion":
        return "tag-occasion";
      default:
        return "";
    }
  };

  return (
    <main>
      <Navbar />
      <div className="explore-designs-container">
        <motion.div
          className="explore-designs-hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore Mehndi Designs
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Discover beautiful henna designs from various traditions and learn
            about their cultural significance
          </motion.p>
        </motion.div>

        <motion.div
          className="filters-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2>Find Your Perfect Design</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search designs by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch />
          </div>

          <div className="filter-dropdowns">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">All Regions</option>
                {regions.map((reg, index) => (
                  <option key={index} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">All Difficulties</option>
                {difficulties.map((diff, index) => (
                  <option key={index} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Occasion</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
              >
                <option value="">All Occasions</option>
                {occasions.map((occ, index) => (
                  <option key={index} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {getActiveFilters().length > 0 && (
            <motion.div
              className="active-filters"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {getActiveFilters().map((filter, index) => (
                <div key={index} className="active-filter">
                  {filter.type}: {filter.value}
                  <span onClick={() => removeFilter(filter.type)}> ×</span>
                </div>
              ))}
            </motion.div>
          )}

          <button className="reset-filters" onClick={resetFilters}>
            Reset All Filters
          </button>
        </motion.div>

        <motion.div
          className="designs-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <AnimatePresence>
            {filteredDesigns.length > 0 ? (
              filteredDesigns.map((design, index) => (
                <motion.div
                  key={design.id}
                  className="design-card"
                  onClick={() => openDesignModal(design)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: (0.1 * index) % 5 },
                  }}
                  exit={{ opacity: 0, y: 20 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="design-image">
                    <img src={placeholderImage} alt={design.title} />
                  </div>
                  <div className="design-info">
                    <h3>{design.title}</h3>
                    <div className="design-tags">
                      <span className={`design-tag ${getTagClass("category")}`}>
                        {design.category}
                      </span>
                      <span className={`design-tag ${getTagClass("region")}`}>
                        {design.region}
                      </span>
                      <span
                        className={`design-tag ${getTagClass("difficulty")}`}
                      >
                        {design.difficulty}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "50px",
                  color: "#666",
                }}
              >
                <h3>No designs match your filters</h3>
                <p>Try adjusting your search criteria or reset the filters</p>
                <button
                  className="reset-filters"
                  onClick={resetFilters}
                  style={{ marginTop: "20px" }}
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {isModalOpen && selectedDesign && (
            <motion.div
              className="design-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDesignModal}
            >
              <motion.div
                className="modal-content"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-modal" onClick={closeDesignModal}>
                  <FiX />
                </button>
                <div className="modal-header">
                  <h2>{selectedDesign.title}</h2>
                  <div className="design-tags">
                    <span className={`tag ${getTagClass("category")}`}>
                      {selectedDesign.category}
                    </span>
                    <span className={`tag ${getTagClass("region")}`}>
                      {selectedDesign.region}
                    </span>
                    <span className={`tag ${getTagClass("difficulty")}`}>
                      {selectedDesign.difficulty}
                    </span>
                    <span className={`tag ${getTagClass("occasion")}`}>
                      {selectedDesign.occasion}
                    </span>
                  </div>
                </div>
                <div className="modal-body">
                  <div className="design-images">
                    <img src={placeholderImage} alt={selectedDesign.title} />
                  </div>
                  <div className="design-details">
                    <div
                      className="actions"
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "20px",
                      }}
                    >
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          background: "#ff4b4b",
                          color: "white",
                          border: "none",
                          padding: "8px 15px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <FiHeart /> Favorite
                      </button>
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          background: "#f0f0f0",
                          color: "#666",
                          border: "none",
                          padding: "8px 15px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <FiShare2 /> Share
                      </button>
                    </div>

                    <h3>Description</h3>
                    <p>{selectedDesign.description}</p>
                    <h3>Cultural Significance</h3>
                    <p>{selectedDesign.culturalSignificance}</p>

                    <div
                      style={{
                        background: "#f9f7f4",
                        padding: "20px",
                        borderRadius: "10px",
                        marginTop: "30px",
                      }}
                    >
                      <h3 style={{ marginTop: 0 }}>Related Designs</h3>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(120px, 1fr))",
                          gap: "15px",
                        }}
                      >
                        {designs
                          .filter(
                            (d) =>
                              d.id !== selectedDesign.id &&
                              (d.category === selectedDesign.category ||
                                d.region === selectedDesign.region)
                          )
                          .slice(0, 4)
                          .map((design) => (
                            <div
                              key={design.id}
                              style={{
                                borderRadius: "8px",
                                overflow: "hidden",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDesign(design);
                              }}
                            >
                              <img
                                src={placeholderImage}
                                alt={design.title}
                                style={{
                                  width: "100%",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
