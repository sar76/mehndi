import React, { useState, useEffect } from "react";
import "./ExploreDesigns.css";
import "../../App.css";

function ExploreDesigns() {
  // Sample design data (replace with your actual designs later)
  // You can uncomment and update the image paths as you add images to your project
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
      // image: "/images/designs/traditional-bridal.jpg", // Add your image path when available
      // detailImages: [
      //   "/images/designs/traditional-bridal-1.jpg",
      //   "/images/designs/traditional-bridal-2.jpg",
      //   "/images/designs/traditional-bridal-3.jpg",
      // ],
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
      // image: "/images/designs/arabic-floral.jpg", // Add your image path when available
      // detailImages: [
      //   "/images/designs/arabic-floral-1.jpg",
      //   "/images/designs/arabic-floral-2.jpg",
      //   "/images/designs/arabic-floral-3.jpg",
      // ],
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
      // image: "/images/designs/minimalist-modern.jpg", // Add your image path when available
      // detailImages: [
      //   "/images/designs/minimalist-modern-1.jpg",
      //   "/images/designs/minimalist-modern-2.jpg",
      //   "/images/designs/minimalist-modern-3.jpg",
      // ],
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
      // image: "/images/designs/rajasthani-marwari.jpg", // Add your image path when available
      // detailImages: [
      //   "/images/designs/rajasthani-marwari-1.jpg",
      //   "/images/designs/rajasthani-marwari-2.jpg",
      //   "/images/designs/rajasthani-marwari-3.jpg",
      // ],
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
      // image: "/images/designs/indo-arabic-fusion.jpg", // Add your image path when available
      // detailImages: [
      //   "/images/designs/indo-arabic-fusion-1.jpg",
      //   "/images/designs/indo-arabic-fusion-2.jpg",
      //   "/images/designs/indo-arabic-fusion-3.jpg",
      // ],
    },
  ]);

  // Filter states
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [occasion, setOccasion] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDesigns, setFilteredDesigns] = useState(designs);

  // Modal state
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
    setActiveImageIndex(0);
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  // Close design modal
  const closeDesignModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  // Change active image in the modal
  const changeImage = (index) => {
    setActiveImageIndex(index);
  };

  // Placeholder image for missing images
  const placeholderImage =
    "https://via.placeholder.com/500x500?text=Mehndi+Design";

  return (
    <div className="explore-designs-container">
      <div className="explore-designs-hero">
        {/* Note: Add a banner image at /images/mehndi-designs-banner.jpg for this background */}
        <h1>Explore Mehndi Designs</h1>
        <p>
          Discover beautiful henna designs from various traditions and learn
          about their cultural significance
        </p>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search designs by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search"></i>
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
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
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
              <option value="">All Difficulty Levels</option>
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

          <button className="reset-button" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      {filteredDesigns.length === 0 ? (
        <div className="no-results">
          <i className="fas fa-exclamation-circle"></i>
          <h3>No designs found matching your criteria</h3>
          <p>Try adjusting your filters or search term</p>
          <button className="reset-button" onClick={resetFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="designs-grid">
          {filteredDesigns.map((design) => (
            <div
              className="design-card"
              key={design.id}
              onClick={() => openDesignModal(design)}
            >
              <div className="design-image">
                <img
                  src={design.image || placeholderImage}
                  alt={design.title}
                />
                <div className="design-overlay">
                  <div className="design-category">{design.category}</div>
                  <div className="design-difficulty">{design.difficulty}</div>
                </div>
              </div>
              <div className="design-info">
                <h3>{design.title}</h3>
                <p className="design-region">{design.region}</p>
                <p className="design-occasion">{design.occasion}</p>
                <p className="design-preview">
                  {design.description.substring(0, 100)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Design Detail Modal */}
      {isModalOpen && selectedDesign && (
        <div className="modal-overlay" onClick={closeDesignModal}>
          <div className="design-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeDesignModal}>
              <i className="fas fa-times"></i>
            </button>

            <div className="design-modal-content">
              <div className="design-gallery">
                <div className="main-image">
                  <img
                    src={selectedDesign.image || placeholderImage}
                    alt={selectedDesign.title}
                  />
                </div>

                {/* Thumbnail gallery - will be displayed when you add detail images */}
                {/* Uncomment this section once you have detail images:
                {selectedDesign.detailImages && selectedDesign.detailImages.length > 0 && (
                  <div className="thumbnail-row">
                    {selectedDesign.detailImages.map((img, index) => (
                      <div 
                        className={`thumbnail ${activeImageIndex === index ? 'active' : ''}`} 
                        key={index}
                        onClick={() => changeImage(index)}
                      >
                        <img src={img} alt={`${selectedDesign.title} detail ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
                */}
              </div>

              <div className="design-details">
                <h2>{selectedDesign.title}</h2>

                <div className="design-meta">
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">
                      {selectedDesign.category}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Region:</span>
                    <span className="meta-value">{selectedDesign.region}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Difficulty:</span>
                    <span className="meta-value">
                      {selectedDesign.difficulty}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Occasion:</span>
                    <span className="meta-value">
                      {selectedDesign.occasion}
                    </span>
                  </div>
                </div>

                <div className="design-description">
                  <h3>Description</h3>
                  <p>{selectedDesign.description}</p>
                </div>

                <div className="cultural-significance">
                  <h3>Cultural Significance</h3>
                  <p>{selectedDesign.culturalSignificance}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExploreDesigns;
