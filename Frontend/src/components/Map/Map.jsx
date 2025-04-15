import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import './MapComponent.css'; // Import the Leaflet CSS

// Custom marker icon for user location
const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom marker for parking spots
const parkingIcon = L.divIcon({
  className: 'parking-icon',
  html: '<div class="circle">P</div>', // Circle with letter "P"
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// OpenRouteService API key (store in environment variable for security)
const OPENROUTESERVICE_API_KEY = '5b3ce3597851110001cf624883cade0c9d174d0d8d7ed9abcc61131f'; // Replace with your own key

const generateParkingSpots = (lat, lng, numSpots) => {
  const spots = [];
  for (let i = 0; i < numSpots; i++) {
    const angle = Math.random() * 2 * Math.PI; // Random angle
    const distance = Math.random() * 0.009; // Random distance ~1km (0.009 degrees ~1km)
    const newLat = lat + distance * Math.sin(angle);
    const newLng = lng + distance * Math.cos(angle);
    spots.push([newLat, newLng]);
  }
  return spots;
};

// Component to set the map view
const SetView = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      const bounds = [
        [position[0] + 0.00045, position[1] - 0.00045],
        [position[0] - 0.00045, position[1] + 0.00045],
      ];
      map.fitBounds(bounds);
    }
  }, [position, map]);

  return null;
};

function Map() {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [parkingSpots, setParkingSpots] = useState([]); // State for parking spots
  const [directions, setDirections] = useState([]); // State for directions
  const [error, setError] = useState(null); // State for error messages

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        const spots = generateParkingSpots(latitude, longitude, 5); // Generate 5 parking spots
        setParkingSpots(spots);
        fetchDirections([latitude, longitude], spots); // Fetch directions
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location: ', error);
        setPosition([0, 0]); // Set a default position if geolocation fails
        setError('Could not get your location. Please enable location services.');
        setLoading(false);
      }
    );
  }, []);

  const fetchDirections = async (userLocation, spots) => {
    try {
      const fetchedDirections = await Promise.all(
        spots.map(async (spot) => {
          try {
            // Check if coordinates are valid
            if (!userLocation || !spot || 
                isNaN(userLocation[0]) || isNaN(userLocation[1]) || 
                isNaN(spot[0]) || isNaN(spot[1])) {
              console.warn('Invalid coordinates provided:', { userLocation, spot });
              return []; // Return empty array for invalid coordinates
            }

            const response = await fetch(
              `https://api.openrouteservice.org/v2/directions/driving-car?start=${userLocation[1]},${userLocation[0]}&end=${spot[1]},${spot[0]}`,
              {
                headers: {
                  'Authorization': OPENROUTESERVICE_API_KEY,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (!response.ok) {
              console.error('Error fetching directions:', response.statusText, await response.text());
              // Create a simple straight line as fallback
              return [userLocation, spot];
            }

            const data = await response.json();

            if (!data.routes || data.routes.length === 0) {
              console.warn('No routes found for this request, using straight line');
              // Create a simple straight line as fallback
              return [userLocation, spot];
            }

            return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]); // Convert to [lat, lng]
          } catch (error) {
            console.error('An error occurred while fetching directions:', error);
            // Create a simple straight line as fallback
            return [userLocation, spot];
          }
        })
      );

      const validDirections = fetchedDirections.filter(route => route.length > 0);
      setDirections(validDirections);
      console.log('Fetched directions:', validDirections);
    } catch (error) {
      console.error('Error in fetchDirections:', error);
      // Set empty directions if all else fails
      setDirections([]);
    }
  };

  const handleBackClick = () => {
    navigate('/user/home');
  };

  return (
    <div className="h-screen w-full relative">
      <button
        onClick={handleBackClick}
        className="absolute top-4 right-4 text-5xl font-bold text-gray-700 bg-white rounded-full border-2 border-gray-700 shadow-md p-2 focus:outline-none hover:bg-gray-300 z-10"
      >
        &times; {/* Cross symbol */}
      </button>

      <div className="h-full w-full p-4">
        <div className="h-full rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-lg">Loading map...</p>
            </div>
          ) : (
            <>
              {error && <div className="error-message">{error}</div>}
              <MapContainer center={position || [0, 0]} zoom={13} className="h-full">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {position && (
                  <>
                    <Marker position={position} icon={icon}>
                      <Popup>You are here!</Popup>
                    </Marker>
                    <SetView position={position} />
                  </>
                )}
                {parkingSpots.map((spot, index) => (
                  <Marker key={index} position={spot} icon={parkingIcon}>
                    <Popup>Parking Spot {index + 1}</Popup>
                  </Marker>
                ))}
                {directions.map((route, index) => (
                  <Polyline
                    key={index}
                    positions={route}
                    color={index === 0 ? 'blue' : 'green'}
                    weight={3}
                    opacity={0.7}
                  />
                ))}
              </MapContainer>
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        .parking-icon .circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #28a745; /* Green background */
          color: white; /* White text */
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

export default Map;
