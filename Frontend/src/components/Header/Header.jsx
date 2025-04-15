import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaBell, FaCog, FaSignOutAlt, FaSearch, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData(user);
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/user/home/search?q=${encodeURIComponent(searchQuery)}`);
      setShowMobileMenu(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/user/home" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Smart</span>
              <span className="text-2xl font-bold text-green-600">Park</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block w-1/3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search parking..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/user/home"
              className={`text-gray-600 hover:text-blue-600 transition duration-300 ${
                isActive("/user/home") ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/user/home/parking"
              className={`text-gray-600 hover:text-blue-600 transition duration-300 ${
                isActive("/user/home/parking") ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Parking
            </Link>
            <Link
              to="/user/home/map"
              className={`text-gray-600 hover:text-blue-600 transition duration-300 ${
                isActive("/user/home/map") ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Map
            </Link>
            <Link
              to="/user/home/history"
              className={`text-gray-600 hover:text-blue-600 transition duration-300 ${
                isActive("/user/home/history") ? "text-blue-600 font-semibold" : ""
              }`}
            >
              History
            </Link>
            <Link
              to="/user/home/nearby-parking"
              className={`text-gray-600 hover:text-blue-600 transition duration-300 ${
                isActive("/user/home/nearby-parking") ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Nearby
            </Link>
            <Link
              to="/user/home/profile"
              className={`text-gray-600 hover:text-blue-600 transition duration-300 ${
                isActive("/user/home/profile") ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Profile
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600">
              <FaBell className="text-xl" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600"
              >
                <FaUser className="text-xl" />
                <span className="hidden md:inline">
                  {userData ? `${userData.firstName} ${userData.lastName}` : 'User'}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/user/home/profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FaUser className="mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/user/home/settings"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FaCog className="mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
              onClick={toggleMobileMenu}
            >
              {showMobileMenu ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search parking..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
            <div className="space-y-2">
              <Link
                to="/user/home"
                className={`block px-4 py-2 rounded-lg ${
                  isActive("/user/home")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/user/home/parking"
                className={`block px-4 py-2 rounded-lg ${
                  isActive("/user/home/parking")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={closeMobileMenu}
              >
                Parking
              </Link>
              <Link
                to="/user/home/map"
                className={`block px-4 py-2 rounded-lg ${
                  isActive("/user/home/map")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={closeMobileMenu}
              >
                Map
              </Link>
              <Link
                to="/user/home/history"
                className={`block px-4 py-2 rounded-lg ${
                  isActive("/user/home/history")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={closeMobileMenu}
              >
                History
              </Link>
              <Link
                to="/user/home/nearby-parking"
                className={`block px-4 py-2 rounded-lg ${
                  isActive("/user/home/nearby-parking")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={closeMobileMenu}
              >
                Nearby
              </Link>
              <Link
                to="/user/home/profile"
                className={`block px-4 py-2 rounded-lg ${
                  isActive("/user/home/profile")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={closeMobileMenu}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
