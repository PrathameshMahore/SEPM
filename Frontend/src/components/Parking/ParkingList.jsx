import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ParkingList = () => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchParkings();
  }, []);

  const fetchParkings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/parking');
      setParkings(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch parking data');
      setLoading(false);
      toast.error('Failed to fetch parking data');
    }
  };

  const handleBooking = (parkingId, parkingName) => {
    navigate('/user/home/parkingDuration', {
      state: {
        parkingId,
        parkingName
      }
    });
  };

  const filteredParkings = parkings.filter(parking => {
    const matchesSearch = parking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parking.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'available') return matchesSearch && parking.availableSlots > 0;
    if (filter === '24/7') return matchesSearch && parking.operatingHours.open === '00:00' && parking.operatingHours.close === '23:59';
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Available Parking Systems</h1>
        <p className="text-gray-600">Find and book your perfect parking spot</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by name or location..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'available' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setFilter('24/7')}
            className={`px-4 py-2 rounded-lg ${
              filter === '24/7' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            24/7
          </button>
        </div>
      </div>

      {/* Parking Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParkings.map((parking) => (
          <div key={parking._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Image Section */}
            <div className="relative h-48">
              <img
                src={parking.images[0] || 'https://via.placeholder.com/400x200'}
                alt={parking.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {parking.availableSlots} slots available
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{parking.name}</h2>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-semibold">{parking.rating}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{parking.address}</p>

              {/* Price and Hours */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price per hour:</span>
                  <span className="font-semibold text-blue-600">₹{parking.pricePerHour}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Operating Hours:</span>
                  <span className="font-semibold">{parking.operatingHours.open} - {parking.operatingHours.close}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Amenities:</h3>
                <div className="flex flex-wrap gap-2">
                  {parking.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => handleBooking(parking._id, parking.name)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredParkings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No parking systems found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ParkingList; 