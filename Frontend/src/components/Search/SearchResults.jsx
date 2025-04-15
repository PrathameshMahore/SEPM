import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaFilter, FaSort, FaMapMarkerAlt, FaStar, FaClock, FaParking } from 'react-icons/fa';
import axios from 'axios';

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    rating: 'all',
    distance: 'all',
    amenities: []
  });
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/parking/search?q=${query}`);
        setResults(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch search results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const filteredResults = results.filter(parking => {
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (parking.pricePerHour < min || parking.pricePerHour > max) return false;
    }
    if (filters.rating !== 'all' && parking.rating < Number(filters.rating)) return false;
    if (filters.distance !== 'all') {
      const [min, max] = filters.distance.split('-').map(Number);
      if (parking.distance < min || parking.distance > max) return false;
    }
    if (filters.amenities.length > 0) {
      return filters.amenities.every(amenity => parking.amenities.includes(amenity));
    }
    return true;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.pricePerHour - b.pricePerHour;
      case 'price-high':
        return b.pricePerHour - a.pricePerHour;
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return a.distance - b.distance;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaFilter className="mr-2" /> Filters
            </h3>
            
            {/* Price Range Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                className="w-full p-2 border rounded"
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="0-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200-500">$200+</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select
                className="w-full p-2 border rounded"
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>

            {/* Distance Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
              <select
                className="w-full p-2 border rounded"
                value={filters.distance}
                onChange={(e) => handleFilterChange('distance', e.target.value)}
              >
                <option value="all">Any Distance</option>
                <option value="0-1">Under 1 km</option>
                <option value="1-5">1-5 km</option>
                <option value="5-10">5-10 km</option>
                <option value="10-20">10-20 km</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Search Results for: <span className="text-blue-600">{query}</span>
            </h1>
            <div className="flex items-center">
              <FaSort className="mr-2" />
              <select
                className="p-2 border rounded"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="distance">Distance</option>
              </select>
            </div>
          </div>

          {sortedResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No results found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedResults.map((parking) => (
                <div key={parking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative">
                    <img
                      src={parking.images[0]}
                      alt={parking.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-sm font-semibold">
                      ${parking.pricePerHour}/hr
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{parking.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{parking.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaParking className="mr-1" />
                      <span>{parking.availableSlots} slots available</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <FaClock className="mr-1" />
                      <span>{parking.operatingHours}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span>{parking.rating.toFixed(1)}</span>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 