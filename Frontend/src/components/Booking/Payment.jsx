import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [parkingDetails, setParkingDetails] = useState({
    hours: 0,
    minutes: 0,
    userName: "",
    totalCost: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [loading, setLoading] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(true);
  const [showUPIDetails, setShowUPIDetails] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [originalCost, setOriginalCost] = useState(0);

  // Dummy discount codes
  const validDiscountCodes = {
    "PARK20": 20,
    "WELCOME10": 10,
    "FIRSTTIME": 15,
    "HOLIDAY25": 25
  };

  useEffect(() => {
    // Check if we have the required data from the previous page
    if (location.state) {
      setParkingDetails(location.state);
      setOriginalCost(location.state.totalCost);
    } else {
      // If no data, redirect back to the previous page
      toast.error("Missing billing information", {
        position: "top-center",
      });
      navigate("/user/home/parkingDuration/billing-info");
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    }
    // Format expiry date
    else if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
    }
    // Format CVV
    else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === "credit") {
      // Card number validation
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }

      // Card name validation
      if (!formData.cardName.trim()) {
        newErrors.cardName = "Card holder name is required";
      }

      // Expiry date validation
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = "Expiry date is required";
      } else {
        const [month, year] = formData.expiryDate.split("/");
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        if (
          parseInt(year) < currentYear ||
          (parseInt(year) === currentYear && parseInt(month) < currentMonth)
        ) {
          newErrors.expiryDate = "Card has expired";
        }
      }

      // CVV validation
      if (!formData.cvv.trim()) {
        newErrors.cvv = "CVV is required";
      } else if (formData.cvv.length !== 3) {
        newErrors.cvv = "CVV must be 3 digits";
      }
    } else if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        setUpiError("UPI ID is required");
        return false;
      } else if (!upiId.includes("@")) {
        setUpiError("Invalid UPI ID format");
        return false;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === "credit") {
      setShowCardDetails(true);
      setShowUPIDetails(false);
    } else {
      setShowCardDetails(false);
      setShowUPIDetails(true);
    }
  };

  const handleUpiChange = (e) => {
    setUpiId(e.target.value);
    setUpiError("");
  };

  const applyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code");
      return;
    }

    const discount = validDiscountCodes[discountCode.toUpperCase()];
    if (discount) {
      const discountedAmount = originalCost - (originalCost * discount / 100);
      setParkingDetails({
        ...parkingDetails,
        totalCost: discountedAmount
      });
      setDiscountApplied(true);
      setDiscountError("");
      toast.success(`${discount}% discount applied!`, {
        position: "top-center",
      });
    } else {
      setDiscountError("Invalid discount code");
      toast.error("Invalid discount code", {
        position: "top-center",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Generate a random booking ID
        const bookingId = Math.random().toString(36).substring(2, 15).toUpperCase();

        // Generate random slot number between 1 and 50
        const bookedSlot = Math.floor(Math.random() * 50) + 1;

        // Generate random payment ID
        const paymentId = "PAY" + Math.random().toString(36).substring(2, 10).toUpperCase();

        // Navigate to success page with all the data
        navigate("/user/home/parkingDuration/billing-info/payment/success", {
          state: {
            ...parkingDetails,
            bookingId,
            paymentId,
            paymentDate: new Date().toISOString(),
            bookedSlot,
            paymentMethod,
            discountApplied,
            discountCode: discountApplied ? discountCode : null,
            originalCost: discountApplied ? originalCost : null
          },
        });
      } catch (error) {
        toast.error("Payment failed. Please try again.", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please correct the errors in the form", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Payment Details
        </h2>

          {/* Order Summary */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Order Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Duration:</p>
                <p className="font-medium">
                  {parkingDetails.hours} hours {parkingDetails.minutes} minutes
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Cost:</p>
                <p className="font-medium">₹{parkingDetails.totalCost}</p>
                {discountApplied && (
                  <p className="text-sm text-green-600">
                    {discountCode} applied! Original price: ₹{originalCost}
                  </p>
                )}
              </div>
              <div>
                <p className="text-gray-600">Name:</p>
                <p className="font-medium">{parkingDetails.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-medium">{parkingDetails.email}</p>
              </div>
            </div>
        </div>

          {/* Discount Code Section */}
          {!discountApplied && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Have a discount code?</h3>
              <div className="flex">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter code (e.g., PARK20)"
                  className="flex-grow rounded-l-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={applyDiscount}
                  className="bg-blue-600 text-white py-2 px-4 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Apply
                </button>
              </div>
              {discountError && <p className="mt-1 text-sm text-red-600">{discountError}</p>}
              <p className="mt-2 text-sm text-gray-600">
                Valid codes: PARK20, WELCOME10, FIRSTTIME, HOLIDAY25
              </p>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Select Payment Method</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => handlePaymentMethodChange("credit")}
                className={`flex-1 py-2 px-4 rounded-md ${
                  paymentMethod === "credit"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Credit/Debit Card
              </button>
        <button
                onClick={() => handlePaymentMethodChange("upi")}
                className={`flex-1 py-2 px-4 rounded-md ${
                  paymentMethod === "upi"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                UPI
        </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Credit Card Details */}
            {showCardDetails && (
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className={`mt-1 block w-full rounded-md border ${
                      errors.cardNumber ? "border-red-500" : "border-gray-300"
                    } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`mt-1 block w-full rounded-md border ${
                      errors.cardName ? "border-red-500" : "border-gray-300"
                    } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {errors.cardName && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className={`mt-1 block w-full rounded-md border ${
                        errors.expiryDate ? "border-red-500" : "border-gray-300"
                      } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className={`mt-1 block w-full rounded-md border ${
                        errors.cvv ? "border-red-500" : "border-gray-300"
                      } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* UPI Details */}
            {showUPIDetails && (
              <div>
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">
                  UPI ID
                </label>
                <input
                  type="text"
                  id="upiId"
                  value={upiId}
                  onChange={handleUpiChange}
                  placeholder="username@upi"
                  className={`mt-1 block w-full rounded-md border ${
                    upiError ? "border-red-500" : "border-gray-300"
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {upiError && <p className="mt-1 text-sm text-red-600">{upiError}</p>}
                <p className="mt-2 text-sm text-gray-500">
                  Example: john.doe@okicici, rahul@paytm, priya@ybl
                </p>
              </div>
            )}

            <div className="flex justify-between pt-6">
        <button
                type="button"
                onClick={() => navigate("/user/home/parkingDuration/billing-info")}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back
        </button>
              <button
                type="submit"
                disabled={loading}
                className={`bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Processing..." : `Pay ₹${parkingDetails.totalCost}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
