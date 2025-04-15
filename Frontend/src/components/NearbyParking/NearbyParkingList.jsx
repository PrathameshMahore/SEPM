import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './NearbyParkingList.css';

const NearbyParkingList = () => {
  const [parkingSystems, setParkingSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('distance'); // 'distance' or 'rating'
  const navigate = useNavigate();

  useEffect(() => {
    fetchParkingSystems();
  }, [filter]);

  const fetchParkingSystems = async () => {
    try {
      setLoading(true);
      const endpoint = filter === 'distance' 
        ? '/api/nearby-parking/by-distance'
        : '/api/nearby-parking/by-rating';
      
      const response = await axios.get(endpoint);
      setParkingSystems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch nearby parking systems');
      toast.error('Failed to fetch nearby parking systems');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (parkingSystem) => {
    navigate('/booking/duration', { 
      state: { 
        parkingSystemId: parkingSystem._id,
        parkingSystemName: parkingSystem.name,
        hourlyRate: parkingSystem.hourlyRate
      } 
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading nearby parking systems...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchParkingSystems}>Retry</button>
      </div>
    );
  }

  return (
    <div className="nearby-parking-container">
      <div className="filter-section">
        <h2>Nearby Parking Systems</h2>
        <div className="filter-buttons">
          <button 
            className={filter === 'distance' ? 'active' : ''} 
            onClick={() => setFilter('distance')}
          >
            Sort by Distance
          </button>
          <button 
            className={filter === 'rating' ? 'active' : ''} 
            onClick={() => setFilter('rating')}
          >
            Sort by Rating
          </button>
        </div>
      </div>

      <div className="parking-grid">
        {parkingSystems.map((parking) => (
          <div key={parking._id} className="parking-card">
            <div className="parking-image">
              <img src={parking.imageUrl} alt={parking.name} />
              <div className="availability-badge">
                {parking.availableSlots} slots available
              </div>
            </div>
            
            <div className="parking-info">
              <h3>{parking.name}</h3>
              <p className="address">{parking.address}</p>
              
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Distance:</span>
                  <span className="value">{parking.distance} km</span>
                </div>
                <div className="detail-item">
                  <span className="label">Rate:</span>
                  <span className="value">₹{parking.hourlyRate}/hr</span>
                </div>
                <div className="detail-item">
                  <span className="label">Rating:</span>
                  <span className="value">
                    {parking.rating.toFixed(1)} ⭐
                  </span>
                </div>
              </div>

              <div className="amenities">
                {parking.amenities.map((amenity, index) => (
                  <span key={index} className="amenity-tag">
                    {amenity}
                  </span>
                ))}
              </div>

              <button 
                className="book-button"
                onClick={() => handleBooking(parking)}
                disabled={parking.availableSlots === 0}
              >
                {parking.availableSlots === 0 ? 'No Slots Available' : 'Book Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyParkingList; 