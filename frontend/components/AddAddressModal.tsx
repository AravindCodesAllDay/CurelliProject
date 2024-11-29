"use client";
import React, { useState, useEffect } from "react";
import { Bounce, toast } from "react-toastify";

interface AddAddressModalProps {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  onRefresh: () => Promise<void>;
}

export default function AddAddressModal({
  onClose,
  onRefresh,
}: AddAddressModalProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [pincode, setPinCode] = useState<string>("");
  const [addressContact, setAddressContact] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("id");
    setUserId(id);
  }, []);

  const validateFields = (): string | null => {
    if (!userId) return "User ID is missing.";
    if (!name.trim()) return "Name is required.";
    if (!address.trim()) return "Address is required.";
    if (!district.trim()) return "District is required.";
    if (!state.trim()) return "State is required.";
    if (!pincode || isNaN(Number(pincode)) || pincode.length !== 6)
      return "Enter a valid 6-digit pincode.";
    if (
      !addressContact ||
      isNaN(Number(addressContact)) ||
      addressContact.length < 10
    )
      return "Enter a valid 10-digit contact number.";
    return null;
  };

  const addAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationError = validateFields();
    if (validationError) {
      toast.error(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            name,
            address,
            district,
            state,
            pincode,
            addressContact,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add address.");
      }

      const data = await response.json();
      toast.success(data.message, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      onClose(false);
      await onRefresh();
    } catch (error: any) {
      console.error("Error adding address:", error.message);
      toast.error(
        error.message || "An error occurred while adding the address."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
      aria-labelledby="add-address-modal"
      role="dialog"
    >
      <div className="bg-white p-4 m-2 rounded-lg shadow-lg w-full max-w-lg">
        <h3
          id="add-address-modal"
          className="text-2xl font-semibold text-gray-800 mb-4"
        >
          Add Address
        </h3>
        <form onSubmit={addAddress} className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Name"
            required
            aria-label="Name"
          />
          <textarea
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Address"
            required
            aria-label="Address"
          />
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="District"
            required
            aria-label="District"
          />
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="State"
            required
            aria-label="State"
          />
          <input
            type="number"
            value={pincode}
            onChange={(e) => setPinCode(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Pincode (6 digits)"
            required
            aria-label="Pincode"
          />
          <input
            type="number"
            value={addressContact}
            onChange={(e) => setAddressContact(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Contact Number (10 digits)"
            required
            aria-label="Contact Number"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                isSubmitting ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Add Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
