import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for Toastify
import CardSection from "../CardSection/CardSection";

const UserHome = () => {
  const navigate = useNavigate(); // Use navigate

  // Function to check slot availability
  const handleBookNow = async () => {
    // Bypass API call and directly navigate to ParkingDuration
    navigate("/user/home/parkingDuration");
  };

  // Handle the "Find on Map" button click
  const handleFindMapClick = () => {
    navigate("/user/home/map"); // Navigate to the map route
  };

  // Handle the "Check History" button click
  const handleCheckHistoryClick = () => {
    navigate("/user/home/history"); // Navigate to the history route
  };

  // Handle the "Book Now" button click
  const handleBookNowClick = () => {
    handleBookNow(); // Check slot availability
  };

  return (
    <div className="flex flex-col h-screen">
      {/* ToastContainer for notifications */}
      <ToastContainer />

      {/* CardSection for interaction */}
      <div className="flex-grow w-full bg-gray-200 mb-5">
        <CardSection
          onFindMapClick={handleFindMapClick}
          onCheckHistoryClick={handleCheckHistoryClick}
          onBookNowClick={handleBookNowClick} // Pass the book now handler
        />
      </div>
    </div>
  );
};

export default UserHome;
