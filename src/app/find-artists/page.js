"use client";

import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiX,
  FiMapPin,
  FiDollarSign,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiPlus,
  FiMinus,
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
import { db } from "../../lib/firebase"; // Import your Firebase config
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default function FindArtistsPage() {
  // State for artists

  const serviceNameMapping = {
    singleHandDesign: "Single Hand Design",
    bothHandsDesign: "Both Hands Design",
    feetDesign: "Feet Design",
    armExtension: "Arm Extension",
    bridalPackage: "Bridal Package",
    partyEventPackage: "Party/Event Package",
    specialtyTechniques: "Specialty Techniques"
  };

  const serviceDescriptionMapping = {
    singleHandDesign: "Intricate design covering palm and fingers",
    bothHandsDesign: "Matching designs for both hands",
    feetDesign: "Designs for the top of feet",
    armExtension: "Design extending up to elbow or shoulder",
    bridalPackage: "Full bridal set with hands, feet, and arms",
    partyEventPackage: "Group discount for 5+ people (per person)",
    specialtyTechniques: "Includes shading, gems, glitter, or white henna"
  };

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch artists from Firestore based on filter criteria
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);

        // Get reference to the artists collection
        const artistsCollectionRef = collection(db, "artists");

        // Convert the query snapshot to an array of artist data
        const querySnapshot = await getDocs(artistsCollectionRef);

        // Create an array to hold the formatted artist data
        const artistsData = [];

        // Process each document
        querySnapshot.forEach((doc) => {
          const artistData = doc.data();

          // Format services data - in real app, you'd store this in Firestore too
          // This is just a placeholder for the demo
          const servicesData = {
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
          };

          const raw = artistData.portfolio || [
            /* same 4 placeholders you had before */
          ];

          const portfolioItems = [];
          for (let i = 0; i < raw.length; i += 4) {
            portfolioItems.push({
              image: raw[i],
              title: raw[i + 1],
              description: raw[i + 2],
              date: raw[i + 3],
            });
          }

          // Create the artist object with the structure needed for the component
          const formattedArtist = {
            id: doc.id,
            name: `${artistData.fname} ${artistData.lname}`,
            location: `${artistData.city}, ${artistData.country}`,
            rating: artistData.rating,
            styles: artistData.styles,
            image: artistData.imageURL,
            description: artistData.bio,
            portfolio: portfolioItems,
            experience: artistData.yearsexperience,
            styles: artistData.styles,
            availability: artistData.availability,
            languages: artistData.languages,
            services: {
              singleHandDesign: {
                enabled: artistData.serviceOffered.includes("Single Hand Design"),
                minPrice: artistData.SH_price_min
              },
              bothHandsDesign: {
                enabled: artistData.serviceOffered.includes("Both Hands Design"),
                minPrice: artistData.BH_price_min
              },
              feetDesign: {
                enabled: artistData.serviceOffered.includes("Feet Design"),
                minPrice: artistData.FD_price_min
              },
              armExtension: {
                enabled: artistData.serviceOffered.includes("Arm Extension"),
                minPrice: artistData.AE_price_min
              },
              bridalPackage: {
                enabled: artistData.serviceOffered.includes("Bridal Package"),
                minPrice: artistData.BP_price_min
              },
              partyEventPackage: {
                enabled: artistData.serviceOffered.includes("Party/Event Package"),
                minPrice: artistData.party_per_person
              },
              specialtyTechniques: {
                enabled: artistData.serviceOffered.includes("Specialty Techniques"),
                minPrice: artistData.ST_price_min
              }
            }
          };

          artistsData.push(formattedArtist);
        });

        setArtists(artistsData);
      } catch (error) {
        console.error("Error fetching artists data:", error);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  // Filter states
  const [location, setLocation] = useState("");
  const [style, setStyle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);

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
    "Lahore, Pakistan",
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Miami, FL",
    "Houston, TX",
    "Atlanta, GA",
  ];
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

  // Function to fetch artists with filters applied
  const fetchFilteredArtists = async () => {
    try {
      setLoading(true);

      // Get reference to the artists collection
      const artistsCollectionRef = collection(db, "artists");

      // Create a query with filters
      let artistsQuery = artistsCollectionRef;

      // In a real application, you would apply Firestore filters here
      // For example:
      // if (location) {
      //   const [city, country] = location.split(", ");
      //   artistsQuery = query(artistsQuery, where("city", "==", city));
      // }

      // if (style) {
      //   artistsQuery = query(artistsQuery, where("styles", "array-contains", style));
      // }

      // Note: Price range filtering might need to be done client-side
      // unless you have a specific field for it

      // Execute the query
      const querySnapshot = await getDocs(artistsQuery);

      // Process results
      const artistsData = [];

      querySnapshot.forEach((doc) => {
        const artistData = doc.data();

        // Skip if doesn't match our filters (this would be done in the query in a real app)
        if (location && `${artistData.city}, ${artistData.country}` !== location) return;

        // Services data preparation (would be in Firestore in a real app)
        const servicesData = {
          singleHand: {
            name: "Single Hand Design",
            description: "Intricate design covering palm and fingers",
            basePrice: 80,
            complexityMultipliers: {
              simple: 0.6,
              medium: 1,
              complex: 1.5,
            },
            icon: <FiHeart size={24} />,
          },
          bothHands: {
            name: "Both Hands Design",
            description: "Matching designs for both hands",
            basePrice: 150,
            complexityMultipliers: {
              simple: 0.7,
              medium: 1,
              complex: 1.8,
            },
            icon: <FiHeart size={24} />,
          },
          feet: {
            name: "Feet Design",
            description: "Designs for the top of feet",
            basePrice: 120,
            complexityMultipliers: {
              simple: 0.7,
              medium: 1,
              complex: 1.5,
            },
            icon: <FiHeart size={24} />,
          },
          armExtension: {
            name: "Arm Extension",
            description: "Design extending up to elbow or shoulder",
            basePrice: 100,
            complexityMultipliers: {
              simple: 0.6,
              medium: 1,
              complex: 1.7,
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
        };

        // right after you pull `artistData` out of doc.data():
        const raw = artistData.portfolio || [
          /* same 4 placeholders you had before */
        ];

        const portfolioItems = [];
        for (let i = 0; i < raw.length; i += 4) {
          portfolioItems.push({
            image: raw[i],
            title: raw[i + 1],
            description: raw[i + 2],
            date: raw[i + 3],
          });
        }
        // Create the formatted artist object
        const formattedArtist = {
          id: doc.id,
          name: `${artistData.fname} ${artistData.lname}`,
          location: `${artistData.city}, ${artistData.country}`,
          rating: artistData.rating,
          styles: artistData.styles,
          image: artistData.imageURL,
          profileImage: artistData.profileImage,
          description: artistData.bio,
          portfolio: portfolioItems,
          experience: artistData.yearsexperience,
          styles: artistData.styles,
          availability: artistData.availability,
          languages: artistData.languages,
          services: {
            singleHandDesign: {
              enabled: artistData.serviceOffered.includes("singleHandDesign"),
              minPrice: artistData.SH_price_min
            },
            bothHandsDesign: {
              enabled: artistData.serviceOffered.includes("bothHandsDesign"),
              minPrice: artistData.BH_price_min
            },
            feetDesign: {
              enabled: artistData.serviceOffered.includes("feetDesign"),
              minPrice: artistData.FD_price_min
            },
            armExtension: {
              enabled: artistData.serviceOffered.includes("armExtension"),
              minPrice: artistData.AE_price_min
            },
            bridalPackage: {
              enabled: artistData.serviceOffered.includes("bridalPackage"),
              minPrice: artistData.BP_price_min
            },
            partyEventPackage: {
              enabled: artistData.serviceOffered.includes("partyEventPackage"),
              minPrice: artistData.party_per_person
            },
            specialtyTechniques: {
              enabled: artistData.serviceOffered.includes("specialtyTechniques"),
              minPrice: artistData.ST_price_min
            }
          }
        };

        // Skip if it doesn't match the style filter (would be in the query in a real app)
        if (style && !formattedArtist.styles.includes(style)) return;


        // Skip if it doesn't match the search term
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          if (!(
            formattedArtist.name.toLowerCase().includes(term) ||
            formattedArtist.location.toLowerCase().includes(term) ||
            formattedArtist.description.toLowerCase().includes(term) ||
            formattedArtist.styles.some((s) => s.toLowerCase().includes(term))
          )) {
            return;
          }
        }

        artistsData.push(formattedArtist);
      });

      setArtists(artistsData);
      setFilteredArtists(artistsData);
    } catch (error) {
      console.error("Error fetching filtered artists:", error);
      setArtists([]);
      setFilteredArtists([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when they change
  useEffect(() => {
    fetchFilteredArtists();
  }, [location, style, searchTerm]);

  // Get active filters
  const getActiveFilters = () => {
    const filters = [];
    if (location) filters.push({ type: "location", value: location });
    if (style) filters.push({ type: "style", value: style });
    return filters;
  };

  // Remove single filter
  const removeFilter = (type) => {
    switch (type) {
      case "location":
        setLocation("");
        break;
      case "style":
        setStyle("");
        break;
      default:
        break;
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setLocation("");
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
  const openImageModal = (item, index) => {
    setSelectedImage(item.image);
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
  // Calculate price quote
  const calculateQuote = () => {
    if (!selectedArtist) return;

    let total = 0;
    const quoteBreakdown = [];

    // Process each selected service
    Object.keys(selectedServices).forEach((serviceKey) => {
      const service = selectedArtist.services[serviceKey];
      const quantity = serviceQuantities[serviceKey] || 1;
      const servicePrice = service.minPrice;  // Use the base price from the database

      // Calculate total for this service
      const serviceTotal = servicePrice * quantity;
      total += serviceTotal;

      // Add to breakdown
      quoteBreakdown.push({
        name: serviceNameMapping[serviceKey] || serviceKey,
        quantity,
        unitPrice: servicePrice,
        total: serviceTotal,
      });
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
    setSelectedImage(selectedArtist.portfolio[newIndex].image);
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
  }; // Added the closing brace and semicolon here

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
        <div className="find-artists-hero">
          <h1>Find Mehndi Artists</h1>
          <p>
            Discover talented henna artists in your area for your special
            occasions
          </p>
        </div>

        <div className="filters-container">
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
            <div className="active-filters">
              {getActiveFilters().map((filter, index) => (
                <div key={index} className="active-filter">
                  {filter.type === "location" ? "Location" : "Style"}: {filter.value}
                  <span onClick={() => removeFilter(filter.type)}> ×</span>
                </div>
              ))}
            </div>
          )}

          <button className="reset-filters" onClick={resetFilters}>
            Reset All Filters
          </button>
        </div>

        <div className="artists-grid">
          {loading ? (
            <div className="loading-indicator"
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "50px",
              }}
            >
              <h3>Loading artists...</h3>
            </div>
          ) : filteredArtists.length > 0 ? (
            filteredArtists.map((artist) => (
              <div
                key={artist.id}
                className="artist-card"
                onClick={() => openArtistModal(artist)}
              >
                <div className="artist-image">
                  <img src={artist.image} alt={artist.name} />
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
              </div>
            ))
          ) : (
            <div
              className="no-results"
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "50px",
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
            </div>
          )}
        </div>

        {isModalOpen && selectedArtist && (
          <div className="modal-overlay" onClick={closeArtistModal}>
            <div
              className="modal-content artist-modal"
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
                  </div>
                </div>

                <div className="profile-details">
                  <p className="description">{selectedArtist.description}</p>

                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="label">Experience:</span>
                      <span>{selectedArtist.experience} years</span>
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
                      <span>{selectedArtist.styles.join(", ")}</span>
                    </div>
                  </div>

                  <div className="services-section">
                    <h3>Services Offered</h3>
                    <div className="services-grid">
                      {Object.keys(selectedArtist.services)
                        .filter(serviceKey => selectedArtist.services[serviceKey].enabled)
                        .map(serviceKey => {
                          const service = selectedArtist.services[serviceKey];
                          return (
                            <div key={serviceKey} className="service-item">
                              <div className="service-details">
                                <h4>{serviceNameMapping[serviceKey] || serviceKey}</h4>
                                <p>{serviceDescriptionMapping[serviceKey] || ""}</p>
                                <div className="service-pricing">
                                  <span className="price">${service.minPrice}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                </div>

                <div className="portfolio-section">
                  <h3>Portfolio</h3>
                  <div className="portfolio-grid">
                    {selectedArtist.portfolio.map((item, index) => (
                      <div
                        key={index}
                        className="portfolio-item"
                        onClick={() => openImageModal(item, index)}
                      >
                        <img src={item.image} alt={item.title} />
                        <div className="portfolio-info">
                          <h4>{item.title}</h4>
                          <p>{item.description}</p>
                          <span className="portfolio-date">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isImageModalOpen && selectedImage && (
          <div className="modal-overlay" onClick={closeImageModal}>
            <div
              className="modal-content image-modal"
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
                  `${currentImageIndex + 1} / ${selectedArtist.portfolio.length
                  }`}
              </div>
            </div>
          </div>
        )}

        {isQuoteModalOpen && selectedArtist && (
          <div className="modal-overlay" onClick={closeQuoteModal}>
            <div
              className="modal-content quote-modal"
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

                    {Object.keys(selectedArtist.services)
                      .filter(serviceKey => selectedArtist.services[serviceKey].enabled)
                      .map(serviceKey => {
                        const service = selectedArtist.services[serviceKey];
                        const isSelected = !!selectedServices[serviceKey];
                        const quantity = serviceQuantities[serviceKey] || 1;

                        return (
                          <div
                            key={serviceKey}
                            className={`service-selection-item ${isSelected ? "selected" : ""}`}
                          >
                            <div className="service-selection-header">
                              <div
                                className="service-check"
                                onClick={() => toggleServiceSelection(serviceKey)}
                              >
                                <div className="checkbox">
                                  {isSelected && <FiCheck size={16} />}
                                </div>
                                <div className="service-name">
                                  <h4>{serviceNameMapping[serviceKey] || serviceKey}</h4>
                                </div>
                              </div>

                              {isSelected && serviceKey === "partyEventPackage" && (
                                <div className="quantity-selector">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      changeQuantity(serviceKey, -1);
                                    }}
                                    disabled={quantity <= 5}
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
                                <p>{serviceDescriptionMapping[serviceKey] || ""}</p>
                                <div className="service-pricing">
                                  <span className="price">Starting at ${service.minPrice}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
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
                    <div className="quote-result">
                      <h3>Your Custom Quote</h3>

                      <div className="quote-breakdown">
                        {calculatedQuote.breakdown.map((item, index) => (
                          <div key={index} className="breakdown-item">
                            <div className="breakdown-details">
                              <span className="breakdown-name">
                                {item.name}
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
                          href={`/book-appointment?artist=${selectedArtist.id
                            }&quote=${calculatedQuote.total.toFixed(2)}`}
                          className="contact-about-quote-btn"
                        >
                          <FiSend size={16} /> Contact About This Quote
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}