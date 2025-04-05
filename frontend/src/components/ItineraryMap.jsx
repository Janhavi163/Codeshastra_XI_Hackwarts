// src/components/ItineraryMap.js
import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Dummy travel data
const itineraries = {
  Paris: [
    { name: "Eiffel Tower", lat: 48.8584, lng: 2.2945 },
    { name: "Louvre Museum", lat: 48.8606, lng: 2.3376 },
    { name: "Notre-Dame", lat: 48.853, lng: 2.3499 },
  ],
  NewYork: [
    { name: "Times Square", lat: 40.758, lng: -73.9855 },
    { name: "Central Park", lat: 40.7851, lng: -73.9683 },
    { name: "Statue of Liberty", lat: 40.6892, lng: -74.0445 },
  ],
  Tokyo: [
    { name: "Shibuya Crossing", lat: 35.6595, lng: 139.7005 },
    { name: "Tokyo Tower", lat: 35.6586, lng: 139.7454 },
    { name: "Asakusa Temple", lat: 35.7148, lng: 139.7967 },
  ],
  Sydney: [
    { name: "Opera House", lat: -33.8568, lng: 151.2153 },
    { name: "Harbour Bridge", lat: -33.8523, lng: 151.2108 },
    { name: "Bondi Beach", lat: -33.8908, lng: 151.2743 },
  ],
  Rome: [
    { name: "Colosseum", lat: 41.8902, lng: 12.4922 },
    { name: "Pantheon", lat: 41.8986, lng: 12.4768 },
    { name: "Trevi Fountain", lat: 41.9009, lng: 12.4833 },
  ],
};

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ItineraryMap = () => {
  const [selectedCity, setSelectedCity] = useState("Paris");

  const places = itineraries[selectedCity];
  const center = places[0];

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Visual Itinerary for {selectedCity}</h2>
      <div style={{ marginBottom: "1rem" }}>
        {Object.keys(itineraries).map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            style={{
              margin: "0.5rem",
              padding: "0.5rem 1rem",
              background: city === selectedCity ? "#4CAF50" : "#f0f0f0",
              color: city === selectedCity ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {city}
          </button>
        ))}
      </div>

      <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place, i) => (
          <Marker
            key={i}
            position={[place.lat, place.lng]}
            icon={defaultIcon}
          >
            <Popup>{place.name}</Popup>
          </Marker>
        ))}
        <Polyline
          positions={places.map((p) => [p.lat, p.lng])}
          color="blue"
        />
      </MapContainer>
    </div>
  );
};

export default ItineraryMap;
