// components/IndiaDestinations.js
import React from 'react';
import { Link } from 'react-router-dom';

function IndiaDestinations() {
  const destinations = [
    {
      id: 1,
      name: 'Jammu & Kashmir',
      image: 'data:image/jpeg;base64,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',
      price: '₹11,295/-',
      priceUnit: 'per day'
    },
    {
      id: 2,
      name: 'Ladakh',
      image: 'https://i0.wp.com/lahimalaya.com/wp-content/uploads/2019/08/Ladakh-trip.jpg?fit=960%2C640&ssl=1',
      price: '₹6,133/-',
      priceUnit: 'per day'
    },
    {
      id: 3,
      name: 'Kerala',
      image: 'https://lp-cms-production.imgix.net/2024-08/shutterstock2044878389.jpg',
      price: '₹6,551/-',
      priceUnit: 'per day'
    },
    {
      id: 4,
      name: 'Rajasthan',
      image: 'https://rajasthanyatra.in/blog/wp-content/uploads/2024/04/Galta-Ji-Temple-.webp',
      price: '₹6,916/-', 
      priceUnit: 'per day'
    },
    {
      id: 5,
      name: 'Andaman & Nicobar',
      image: 'https://static.wixstatic.com/media/3cd053_e029385694b848b6927fa6a57dc4cbca~mv2.jpg/v1/fill/w_1000,h_667,al_c,q_85,usm_0.66_1.00_0.01/3cd053_e029385694b848b6927fa6a57dc4cbca~mv2.jpg',
      price: 'Tropical Paradise',
      priceUnit: ''
    },
    {
      id: 6,
      name: 'Himachal Pradesh',
      image: 'https://ihplb.b-cdn.net/wp-content/uploads/2014/04/Best-Places-to-Visit-in-Himachal-Pradesh-750x430.jpg',
      price: '₹4,337/-',
      priceUnit: 'per day'
    }
  ];

  return (
    <div className="row g-4">
      {destinations.map(destination => (
        <div key={destination.id} className="col-md-4 col-sm-6">
          <Link to={`/destination/${destination.id}`} className="text-decoration-none">
            <div className="card destination-card h-100 border-0 shadow-sm position-relative overflow-hidden">
              <img 
                src={destination.image} 
                className="card-img-top" 
                alt={destination.name} 
                style={{height: '240px', objectFit: 'cover'}} 
              />
              <div className="card-img-overlay d-flex flex-column justify-content-end text-white" 
                style={{background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'}}>
                <h4 className="card-title fw-bold">{destination.name}</h4>
                <p className="card-text mb-0">
                  From <span className="fw-bold">{destination.price}</span> {destination.priceUnit}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
      <div className="col-12 text-end">
        <button className="btn btn-outline-primary">
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default IndiaDestinations;