import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Page2 from './Page2';
import Destinations from './Destinations';
import ReviewComponent from './ReviewComponent';

function HomePage() {
  // Multi-step state: 1 for first form, 2 for additional options, 3 for showing tourist places
  const [formStep, setFormStep] = useState(1);
  
  // Form states
  const [from, setFrom] = useState('');
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // Additional options
  const [numPeople, setNumPeople] = useState('');
  const [budget, setBudget] = useState(3000);
  const [mode, setMode] = useState('');

  // State to store tourist places returned from your proxy endpoint
  const [places, setPlaces] = useState([]);

  // Function to fetch city suggestions (using RapidAPI GeoDB Cities API)
  const fetchCities = async (query) => {
    try {
      const response = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=10`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '7c33c803cemshf861088631b15bep16dfbfjsn2e296898cd7d',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
          },
        }
      );
      const data = await response.json();
      const cityNames = data.data.map((city) => `${city.city}, ${city.countryCode}`);
      setSuggestions(cityNames);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleInputChange = (e, fieldType) => {
    const value = e.target.value;
    if (fieldType === 'from') {
      setFrom(value);
    } else if (fieldType === 'destination') {
      setDestination(value);
    }
    setActiveField(fieldType);
    if (value.length > 1) {
      fetchCities(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (sug) => {
    if (activeField === 'from') {
      setFrom(sug);
    } else if (activeField === 'destination') {
      setDestination(sug);
    }
    setShowSuggestions(false);
  };

  // Toggle popup and reset to step 1
  const togglePopup = () => {
    setShowPopup(!showPopup);
    setFormStep(1);
  };

  // Handle submission of the first form (step 1)
  const handleFirstStepSubmit = (e) => {
    e.preventDefault();
    setFormStep(2);
  };

  // Handle going back to step 1 from step 2
  const handleBack = (e) => {
    e.preventDefault();
    setFormStep(1);
  };

  // Final submission:
  // 1. Geocode the destination to get latitude and longitude.
  // 2. Use the retrieved coordinates to call your server-side proxy and fetch nearby places.
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Geocode the destination
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=AIzaSyBhwcZV06UIeDf7qcyhkshqQRDcx3X-vrM`;
      const geocodeResponse = await fetch(geocodeUrl);
      if (!geocodeResponse.ok) {
        throw new Error(`Geocoding error: ${geocodeResponse.statusText}`);
      }
      const geocodeData = await geocodeResponse.json();
      if (geocodeData.results.length === 0) {
        alert("No coordinates found for the specified destination.");
        return;
      }
      const { lat, lng } = geocodeData.results[0].geometry.location;
      
      // Step 2: Call your server-side proxy endpoint using the retrieved coordinates
      const proxyUrl = `http://localhost:5000/api/places?lat=${lat}&lng=${lng}&radius=1500`;
      const placesResponse = await fetch(proxyUrl);
      if (!placesResponse.ok) {
        throw new Error(`Proxy error: ${placesResponse.statusText}`);
      }
      const placesData = await placesResponse.json();
      setPlaces(placesData);

      const formData = {
        from,
        destination,
        numPeople,
        budget,
        mode,
        latitude: lat,
        longitude: lng,
      };
  
      const response = await fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error(`Error saving data: ${response.statusText}`);
      }
  
      console.log('Form data successfully saved to MongoDB');

      setFormStep(3);
    } catch (error) {
      console.error("Error fetching tourist places:", error);
      alert("Error fetching tourist places. Please try again.");
    }
  };

  return (
    <>
      <div className="container-fluid p-0">
        <div
          className="row"
          style={{
            height: '100vh',
            backgroundImage: 'url("https://static3.bigstockphoto.com/5/7/2/small2/275585488.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Left Side - Hero Text */}
          <div
            className="col-md-6 d-flex flex-column justify-content-center text-white p-5"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <h1 className="display-4">Effortless Travel Planning!</h1>
            <h2 className="h3">Let AI Be Your Expert Guide.</h2>
            <p className="lead">
              Bid farewell to generic holiday packages. Get your AI-personalized itineraries.
            </p>
            <button className="btn btn-warning btn-lg" onClick={togglePopup}>
              Plan Itinerary For Free
            </button>
          </div>

          {/* Right Side - Visible Form on larger screens */}
          <div className="col-md-6 d-none d-md-flex flex-column justify-content-center p-5">
            <div className="bg-white p-4 rounded shadow">
              {formStep === 1 && (
                <form onSubmit={handleFirstStepSubmit}>
                  <h3 className="mb-4">Get Your Free Travel Plan Now!</h3>
                  <div className="mb-3 position-relative">
                  <label htmlFor="from" className="form-label">
                      Where are you starting from?
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="from"
                      placeholder="e.g., Delhi, IN"
                      value={from}
                      onChange={(e) => handleInputChange(e, 'from')}
                      onFocus={() => {
                        setActiveField('from');
                        from && setShowSuggestions(true);
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    />
                    <label htmlFor="destination" className="form-label mt-3">
                      What destination do you want to explore?
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="destination"
                      placeholder="Search Destination"
                      value={destination}
                      onChange={(e) => handleInputChange(e, 'destination')}
                      onFocus={() => {
                        setActiveField('destination');
                        destination && setShowSuggestions(true);
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <ul className="list-group position-absolute w-100 zindex-dropdown" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {suggestions.map((sug, index) => (
                          <li
                            key={index}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleSuggestionClick(sug)}
                            style={{ cursor: 'pointer' }}
                          >
                            {sug}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">When are you planning to travel?</label>
                    <div className="d-flex">
                      <input type="date" className="form-control me-2" id="start-date" />
                      <input type="date" className="form-control" id="end-date" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Continue
                  </button>
                </form>
              )}
              {formStep === 2 && (
                <form onSubmit={handleFinalSubmit}>
                  <h3 className="mb-4">Additional Options</h3>
                  <div className="mb-3">
                    <label htmlFor="numPeople" className="form-label">Number of People</label>
                    <input
                      type="number"
                      className="form-control"
                      id="numPeople"
                      placeholder="Enter number of people"
                      value={numPeople}
                      onChange={(e) => setNumPeople(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="budget" className="form-label">Budget (₹)</label>
                    <input
                      type="range"
                      className="form-range"
                      id="budget"
                      min="3000"
                      max="10000"
                      step="100"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                    <div>Selected Budget: {budget}</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mode" className="form-label">Mode of Transportation</label>
                    <select
                      className="form-select"
                      id="mode"
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                    >
                      <option value="">Select mode of transportation</option>
                      <option value="Car">Car</option>
                      <option value="Bus">Bus</option>
                      <option value="Train">Train</option>
                      <option value="Airplane">Airplane</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-secondary" onClick={handleBack}>
                      Back
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              )}
              {formStep === 3 && (
                <div>
                  <h3 className="mb-4">Nearby Tourist Attractions for {destination}</h3>
                  {places && places.length > 0 ? (
                    <ul className="list-group">
                      {places.map((place) => (
                        <li key={place.place_id} className="list-group-item">
                          <strong>{place.name}</strong>
                          <p>{place.vicinity}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No attractions found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Popup Form Modal */}
        {showPopup && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          >
            <div className="bg-white p-4 rounded shadow" style={{ maxWidth: '500px', width: '90%', position: 'relative' }}>
              {/* Close button */}
              <button
                type="button"
                className="btn-close position-absolute"
                style={{ top: '10px', right: '10px' }}
                onClick={togglePopup}
                aria-label="Close"
              ></button>
              {formStep === 1 && (
                <form onSubmit={handleFirstStepSubmit}>
                  <h3 className="mb-4">Get Your Free Travel Plan Now!</h3>
                  <div className="mb-3 position-relative">
                    <label htmlFor="popupFrom" className="form-label">
                      Where are you starting from?
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="popupFrom"
                      placeholder="e.g., Delhi, IN"
                      value={from}
                      onChange={(e) => handleInputChange(e, 'from')}
                      onFocus={() => {
                        setActiveField('from');
                        from && setShowSuggestions(true);
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    />
                    <label htmlFor="popupDestination" className="form-label mt-3">
                      What destination do you want to explore?
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="popupDestination"
                      placeholder="Search Destination"
                      value={destination}
                      onChange={(e) => handleInputChange(e, 'destination')}
                      onFocus={() => {
                        setActiveField('destination');
                        destination && setShowSuggestions(true);
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <ul className="list-group position-absolute w-100 zindex-dropdown" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {suggestions.map((sug, index) => (
                          <li
                            key={index}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleSuggestionClick(sug)}
                            style={{ cursor: 'pointer' }}
                          >
                            {sug}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">When are you planning to travel?</label>
                    <div className="d-flex">
                      <input type="date" className="form-control me-2" id="popup-start-date" />
                      <input type="date" className="form-control" id="popup-end-date" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Continue
                  </button>
                </form>
              )}
              {formStep === 2 && (
                <form onSubmit={handleFinalSubmit}>
                  <h3 className="mb-4">Additional Options</h3>
                  <div className="mb-3">
                    <label htmlFor="popupNumPeople" className="form-label">Number of People</label>
                    <input
                      type="number"
                      className="form-control"
                      id="popupNumPeople"
                      placeholder="Enter number of people"
                      value={numPeople}
                      onChange={(e) => setNumPeople(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="popupBudget" className="form-label">Budget (₹)</label>
                    <input
                      type="range"
                      className="form-range"
                      id="popupBudget"
                      min="3000"
                      max="10000"
                      step="100"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                    <div>Selected Budget: {budget}</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="popupMode" className="form-label">Mode of Transportation</label>
                    <select
                      className="form-select"
                      id="popupMode"
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                    >
                      <option value="">Select mode of transportation</option>
                      <option value="Car">Car</option>
                      <option value="Bus">Bus</option>
                      <option value="Train">Train</option>
                      <option value="Airplane">Airplane</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-secondary" onClick={handleBack}>
                      Back
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              )}
              {formStep === 3 && (
                <div>
                  <h3 className="mb-4">Nearby Tourist Attractions for {destination}</h3>
                  {places && places.length > 0 ? (
                    <ul className="list-group">
                      {places.map((place) => (
                        <li key={place.place_id} className="list-group-item">
                          <strong>{place.name}</strong>
                          <p>{place.vicinity}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No attractions found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Page2 />
      <Destinations />
      <ReviewComponent />
    </>
  );
}

export default HomePage;
