import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
  window.scrollTo(0, 0);
  const { userId } = useParams();

  const [userDetails, setUserDetails] = useState({});
  const [addressDetails, setAddressDetails] = useState([]);
  const [wishlistDetails, setWishlistDetails] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API}users/${userId}`);
        const data = await res.json();
        setUserDetails(data);
        setAddressDetails(data.address || []);
        setWishlistDetails(data.wishlist || []);
        setOrderDetails(data.orders || []);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchDetails();
  }, [userId]);

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(`${import.meta.env.VITE_API}users/${userId}`, {
          method: "DELETE",
        });
        setUserData(userData.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <div className="bg-gray-100 rounded-lg overflow-hidden cursor-default">
        <div>
          <form>
            <div className="flex px-4 py-2 border-b border-gray-300 font-medium">
              Personal Information
            </div>
            <div className="px-4 py-2 border-b border-gray-300 flex items-center justify-between">
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 placeholder-gray-400 text-gray-700 focus:outline-none focus:border-brown-500 flex-grow mr-2"
                placeholder="E-Mail"
                name="mail"
                value={userDetails.mail}
                disabled
              />
            </div>
            <div className="px-4 py-2 border-b border-gray-300 font-medium">
              UserName
            </div>
            <div className="flex px-4 py-2 border-b border-gray-300">
              <input
                type="text"
                name="name"
                className="border border-gray-300 rounded w-full px-3 py-2 placeholder-gray-400 text-gray-700 focus:outline-none focus:border-brown-500"
                placeholder="First name"
                value={userDetails.name}
                disabled
              />
            </div>
            <div className="px-4 py-2 border-b border-gray-300 font-medium">
              Gender
            </div>
            <div className="px-4 py-2 border-b border-gray-300">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio"
                    value="male"
                    checked={userDetails.gender === "male"}
                    name="gender"
                  />
                  <span className="text-gray-700">Male</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    value="female"
                    className="form-radio"
                    checked={userDetails.gender === "female"}
                    disabled
                    name="gender"
                  />
                  <span className="text-gray-700">Female</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    value="others"
                    className="form-radio"
                    disabled
                    checked={userDetails.gender === "others"}
                    name="gender"
                  />
                  <span className="text-gray-700">Others</span>
                </label>
              </div>
            </div>
            <div className="px-4 py-2 border-b border-gray-300 font-medium">
              Date of Birth
            </div>
            <div className="flex px-4 py-2 border-b border-gray-300">
              <input
                type="date"
                name="dob"
                className="border border-gray-300 rounded w-full px-3 py-2 placeholder-gray-400 text-gray-700 focus:outline-none focus:border-brown-500"
                placeholder="First name"
                value={userDetails.dob}
                disabled
              />
            </div>
            <div className="px-4 py-2 border-b border-gray-300 font-medium">
              Mobile Number
            </div>
            <div className="px-4 py-2 border-b border-gray-300 flex items-center justify-between">
              <input
                type="number"
                className="border border-gray-300 rounded px-3 py-2 placeholder-gray-400 text-gray-700 focus:outline-none focus:border-brown-500 flex-grow mr-2"
                placeholder="XXXXX XXXXX"
                name="phone"
                value={userDetails.phone}
                disabled
              />
            </div>
          </form>
        </div>

        <div>
          <div className="flex px-4 py-2 border-b border-gray-300 font-medium items-center">
            Address
          </div>
          <div className="px-4 py-2">
            {addressDetails.map((details) => (
              <div
                key={details._id}
                className="flex bg-white rounded p-4 border border-gray-300 mb-2"
              >
                <div className="flex-col flex">
                  <p className="text-gray-600 font-medium mb-1">
                    {details.name}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    {details.address}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {details.district}, {details.state} - {details.pincode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex px-4 py-2 border-b border-gray-300 font-medium items-center">
            Wishlist
          </div>
          <div className="px-4 py-2">
            {wishlistDetails.map((details, index) => (
              <div
                key={index}
                className="flex bg-white rounded p-4 border border-gray-300 mb-2"
              >
                <div className="flex-col flex">
                  <p className="text-gray-600 font-medium mb-1">
                    {details._id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex px-4 py-2 border-b border-gray-300 font-medium items-center">
            Orders
          </div>
          <div className="px-4 py-2">
            {orderDetails.map((details) => (
              <div
                key={details._id}
                className="flex bg-white rounded p-4 border border-gray-300 mb-2"
              >
                <div className="flex-col flex">
                  <p className="text-gray-600 font-medium mb-1">
                    {details._id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
