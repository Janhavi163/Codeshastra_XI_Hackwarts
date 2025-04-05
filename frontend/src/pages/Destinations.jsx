import React from 'react';
import IndiaDestinations from '../components/IndiaDestinations';
import EuropeDestinations from '../components/EuropeDestinations';

function Destinations() {
  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div className="hero-section py-5 bg-light text-center">
        <div className="container py-5">
          <h1 className="display-4 fw-bold">Discover Amazing Destinations</h1>
          <p className="lead">Explore the beauty of India and beyond with our curated travel experiences</p>
          <button className="btn btn-primary btn-lg">Browse Destinations</button>
        </div>
      </div>
      
      {/* India Destinations */}
      <div className="container py-5">
        <h2 className="display-6 fw-bold mb-4">Plan as per the best destinations in India</h2>
        <IndiaDestinations />
      </div>
      
      {/* Europe Destinations */}
      <div className="container py-5">
        <h2 className="display-6 fw-bold mb-4">Top countries to visit in Europe</h2>
        <EuropeDestinations />
      </div>
      
    </div>
  );
}

export default Destinations;