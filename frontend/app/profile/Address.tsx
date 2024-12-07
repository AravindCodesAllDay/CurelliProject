"use client";
import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Bounce, toast } from "react-toastify";
import success from "@/assets/checked.png";
import AddAddressModal from "@/components/AddAddressModal";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function Address() {
  const router = useRouter();
  const { token, checkToken } = useUser();
  const [addressDetails, setAddressDetails] = useState<any[]>([]);
  const [addModal, setAddModal] = useState<boolean>(false);
  const [showModalComplete, setShowModalComplete] = useState<boolean>(false);

  const handleError = (message: string) => {
    console.error(message);
    toast.error(message);
  };

  const fetchDetails = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data: any = await res.json();
        setAddressDetails(data.address || []);
      } else {
        throw new Error("Failed to fetch user details");
      }
    } catch (error) {
      handleError("Failed to fetch user details");
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const isTokenValid = await checkToken();
      if (!isTokenValid) {
        router.push("/login");
      }
    };

    if (token) {
      verifyToken().then(fetchDetails);
    } else {
      router.push("/login");
    }
  }, [token, checkToken, router]);

  const deleteAddress = async (addressId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/address/${addressId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        toast.success(data.message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setAddressDetails(
          addressDetails.filter((address) => address._id !== addressId)
        );
      } else {
        throw new Error("Failed to delete address");
      }
    } catch (error) {
      handleError("Failed to delete address");
    }
  };

  return (
    <div className="bg-[#CDDCCB] rounded-lg overflow-hidden cursor-default w-11/12 md:w-5/6 mx-auto mb-4">
      {showModalComplete && (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50"
          onClick={() => setShowModalComplete(false)}
        >
          <div
            className="bg-white p-4 rounded shadow relative"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center p-2.5 text-[#40773b] font-bold">
              Changes updated successfully
            </p>
            <Image src={success} alt="success" className="w-12 h-12 ml-20" />
            <button
              onClick={() => setShowModalComplete(false)}
              className="absolute top-2 -right-0.5 bg-transparent border-none"
            >
              <svg
                className="w-6 h-6 text-[#40773b]"
                fill="none"
                viewBox="0 0 40 40"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="flex px-4 py-2 border-b border-gray-300 font-medium items-center">
          <h3 className="font-semibold text-lg">Manage Address</h3>
          <button
            className="flex items-center gap-1 ml-auto border-2 border-green-700 bg-green-700 hover:bg-green-400 text-white p-1 px-2 rounded "
            onClick={() => setAddModal(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add
          </button>
        </div>

        {addModal && (
          <AddAddressModal
            onClose={() => setAddModal(false)}
            onRefresh={() => fetchDetails()}
          />
        )}

        <div className="px-4 py-2">
          {addressDetails.map((details) => (
            <div
              key={details._id}
              className="flex bg-white rounded p-4 border border-gray-300 mb-2"
            >
              <div className="flex-col flex">
                <p className="text-gray-600 font-medium mb-1">{details.name}</p>
                <p className="text-gray-600 text-sm mb-1">{details.address}</p>
                <p className="text-gray-600 text-sm">
                  {details.district}, {details.state} - {details.pincode}
                </p>
              </div>
              <div className="flex flex-col gap-4 ml-auto justify-center">
                <FaTrash
                  onClick={() => deleteAddress(details._id)}
                  className="w-5 h-5 ml-auto cursor-pointer text-red-800"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
