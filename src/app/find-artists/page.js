"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiX,
  FiMapPin,
  FiDollarSign,
  FiStar,
  FiMail,
  FiPhone,
  FiInstagram,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiPlus,
  FiMinus,
  FiCalendar,
  FiHeart,
  FiClock,
  FiUsers,
  FiSend,
  FiAward,
  FiPackage,
} from "react-icons/fi";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import "./FindArtists.css";
import "../globals.css";

export default function FindArtistsPage() {
  // Sample artist data (in a real app, this would come from an API)
  const [artists, setArtists] = useState([
    {
      id: 1,
      name: "Amina Khan",
      location: "New York, NY",
      priceRange: "$$",
      rating: 4.8,
      styles: ["Bridal", "Traditional", "Modern"],
      image: "https://via.placeholder.com/300x400?text=Amina+Khan",
      profileImage: "https://via.placeholder.com/150x150?text=AK",
      description:
        "Specializing in bridal mehndi with over 10 years of experience.",
      portfolio: [
        "https://via.placeholder.com/400x300?text=Bridal+Design+1",
        "https://via.placeholder.com/400x300?text=Bridal+Design+2",
        "https://via.placeholder.com/400x300?text=Bridal+Design+3",
        "https://via.placeholder.com/400x300?text=Bridal+Design+4",
      ],
      contact: {
        email: "amina@example.com",
        phone: "(555) 123-4567",
        instagram: "@aminakhanhenna",
      },
      experience: "10+ years",
      specializations: ["Bridal", "Traditional", "Modern"],
      availability: "Weekends and Weekdays",
      languages: ["English", "Hindi", "Urdu"],
      services: {
        singleHand: {
          name: "Single Hand Design",
          description: "Intricate design covering palm and fingers",
          basePrice: 80,
          complexityMultipliers: {
            simple: 0.6, // $48
            medium: 1, // $80
            complex: 1.5, // $120
          },
          icon: <FiHeart size={24} />,
        },
        bothHands: {
          name: "Both Hands Design",
          description: "Matching designs for both hands",
          basePrice: 150,
          complexityMultipliers: {
            simple: 0.7, // $105
            medium: 1, // $150
            complex: 1.8, // $270
          },
          icon: <FiHeart size={24} />,
        },
        feet: {
          name: "Feet Design",
          description: "Designs for the top of feet",
          basePrice: 120,
          complexityMultipliers: {
            simple: 0.7, // $84
            medium: 1, // $120
            complex: 1.5, // $180
          },
          icon: <FiHeart size={24} />,
        },
        armExtension: {
          name: "Arm Extension",
          description: "Design extending up to elbow or shoulder",
          basePrice: 100,
          complexityMultipliers: {
            simple: 0.6, // $60
            medium: 1, // $100
            complex: 1.7, // $170
          },
          icon: <FiClock size={24} />,
        },
        bridialPackage: {
          name: "Bridal Package",
          description: "Full bridal set with hands, feet, and arms",
          basePrice: 650,
          icon: <FiAward size={24} />,
        },
        partyPackage: {
          name: "Party/Event Package",
          description: "Group discount for 5+ people (per person)",
          basePrice: 70,
          icon: <FiUsers size={24} />,
          minQuantity: 5,
        },
        specialty: {
          name: "Specialty Techniques",
          description: "Includes shading, gems, glitter, or white henna",
          basePrice: 50,
          options: [
            { name: "Shading", price: 50 },
            { name: "White Henna", price: 30 },
            { name: "Gems/Glitter", price: 40 },
            { name: "Custom Elements", price: 60 },
          ],
          icon: <FiPackage size={24} />,
        },
      },
    },

    {
      id: 2,
      name: "Priya Sharma",
      location: "Los Angeles, CA",
      priceRange: "$$$",
      rating: 4.9,
      styles: ["Indo-Arabic", "Contemporary", "Bridal"],
      image: "https://via.placeholder.com/300x400?text=Priya+Sharma",
      profileImage: "https://via.placeholder.com/150x150?text=PS",
      description:
        "Award-winning henna artist with a unique fusion of modern and traditional styles.",
      portfolio: [
        "https://via.placeholder.com/400x300?text=Indo-Arabic+1",
        "https://via.placeholder.com/400x300?text=Indo-Arabic+2",
        "https://via.placeholder.com/400x300?text=Indo-Arabic+3",
        "https://via.placeholder.com/400x300?text=Indo-Arabic+4",
      ],
      contact: {
        email: "priya@example.com",
        phone: "(555) 234-5678",
        instagram: "@priyasharmahenna",
      },
      experience: "8+ years",
      specializations: ["Indo-Arabic", "Contemporary", "Bridal"],
      availability: "Weekends and Weekdays",
      languages: ["English", "Hindi", "Gujarati"],
      services: {
        singleHand: {
          name: "Single Hand Design",
          description: "Intricate design covering palm and fingers",
          basePrice: 120,
          complexityMultipliers: {
            simple: 0.7, // $84
            medium: 1, // $120
            complex: 1.7, // $204
          },
          icon: <FiHeart size={24} />,
        },
        bothHands: {
          name: "Both Hands Design",
          description: "Matching designs for both hands",
          basePrice: 220,
          complexityMultipliers: {
            simple: 0.7, // $154
            medium: 1, // $220
            complex: 1.8, // $396
          },
          icon: <FiHeart size={24} />,
        },
        feet: {
          name: "Feet Design",
          description: "Designs for the top of feet",
          basePrice: 180,
          complexityMultipliers: {
            simple: 0.7, // $126
            medium: 1, // $180
            complex: 1.6, // $288
          },
          icon: <FiHeart size={24} />,
        },
        armExtension: {
          name: "Arm Extension",
          description: "Design extending up to elbow or shoulder",
          basePrice: 150,
          complexityMultipliers: {
            simple: 0.7, // $105
            medium: 1, // $150
            complex: 1.7, // $255
          },
          icon: <FiClock size={24} />,
        },
        bridialPackage: {
          name: "Bridal Package",
          description: "Full bridal set with hands, feet, and arms",
          basePrice: 950,
          icon: <FiAward size={24} />,
        },
        partyPackage: {
          name: "Party/Event Package",
          description: "Group discount for 5+ people (per person)",
          basePrice: 100,
          icon: <FiUsers size={24} />,
          minQuantity: 5,
        },
        specialty: {
          name: "Specialty Techniques",
          description: "Includes shading, gems, glitter, or white henna",
          basePrice: 70,
          options: [
            { name: "Shading", price: 70 },
            { name: "White Henna", price: 50 },
            { name: "Gems/Glitter", price: 60 },
            { name: "Custom Elements", price: 90 },
          ],
          icon: <FiPackage size={24} />,
        },
      },
    },

    {
      id: 3,
      name: "Saima Patel",
      location: "Chicago, IL",
      priceRange: "$",
      rating: 4.6,
      styles: ["Arabic", "Simple", "Kids"],
      image: "https://via.placeholder.com/300x400?text=Saima+Patel",
      profileImage: "https://via.placeholder.com/150x150?text=SP",
      description:
        "Affordable and quick designs perfect for events and children's parties.",
      portfolio: [
        "https://via.placeholder.com/400x300?text=Arabic+Design+1",
        "https://via.placeholder.com/400x300?text=Arabic+Design+2",
        "https://via.placeholder.com/400x300?text=Arabic+Design+3",
        "https://via.placeholder.com/400x300?text=Arabic+Design+4",
      ],
      contact: {
        email: "saima@example.com",
        phone: "(555) 345-6789",
        instagram: "@saimapatelhenna",
      },
      experience: "5+ years",
      specializations: ["Arabic", "Simple", "Kids"],
      availability: "Weekends and Weekdays",
      languages: ["English", "Hindi", "Arabic"],
      services: {
        singleHand: {
          name: "Single Hand Design",
          description: "Simple design covering palm and fingers",
          basePrice: 40,
          complexityMultipliers: {
            simple: 0.8, // $32
            medium: 1, // $40
            complex: 1.3, // $52
          },
          icon: <FiHeart size={24} />,
        },
        bothHands: {
          name: "Both Hands Design",
          description: "Matching designs for both hands",
          basePrice: 70,
          complexityMultipliers: {
            simple: 0.8, // $56
            medium: 1, // $70
            complex: 1.3, // $91
          },
          icon: <FiHeart size={24} />,
        },
        feet: {
          name: "Feet Design",
          description: "Designs for the top of feet",
          basePrice: 60,
          complexityMultipliers: {
            simple: 0.8, // $48
            medium: 1, // $60
            complex: 1.3, // $78
          },
          icon: <FiHeart size={24} />,
        },
        kidsDesign: {
          name: "Kids Design",
          description: "Simple, small designs for children",
          basePrice: 25,
          icon: <FiHeart size={24} />,
        },
        partyPackage: {
          name: "Party/Event Package",
          description: "Group discount for 5+ people (per person)",
          basePrice: 35,
          icon: <FiUsers size={24} />,
          minQuantity: 5,
        },
        specialty: {
          name: "Specialty Techniques",
          description: "Includes gems, glitter, or colors",
          basePrice: 20,
          options: [
            { name: "Color Henna", price: 20 },
            { name: "Glitter", price: 15 },
            { name: "Stickers", price: 10 },
          ],
          icon: <FiPackage size={24} />,
        },
      },
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Pricing calculator states
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState({});
  const [serviceQuantities, setServiceQuantities] = useState({});
  const [selectedComplexity, setSelectedComplexity] = useState({});
  const [selectedSpecialties, setSelectedSpecialties] = useState({});
  const [calculatedQuote, setCalculatedQuote] = useState(null);

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

  // Complexity levels for designs
  const complexityLevels = [
    {
      value: "simple",
      label: "Simple",
      description: "Basic patterns, minimal detail",
    },
    {
      value: "medium",
      label: "Medium",
      description: "Standard design with moderate detail",
    },
    {
      value: "complex",
      label: "Complex",
      description: "Highly detailed intricate work",
    },
  ];

  // Get active filters
  const getActiveFilters = () => {
    const filters = [];
    if (location) filters.push({ type: "location", value: location });
    if (priceRange) filters.push({ type: "priceRange", value: priceRange });
    if (style) filters.push({ type: "style", value: style });
    return filters;
  };

  // Remove single filter
  const removeFilter = (type) => {
    switch (type) {
      case "location":
        setLocation("");
        break;
      case "priceRange":
        setPriceRange("");
        break;
      case "style":
        setStyle("");
        break;
      default:
        break;
    }
  };

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
  const openImageModal = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  // Close image modal
  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  // Open quote modal
  const openQuoteModal = () => {
    // Reset quote state
    setSelectedServices({});
    setServiceQuantities({});
    setSelectedComplexity({});
    setSelectedSpecialties({});
    setCalculatedQuote(null);

    setIsQuoteModalOpen(true);
  };

  // Close quote modal
  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  // Toggle service selection
  const toggleServiceSelection = (serviceKey) => {
    setSelectedServices((prev) => {
      const newSelection = { ...prev };
      if (newSelection[serviceKey]) {
        delete newSelection[serviceKey];

        // Also clean up related states
        setServiceQuantities((prev) => {
          const newQuantities = { ...prev };
          delete newQuantities[serviceKey];
          return newQuantities;
        });

        setSelectedComplexity((prev) => {
          const newComplexity = { ...prev };
          delete newComplexity[serviceKey];
          return newComplexity;
        });
      } else {
        newSelection[serviceKey] = true;

        // Initialize quantity
        setServiceQuantities((prev) => ({
          ...prev,
          [serviceKey]: 1,
        }));

        // Set default complexity for services that have complexity
        if (selectedArtist.services[serviceKey].complexityMultipliers) {
          setSelectedComplexity((prev) => ({
            ...prev,
            [serviceKey]: "medium", // Default to medium complexity
          }));
        }
      }
      return newSelection;
    });
  };

  // Change service quantity
  const changeQuantity = (serviceKey, delta) => {
    setServiceQuantities((prev) => {
      const service = selectedArtist.services[serviceKey];
      const currentQty = prev[serviceKey] || 1;
      const minQty = service.minQuantity || 1;
      const newQty = Math.max(minQty, currentQty + delta);
      return {
        ...prev,
        [serviceKey]: newQty,
      };
    });
  };

  // Change service complexity
  const changeComplexity = (serviceKey, complexity) => {
    setSelectedComplexity((prev) => ({
      ...prev,
      [serviceKey]: complexity,
    }));
  };

  // Toggle specialty selection
  const toggleSpecialty = (serviceKey, optionIndex) => {
    setSelectedSpecialties((prev) => {
      const current = prev[serviceKey] || [];
      const exists = current.includes(optionIndex);

      if (exists) {
        return {
          ...prev,
          [serviceKey]: current.filter((idx) => idx !== optionIndex),
        };
      } else {
        return {
          ...prev,
          [serviceKey]: [...current, optionIndex],
        };
      }
    });
  };

  // Calculate price quote
  const calculateQuote = () => {
    if (!selectedArtist) return;

    let total = 0;
    const quoteBreakdown = [];

    // Process each selected service
    Object.keys(selectedServices).forEach((serviceKey) => {
      const service = selectedArtist.services[serviceKey];
      const quantity = serviceQuantities[serviceKey] || 1;

      // Calculate base price based on complexity if applicable
      let servicePrice = service.basePrice;
      if (service.complexityMultipliers && selectedComplexity[serviceKey]) {
        const multiplier =
          service.complexityMultipliers[selectedComplexity[serviceKey]];
        servicePrice = servicePrice * multiplier;
      }

      // Calculate total for this service
      const serviceTotal = servicePrice * quantity;
      total += serviceTotal;

      // Add to breakdown
      quoteBreakdown.push({
        name: service.name,
        complexity: selectedComplexity[serviceKey] || "N/A",
        quantity,
        unitPrice: servicePrice,
        total: serviceTotal,
      });

      // Add specialty options if any
      if (selectedSpecialties[serviceKey] && service.options) {
        selectedSpecialties[serviceKey].forEach((optionIndex) => {
          const option = service.options[optionIndex];
          total += option.price;

          quoteBreakdown.push({
            name: `- ${option.name} (add-on)`,
            complexity: "N/A",
            quantity: 1,
            unitPrice: option.price,
            total: option.price,
          });
        });
      }
    });

    setCalculatedQuote({
      total,
      breakdown: quoteBreakdown,
    });
  };

  // Navigate to next/previous image in portfolio
  const navigateImage = (direction) => {
    if (!selectedArtist) return;

    const portfolioLength = selectedArtist.portfolio.length;
    let newIndex;

    if (direction === "next") {
      newIndex = (currentImageIndex + 1) % portfolioLength;
    } else {
      newIndex = (currentImageIndex - 1 + portfolioLength) % portfolioLength;
    }

    setCurrentImageIndex(newIndex);
    setSelectedImage(selectedArtist.portfolio[newIndex]);
  };

  // Handle escape key to close modals
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        if (isImageModalOpen) {
          closeImageModal();
        } else if (isQuoteModalOpen) {
          closeQuoteModal();
        } else if (isModalOpen) {
          closeArtistModal();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen, isImageModalOpen, isQuoteModalOpen]);

  // Render star ratings
  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={
              star <= Math.round(rating) ? "star-filled" : "star-empty"
            }
            size={16}
          />
        ))}
        <span className="rating-value">{rating}</span>
      </div>
    );
  };

  // Convert price range to visual indicator
  const renderPriceRange = (range) => {
    switch (range) {
      case "$":
        return (
          <span className="price-indicator">
            <FiDollarSign className="active" /> <FiDollarSign />{" "}
            <FiDollarSign />
          </span>
        );
      case "$$":
        return (
          <span className="price-indicator">
            <FiDollarSign className="active" />{" "}
            <FiDollarSign className="active" /> <FiDollarSign />
          </span>
        );
      case "$$$":
        return (
          <span className="price-indicator">
            <FiDollarSign className="active" />{" "}
            <FiDollarSign className="active" />{" "}
            <FiDollarSign className="active" />
          </span>
        );
      default:
        return <span className="price-indicator">{range}</span>;
    }
  };

  // Render service icons
  const renderServiceIcons = (artist) => {
    return (
      <div className="service-icons">
        {Object.keys(artist.services)
          .slice(0, 5)
          .map((serviceKey) => (
            <div
              key={serviceKey}
              className="service-icon"
              title={artist.services[serviceKey].name}
            >
              {artist.services[serviceKey].icon}
            </div>
          ))}
        {Object.keys(artist.services).length > 5 && (
          <div className="service-icon more-icon">
            +{Object.keys(artist.services).length - 5}
          </div>
        )}
      </div>
    );
  };

  return (
    <main>
      <Navbar />
      <div className="find-artists-container">
        <motion.div
          className="find-artists-hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Find Mehndi Artists
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Discover talented henna artists in your area for your special
            occasions
          </motion.p>
        </motion.div>

        <motion.div
          className="filters-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2>Find Your Perfect Artist</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search artists by name, location, or style..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch />
          </div>

          <div className="filter-dropdowns">
            <div className="filter-group">
              <label>Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
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
                {priceRanges.map((price) => (
                  <option key={price} value={price}>
                    {price}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Style</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)}>
                <option value="">All Styles</option>
                {styles.map((s) => (
                  <option key={s} value={s}>
                    {s}
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
                  {filter.type === "location"
                    ? "Location"
                    : filter.type === "priceRange"
                    ? "Price"
                    : "Style"}
                  : {filter.value}
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
          className="artists-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <AnimatePresence>
            {filteredArtists.length > 0 ? (
              filteredArtists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  className="artist-card"
                  onClick={() => openArtistModal(artist)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: (0.1 * index) % 5 },
                  }}
                  exit={{ opacity: 0, y: 20 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="artist-image">
                    <img src={artist.image} alt={artist.name} />
                    <div className="price-badge">
                      {renderPriceRange(artist.priceRange)}
                    </div>
                  </div>
                  <div className="artist-info">
                    <h3>{artist.name}</h3>
                    <p className="location">
                      <FiMapPin size={14} /> {artist.location}
                    </p>
                    <div className="rating-container">
                      {renderStars(artist.rating)}
                    </div>
                    {renderServiceIcons(artist)}
                    <div className="styles">
                      {artist.styles.map((style) => (
                        <span key={style} className="style-tag">
                          {style}
                        </span>
                      ))}
                    </div>
                    <p className="artist-description">{artist.description}</p>
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
                <h3>No artists match your filters</h3>
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
          {isModalOpen && selectedArtist && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeArtistModal}
            >
              <motion.div
                className="modal-content artist-modal"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-modal" onClick={closeArtistModal}>
                  <FiX />
                </button>

                <div className="artist-profile">
                  <div className="profile-header">
                    <div className="profile-header-top">
                      <img
                        src={selectedArtist.profileImage}
                        alt={selectedArtist.name}
                        className="profile-image"
                      />
                      <div className="profile-info">
                        <h2>{selectedArtist.name}</h2>
                        <p className="location">
                          <FiMapPin size={16} /> {selectedArtist.location}
                        </p>
                        <div className="rating-container">
                          {renderStars(selectedArtist.rating)}
                        </div>
                        <div className="price-range">
                          {renderPriceRange(selectedArtist.priceRange)}
                        </div>
                      </div>
                    </div>

                    <div className="profile-cta">
                      <button
                        className="get-quote-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openQuoteModal();
                        }}
                      >
                        <FiDollarSign size={16} /> Get Price Quote
                      </button>
                      <Link
                        href={`/book-appointment?artist=${selectedArtist.id}`}
                        className="book-appointment-btn"
                      >
                        <FiCalendar size={16} /> Book Appointment
                      </Link>
                    </div>
                  </div>

                  <div className="profile-details">
                    <p className="description">{selectedArtist.description}</p>

                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="label">Experience:</span>
                        <span>{selectedArtist.experience}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Availability:</span>
                        <span>{selectedArtist.availability}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Languages:</span>
                        <span>{selectedArtist.languages.join(", ")}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Specializations:</span>
                        <span>{selectedArtist.specializations.join(", ")}</span>
                      </div>
                    </div>

                    <div className="services-section">
                      <h3>Services Offered</h3>
                      <div className="services-grid">
                        {Object.keys(selectedArtist.services).map(
                          (serviceKey) => {
                            const service = selectedArtist.services[serviceKey];
                            return (
                              <div key={serviceKey} className="service-item">
                                <div className="service-icon-large">
                                  {service.icon}
                                </div>
                                <div className="service-details">
                                  <h4>{service.name}</h4>
                                  <p>{service.description}</p>
                                  {service.complexityMultipliers ? (
                                    <div className="service-pricing">
                                      <span className="price-range">
                                        $
                                        {(
                                          service.basePrice *
                                          service.complexityMultipliers.simple
                                        ).toFixed(0)}{" "}
                                        - $
                                        {(
                                          service.basePrice *
                                          service.complexityMultipliers.complex
                                        ).toFixed(0)}
                                      </span>
                                      <span className="pricing-note">
                                        Depending on complexity
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="service-pricing">
                                      <span className="price">
                                        ${service.basePrice}
                                      </span>
                                      {service.minQuantity && (
                                        <span className="pricing-note">
                                          Min. {service.minQuantity} people
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>

                    <div className="contact-section">
                      <h3>Contact Information</h3>
                      <div className="contact-details">
                        <a
                          href={`mailto:${selectedArtist.contact.email}`}
                          className="contact-link"
                        >
                          <FiMail size={18} /> {selectedArtist.contact.email}
                        </a>
                        <a
                          href={`tel:${selectedArtist.contact.phone}`}
                          className="contact-link"
                        >
                          <FiPhone size={18} /> {selectedArtist.contact.phone}
                        </a>
                        <a
                          href={`https://instagram.com/${selectedArtist.contact.instagram.substring(
                            1
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-link"
                        >
                          <FiInstagram size={18} />{" "}
                          {selectedArtist.contact.instagram}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="portfolio-section">
                    <h3>Portfolio</h3>
                    <div className="portfolio-grid">
                      {selectedArtist.portfolio.map((image, index) => (
                        <motion.div
                          key={index}
                          className="portfolio-item"
                          onClick={() => openImageModal(image, index)}
                          whileHover={{ scale: 1.05 }}
                        >
                          <img src={image} alt={`Portfolio ${index + 1}`} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isImageModalOpen && selectedImage && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeImageModal}
            >
              <motion.div
                className="modal-content image-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-modal" onClick={closeImageModal}>
                  <FiX />
                </button>

                <div className="image-navigation">
                  <button
                    className="nav-button prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage("prev");
                    }}
                  >
                    <FiChevronLeft size={24} />
                  </button>

                  <div className="image-container">
                    <img src={selectedImage} alt="Portfolio" />
                  </div>

                  <button
                    className="nav-button next"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage("next");
                    }}
                  >
                    <FiChevronRight size={24} />
                  </button>
                </div>

                <div className="image-counter">
                  {selectedArtist &&
                    `${currentImageIndex + 1} / ${
                      selectedArtist.portfolio.length
                    }`}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isQuoteModalOpen && selectedArtist && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeQuoteModal}
            >
              <motion.div
                className="modal-content quote-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-modal" onClick={closeQuoteModal}>
                  <FiX />
                </button>

                <div className="quote-builder">
                  <div className="quote-header">
                    <h2>Custom Price Quote</h2>
                    <p>
                      Select services from {selectedArtist.name} to get a
                      personalized price estimate
                    </p>
                  </div>

                  <div className="quote-content">
                    <div className="services-selection">
                      <h3>Select Services</h3>

                      {Object.keys(selectedArtist.services).map(
                        (serviceKey) => {
                          const service = selectedArtist.services[serviceKey];
                          const isSelected = !!selectedServices[serviceKey];
                          const quantity = serviceQuantities[serviceKey] || 1;

                          return (
                            <div
                              key={serviceKey}
                              className={`service-selection-item ${
                                isSelected ? "selected" : ""
                              }`}
                            >
                              <div className="service-selection-header">
                                <div
                                  className="service-check"
                                  onClick={() =>
                                    toggleServiceSelection(serviceKey)
                                  }
                                >
                                  <div className="checkbox">
                                    {isSelected && <FiCheck size={16} />}
                                  </div>
                                  <div className="service-name">
                                    <span>{service.icon}</span>
                                    <h4>{service.name}</h4>
                                  </div>
                                </div>

                                {isSelected && service.minQuantity && (
                                  <div className="quantity-selector">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        changeQuantity(serviceKey, -1);
                                      }}
                                      disabled={
                                        quantity <= (service.minQuantity || 1)
                                      }
                                    >
                                      <FiMinus size={14} />
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        changeQuantity(serviceKey, 1);
                                      }}
                                    >
                                      <FiPlus size={14} />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {isSelected && (
                                <div className="service-selection-details">
                                  {service.complexityMultipliers && (
                                    <div className="complexity-selector">
                                      <label>Complexity Level:</label>
                                      <div className="complexity-options">
                                        {complexityLevels.map((level) => (
                                          <div
                                            key={level.value}
                                            className={`complexity-option ${
                                              selectedComplexity[serviceKey] ===
                                              level.value
                                                ? "selected"
                                                : ""
                                            }`}
                                            onClick={() =>
                                              changeComplexity(
                                                serviceKey,
                                                level.value
                                              )
                                            }
                                          >
                                            <span className="complexity-name">
                                              {level.label}
                                            </span>
                                            <span className="complexity-price">
                                              $
                                              {(
                                                service.basePrice *
                                                service.complexityMultipliers[
                                                  level.value
                                                ]
                                              ).toFixed(0)}
                                            </span>
                                            <p className="complexity-desc">
                                              {level.description}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {service.options && (
                                    <div className="specialty-selector">
                                      <label>Add Specialty Techniques:</label>
                                      <div className="specialty-options">
                                        {service.options.map(
                                          (option, index) => {
                                            const isOptionSelected =
                                              selectedSpecialties[
                                                serviceKey
                                              ]?.includes(index);
                                            return (
                                              <div
                                                key={index}
                                                className={`specialty-option ${
                                                  isOptionSelected
                                                    ? "selected"
                                                    : ""
                                                }`}
                                                onClick={() =>
                                                  toggleSpecialty(
                                                    serviceKey,
                                                    index
                                                  )
                                                }
                                              >
                                                <div className="specialty-checkbox">
                                                  {isOptionSelected && (
                                                    <FiCheck size={12} />
                                                  )}
                                                </div>
                                                <div className="specialty-details">
                                                  <span className="specialty-name">
                                                    {option.name}
                                                  </span>
                                                  <span className="specialty-price">
                                                    +${option.price}
                                                  </span>
                                                </div>
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>

                    <div className="quote-actions">
                      <button
                        className="calculate-quote-btn"
                        onClick={calculateQuote}
                        disabled={Object.keys(selectedServices).length === 0}
                      >
                        Calculate Price Quote
                      </button>
                    </div>
                    {calculatedQuote && (
                      <motion.div
                        className="quote-result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h3>Your Custom Quote</h3>

                        <div className="quote-breakdown">
                          {calculatedQuote.breakdown.map((item, index) => (
                            <div key={index} className="breakdown-item">
                              <div className="breakdown-details">
                                <span className="breakdown-name">
                                  {item.name}
                                  {item.complexity !== "N/A" &&
                                    ` (${item.complexity})`}
                                  {item.quantity > 1 && ` × ${item.quantity}`}
                                </span>
                                <span className="breakdown-price">
                                  ${item.total.toFixed(2)}
                                </span>
                              </div>
                              {item.quantity > 1 && (
                                <div className="unit-price">
                                  ${item.unitPrice.toFixed(2)} each
                                </div>
                              )}
                            </div>
                          ))}

                          <div className="quote-total">
                            <span>Estimated Total</span>
                            <span>${calculatedQuote.total.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="quote-notes">
                          <p>
                            * This is an estimate based on the selected
                            services. Final pricing may vary based on specific
                            requirements and consultation.
                          </p>
                          <p>
                            * Travel fees and any additional services requested
                            on-site may incur extra charges.
                          </p>
                        </div>

                        <div className="quote-contact">
                          <Link
                            href={`/contact?artist=${
                              selectedArtist.id
                            }&quote=${calculatedQuote.total.toFixed(2)}`}
                            className="contact-about-quote-btn"
                          >
                            <FiSend size={16} /> Contact About This Quote
                          </Link>
                        </div>
                      </motion.div>
                    )}
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
