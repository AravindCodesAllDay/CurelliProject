"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import AddAddressModal from "@/components/AddAddressModal";
import { toast } from "react-toastify";
import Header from "@/components/Header";

interface CartItem {
  productId: string;
  name: string;
  photos: string[];
  price: number;
  quantity: number;
}

interface Address {
  _id: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  addressContact: string;
}

const Checkout: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userAddress, setUserAddress] = useState<Address[]>([]);
  const [addModal, setAddModal] = useState(false);
  const [getAddress, setGetAddress] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [addressId, setAddressId] = useState<string>("");
  const [paymentmethod, setPaymentmethod] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchCartAddressDetails = async () => {
    try {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/address/${userId}`
      );
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/cart/${userId}`
      );
      const address = await data.json();
      const cart = await response.json();

      setUserAddress(address);
      setCartItems(cart);
    } catch (error) {
      console.error("Error fetching user cart:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("id");
      setUserId(storedUserId);
    }
  }, []);
  useEffect(() => {
    if (userId) {
      fetchCartAddressDetails();
    }
  }, [userId, fetchCartAddressDetails]);

  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      router.push("/orders");
    }
  }, [loading, cartItems, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    try {
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            addressId,
            paymentmethod,
            totalPrice:
              totalPrice + Math.round(totalPrice * 0.1) - totalItems * 5,
          }),
        }
      );

      if (!orderRes.ok) {
        throw new Error("Error placing the order");
      }

      await orderRes.json();
      router.push("/orders");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error during placing order", error.message);
      } else {
        console.error(
          "Error during placing order",
          "An unknown error occurred."
        );
      }
    }
  };
  return (
    <>
      <Header title="Checkout" />
      <div className="flex flex-col justify-center items-center">
        <div className="w-full flex flex-col items-center md:items-start md:flex-row p-3">
          <div className="w-full md:w-4/6 m-3 flex flex-col gap-8">
            <div className="bg-[#638759] rounded-lg shadow-lg p-4 w-full flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-white">
                1. Select a Delivery Address
              </h3>
              {!getAddress && (
                <>
                  <div className="flex flex-col gap-3 bg-white rounded-lg p-4">
                    {userAddress.map((data) => (
                      <div
                        className={`flex items-center rounded border-2 p-1 gap-2 text-sm md:text-base cursor-pointer hover:border-green-600 hover:bg-green-50 ${
                          addressId === data._id
                            ? "border-green-600 bg-green-100"
                            : ""
                        }`}
                        key={data._id}
                        onClick={() => {
                          setAddressId(data._id);
                          setGetAddress(true);
                        }}
                      >
                        <span className="flex flex-col cursor-pointer">
                          <p>
                            {data.address}, {data.district},
                          </p>
                          <p>
                            {data.state}-{data.pincode}
                          </p>
                          <p>call-{data.addressContact}</p>
                        </span>
                      </div>
                    ))}

                    <button
                      className="border bg-[#638759] hover:bg-green-600 transition-colors ease-out duration-150 text-white px-4 py-2 rounded-md"
                      onClick={() => setAddModal(true)}
                    >
                      + Add Address
                    </button>
                  </div>
                </>
              )}
              {getAddress && (
                <div className="bg-white rounded-lg p-3 flex items-center">
                  <p>
                    Selected Address :
                    <span className="font-semibold">
                      {
                        userAddress.find((addr) => addr._id === addressId)
                          ?.address
                      }
                    </span>
                  </p>
                  <button
                    className="text-green-800 p-1 ml-auto border-2 rounded-lg font-semibold"
                    onClick={() => setGetAddress(false)}
                  >
                    Edit Address
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col bg-[#638759] rounded-lg shadow-lg p-4 w-full gap-3">
              <h3 className="text-lg font-semibold text-white">
                2. Select a payment method
              </h3>
              {getAddress && !showPaymentMethod && (
                <>
                  <div className="bg-white rounded-lg p-4 flex flex-col gap-3">
                    <div
                      className={`cursor-pointer rounded border-2 p-1 hover:border-green-600 hover:bg-green-50 ${
                        paymentmethod == "cash"
                          ? "border-green-600 bg-green-100"
                          : ""
                      }`}
                      onClick={() => {
                        setPaymentmethod("cash");
                        setShowPaymentMethod(true);
                      }}
                    >
                      <span>Cash On Delivery</span>
                    </div>
                    <div
                      className={`cursor-pointer rounded border-2 p-1 hover:border-green-600 hover:bg-green-50 ${
                        paymentmethod == "upi"
                          ? "border-green-600 bg-green-100"
                          : ""
                      }`}
                      onClick={() => {
                        setPaymentmethod("upi");
                        setShowPaymentMethod(true);
                      }}
                    >
                      <span>UPI</span>
                    </div>
                  </div>
                </>
              )}
              {showPaymentMethod && (
                <div className="bg-white rounded-lg p-3 flex items-center">
                  <p>
                    Selected Payment Method:{" "}
                    <span className="font-semibold">{paymentmethod}</span>
                  </p>
                  <button
                    className="text-green-800 p-1 ml-auto border-2 rounded-lg font-semibold"
                    onClick={() => setShowPaymentMethod(false)}
                  >
                    Edit Payment Method
                  </button>
                </div>
              )}
            </div>

            <div className="bg-[#638759] rounded-lg shadow-lg p-4 w-full flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-white">
                3. Items and Delivery
              </h3>
              {getAddress && showPaymentMethod && (
                <>
                  <div className="bg-white rounded-lg p-4">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr
                            key={item.productId}
                            className="border-2 m-1 text-center"
                          >
                            <td className="flex justify-center">
                              <img
                                src={item.photos[0]}
                                alt={item.name}
                                className="w-24 h-24 object-contain"
                              />
                            </td>
                            <td>{item.name}</td>
                            <td>
                              <div className="flex justify-center">
                                <span>{item.quantity}</span>
                              </div>
                            </td>

                            <td>₹{item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      className="bg-white text-green-800 py-2 px-4 rounded hover:scale-110"
                      onClick={handlePlaceOrder}
                    >
                      Place your order
                    </button>
                    <p className="text-lg font-semibold text-white">
                      Order Total :
                      {totalPrice +
                        Math.round(totalPrice * 0.1) -
                        totalItems * 5}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="w-full md:w-2/6 h-96 p-4 grid grid-rows-5 items-center bg-[#638759] m-3 rounded text-white font-semibold">
            <h3 className="font-bold text-2xl justify-center flex">
              Order Summary
            </h3>
            <p>Items: ₹{totalPrice}</p>
            <p>Delivery: ₹{Math.round(totalPrice * 0.1)}</p>
            <p>Promotion Applied: ₹-{totalItems * 5}</p>
            <p className="border-y py-2 border-white text-xl">
              Order Total: ₹
              {totalPrice + Math.round(totalPrice * 0.1) - totalItems * 5}
            </p>
          </div>
        </div>
      </div>
      {addModal && (
        <AddAddressModal
          setAddModal={setAddModal}
          refreshDetails={fetchCartAddressDetails}
        />
      )}
    </>
  );
};

export default Checkout;
