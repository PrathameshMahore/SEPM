import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserHistory = () => {
  const [historyData, setHistoryData] = useState([]); // State to hold transaction data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Dummy data with Indian names and realistic values
      const dummyHistoryData = [
        {
          _id: "1",
          userName: "Rajesh Kumar",
          parkingDuration: "2 hours 30 minutes",
          totalPrice: "₹150",
          paymentDateTime: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          slotNumber: "A-12"
        },
        {
          _id: "2",
          userName: "Priya Sharma",
          parkingDuration: "1 hour 15 minutes",
          totalPrice: "₹75",
          paymentDateTime: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
          slotNumber: "B-05"
        },
        {
          _id: "3",
          userName: "Amit Patel",
          parkingDuration: "4 hours 45 minutes",
          totalPrice: "₹225",
          paymentDateTime: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
          slotNumber: "C-08"
        },
        {
          _id: "4",
          userName: "Sneha Reddy",
          parkingDuration: "3 hours 20 minutes",
          totalPrice: "₹180",
          paymentDateTime: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
          slotNumber: "D-15"
        },
        {
          _id: "5",
          userName: "Vikram Singh",
          parkingDuration: "5 hours 10 minutes",
          totalPrice: "₹280",
          paymentDateTime: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
          slotNumber: "E-03"
        }
      ];
      
      setHistoryData(dummyHistoryData);
      setLoading(false);
    }, 1000); // Simulate 1 second loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4">
      <ToastContainer />

      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {historyData.map((entry) => (
          <div
            key={entry._id}
            className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white flex flex-col justify-between"
            style={{
              fontFamily: '"Georgia", serif',
            }}
          >
            <div className="flex flex-col mb-4 text-gray-800">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-lg">Username:</span>
                <span className="text-gray-600">{entry.userName}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-lg">Parking ID:</span>
                <span className="text-gray-600">{entry._id}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-lg">Parking Duration:</span>
                <span className="text-gray-600">{entry.parkingDuration}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-lg">Price:</span>
                <span className="text-gray-600">{entry.totalPrice}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-lg">Date:</span>
                <span className="text-gray-600">
                  {new Date(entry.paymentDateTime).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-lg">Time of Booking:</span>
                <span className="text-gray-600">
                  {new Date(entry.paymentDateTime).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-lg">Slot Number:</span>
                <span className="text-gray-600">{entry.slotNumber}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHistory;
