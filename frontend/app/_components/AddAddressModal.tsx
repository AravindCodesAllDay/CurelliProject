"use client";
import React, { useState, useEffect } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddAddressModalProps {
  setAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddAddressModal({ setAddModal }: AddAddressModalProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [pincode, setPinCode] = useState<string | number>("");
  const [addressContact, setAddressContact] = useState<string | number>("");

  useEffect(() => {
    const id = localStorage.getItem("id");
    setUserId(id);
  }, []);

  const addAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User ID is missing");
      return;
    }

    if (
      !name ||
      !address ||
      !district ||
      !state ||
      !pincode ||
      !addressContact
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      const addressRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/address/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            address,
            district,
            state,
            pincode,
            addressContact,
          }),
        }
      );

      if (addressRes.ok) {
        const data = await addressRes.json();
        setAddModal(false);
        toast.success(data.message, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error("Failed to add address");
      }
    } catch (error: any) {
      console.error("Error during adding address", error.message);
      toast.error("An error occurred while adding the address");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white p-4 m-2 rounded-lg shadow-lg w-full max-w-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
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
            />
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Address"
              required
            />
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="District"
              required
            />
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="State"
              required
            />
            <input
              type="number"
              value={pincode}
              onChange={(e) => setPinCode(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Pincode"
              required
            />
            <input
              type="number"
              value={addressContact}
              onChange={(e) => setAddressContact(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Address Phone.no"
              required
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setAddModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add Address
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
