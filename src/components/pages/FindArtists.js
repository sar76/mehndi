import React, { useState, useEffect } from "react";
import "./FindArtists.css";
import "../../App.css";

function FindArtists() {
  // Sample artist data (in a real app, this would come from an API)
  // You can uncomment and update this as you add images to your project
  const [artists, setArtists] = useState([
    {
      id: 1,
      name: "Amina Khan",
      location: "New York, NY",
      priceRange: "$$",
      rating: 4.8,
      styles: ["Bridal", "Traditional", "Modern"],
      // image: "/images/artist1.jpg", // Add your image path when available
      // profileImage: "/images/profile1.jpg", // Add your image path when available
      description:
        "Specializing in bridal mehndi with over 10 years of experience.",
      portfolio: [
        // "/images/portfolio1-1.jpg", // Add your image paths when available
        // "/images/portfolio1-2.jpg",
        // "/images/portfolio1-3.jpg",
        // "/images/portfolio1-4.jpg",
      ],
    },
    {
      id: 2,
      name: "Priya Sharma",
      location: "Los Angeles, CA",
      priceRange: "$$$",
      rating: 4.9,
      styles: ["Indo-Arabic", "Contemporary", "Bridal"],
      // image: "/images/artist2.jpg", // Add your image path when available
      // profileImage: "/images/profile2.jpg", // Add your image path when available
      description:
        "Award-winning henna artist with a unique fusion of modern and traditional styles.",
      portfolio: [
        // "/images/portfolio2-1.jpg", // Add your image paths when available
        // "/images/portfolio2-2.jpg",
        // "/images/portfolio2-3.jpg",
        // "/images/portfolio2-4.jpg",
      ],
    },
    {
      id: 3,
      name: "Saima Patel",
      location: "Chicago, IL",
      priceRange: "$",
      rating: 4.6,
      styles: ["Arabic", "Simple", "Kids"],
      // image: "/images/artist3.jpg", // Add your image path when available
      // profileImage: "/images/profile3.jpg", // Add your image path when available
      description:
        "Affordable and quick designs perfect for events and children's parties.",
      portfolio: [
        // "/images/portfolio3-1.jpg", // Add your image paths when available
        // "/images/portfolio3-2.jpg",
        // "/images/portfolio3-3.jpg",
        // "/images/portfolio3-4.jpg",
      ],
    },
  ]);

  // Filter states
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [style, setStyle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArtists, setFilteredArtists] = useState(artists);

  // Modal states
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Locations, price ranges, and styles for filter dropdowns
  const locations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Miami, FL",
    "Houston, TX",
    "Atlanta, GA",
  ];
  const priceRanges = ["$", "$$", "$$$"];
  const styles = [
    "Bridal",
    "Traditional",
    "Modern",
    "Arabic",
    "Indo-Arabic",
    "Contemporary",
    "Simple",
    "Kids",
    "Moroccan",
    "Gulf",
    "Minimalist",
    "Pakistani",
    "Luxury",
    "Indo-Western",
    "Events",
  ];

  // Apply filters when they change
  useEffect(() => {
    let result = artists;

    if (location) {
      result = result.filter((artist) => artist.location === location);
    }

    if (priceRange) {
      result = result.filter((artist) => artist.priceRange === priceRange);
    }

    if (style) {
      result = result.filter((artist) => artist.styles.includes(style));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (artist) =>
          artist.name.toLowerCase().includes(term) ||
          artist.location.toLowerCase().includes(term) ||
          artist.description.toLowerCase().includes(term) ||
          artist.styles.some((s) => s.toLowerCase().includes(term))
      );
    }

    setFilteredArtists(result);
  }, [location, priceRange, style, searchTerm, artists]);

  // Reset all filters
  const resetFilters = () => {
    setLocation("");
    setPriceRange("");
    setStyle("");
    setSearchTerm("");
  };

  // Open artist modal
  const openArtistModal = (artist) => {
    setSelectedArtist(artist);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  // Close artist modal
  const closeArtistModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  // Open image modal
  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  // Close image modal
  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star-${i}`} className="fas fa-star"></i>);
    }

    if (halfStar) {
      stars.push(<i key="half-star" className="fas fa-star-half-alt"></i>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  // Placeholder image for missing images
  const placeholderImage =
    "https://via.placeholder.com/300x400?text=Mehndi+Artist";

  return (
    <div className="find-artists-container">
      <div className="find-artists-hero">
        <h1>Find Mehndi Artists</h1>
        <p>
          Discover talented henna artists in your area for your special
          occasions
        </p>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search artists by name, location, or style..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search"></i>
        </div>

        <div className="filter-dropdowns">
          <div className="filter-group">
            <label>Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((loc, index) => (
                <option key={index} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="">All Prices</option>
              {priceRanges.map((price, index) => (
                <option key={index} value={price}>
                  {price}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Style</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="">All Styles</option>
              {styles.map((s, index) => (
                <option key={index} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <button className="reset-button" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      {filteredArtists.length === 0 ? (
        <div className="no-results">
          <i className="fas fa-exclamation-circle"></i>
          <h3>No artists found matching your criteria</h3>
          <p>Try adjusting your filters or search term</p>
          <button className="reset-button" onClick={resetFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="artists-grid">
          {filteredArtists.map((artist) => (
            <div
              className="artist-card"
              key={artist.id}
              onClick={() => openArtistModal(artist)}
            >
              <div className="artist-image">
                <img src={artist.image || placeholderImage} alt={artist.name} />
              </div>
              <div className="artist-info">
                <h3>{artist.name}</h3>
                <p className="artist-location">
                  <i className="fas fa-map-marker-alt"></i> {artist.location}
                </p>
                <div className="artist-rating">
                  {renderStars(artist.rating)}
                  <span>{artist.rating.toFixed(1)}</span>
                </div>
                <p className="artist-price">{artist.priceRange}</p>
                <div className="artist-styles">
                  {artist.styles.slice(0, 3).map((s, index) => (
                    <span key={index} className="style-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Artist Detail Modal */}
      {isModalOpen && selectedArtist && (
        <div className="modal-overlay" onClick={closeArtistModal}>
          <div className="artist-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeArtistModal}>
              <i className="fas fa-times"></i>
            </button>

            <div className="artist-modal-header">
              <div className="artist-profile-image">
                <img
                  src={
                    selectedArtist.profileImage ||
                    selectedArtist.image ||
                    placeholderImage
                  }
                  alt={selectedArtist.name}
                />
              </div>
              <div className="artist-modal-info">
                <h2>{selectedArtist.name}</h2>
                <p className="artist-location">
                  <i className="fas fa-map-marker-alt"></i>{" "}
                  {selectedArtist.location}
                </p>
                <div className="artist-rating">
                  {renderStars(selectedArtist.rating)}
                  <span>{selectedArtist.rating.toFixed(1)}</span>
                </div>
                <p className="artist-price">{selectedArtist.priceRange}</p>
                <div className="artist-styles-full">
                  {selectedArtist.styles.map((s, index) => (
                    <span key={index} className="style-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="artist-description">
              <h3>About the Artist</h3>
              <p>{selectedArtist.description}</p>
            </div>

            {/* Portfolio section - will be populated when you add images */}
            {selectedArtist.portfolio &&
              selectedArtist.portfolio.length > 0 && (
                <div className="artist-portfolio">
                  <h3>Portfolio</h3>
                  <div className="portfolio-grid">
                    {selectedArtist.portfolio.map((image, index) => (
                      <div
                        className="portfolio-item"
                        key={index}
                        onClick={() => openImageModal(image)}
                      >
                        <img
                          src={image || placeholderImage}
                          alt={`Portfolio item ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="artist-contact">
              <button className="contact-button">
                <i className="fas fa-envelope"></i> Contact Artist
              </button>
              <button className="booking-button">
                <i className="fas fa-calendar-check"></i> Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Expansion Modal */}
      {isImageModalOpen && selectedImage && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal">
            <button className="close-image-modal" onClick={closeImageModal}>
              <i className="fas fa-times"></i>
            </button>
            <img src={selectedImage} alt="Expanded portfolio item" />
          </div>
        </div>
      )}
    </div>
  );
}

export default FindArtists;
