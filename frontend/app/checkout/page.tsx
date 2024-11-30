"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import axios from "axios";

import AddAddressModal from "@/components/AddAddressModal";
import { toast } from "react-toastify";
import Header from "@/components/Header";

declare var Razorpay: any;

interface CartItem {
  productId: string;
  name: string;
  photos: string[];
  price: number;
  weight: number;
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
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [onProcessing, setOnProcessing] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const fetchCartAddressDetails = useCallback(async () => {
    setLoading(true);
    try {
      const addressResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/address/${userId}`
      );
      const cartResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/cart/${userId}`
      );

      const address = await addressResponse.json();
      const cart = await cartResponse.json();

      setUserAddress(address);
      setCartItems(cart);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load address or cart data.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("id");
      if (storedUserId !== userId) {
        setUserId(storedUserId);
      }
    }
  }, [userId]);

  useEffect(() => {
    if (userId && userAddress.length === 0 && cartItems.length === 0) {
      fetchCartAddressDetails();
    }
  }, [userId, userAddress.length, cartItems.length, fetchCartAddressDetails]);

  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      router.push("/orders");
    }
  }, [loading, cartItems, router]);

  const calculateDeliveryPrice = async (COD: string) => {
    try {
      if (!userId || !addressId) {
        throw new Error("Missing userId or addressId for delivery calculation");
      }
      if (!COD || !["COD", "Prepaid"].includes(COD)) {
        toast.error("Invalid payment method.");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shiprocket/get-delivery/`,
        { userId, addressId, COD }
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch delivery price");
      }

      const deliveryPrice = response.data.deliveryPrice;
      return deliveryPrice;
    } catch (error) {
      console.error("Error calculating delivery price:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchDeliveryPrice = async () => {
      if (addressId && paymentmethod && cartItems.length > 0) {
        try {
          const price = await calculateDeliveryPrice(paymentmethod);
          setDeliveryPrice(price);
        } catch (error) {
          toast.error("Error calculating delivery price");
          console.error(error);
        }
      }
    };

    fetchDeliveryPrice();
  }, [addressId, paymentmethod, cartItems]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const subtotalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shiprocket/create-payment`,
        {
          amount: `${Math.round(subtotalPrice + deliveryPrice)}`,
          email: "aravindsiva1509@gmail.com",
        }
      );
      const { order_id } = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        order_id: order_id,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          alert(
            `Payment successful. Payment ID: ${response.razorpay_payment_id}`
          );
          try {
            const orderRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/shiprocket/create-order-prepaid`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  order_id,
                  userId,
                  addressId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            if (!orderRes.ok) {
              throw new Error("Error placing the order");
            }

            await orderRes.json();
            setOnProcessing(false);
            router.push("/orders");
          } catch (error) {
            toast.error("Error during payment process");
            console.error("Error creating payment:", error);

            setOnProcessing(false);
          }
        },
        prefill: {
          email: "aravindsiva1509@gmail.com",
        },
        theme: { color: "#F37254" },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error creating payment:", error.response?.data);
      } else {
        console.error("Unexpected error:", (error as Error).message);
      }
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setOnProcessing(true);
      if (paymentmethod === "Prepaid") {
        handlePayment();
        return;
      }
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shiprocket/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            addressId,
          }),
        }
      );

      if (!orderRes.ok) {
        throw new Error("Error placing the order");
      }

      await orderRes.json();
      setOnProcessing(false);
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

      setOnProcessing(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
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
                        paymentmethod == "COD"
                          ? "border-green-600 bg-green-100"
                          : ""
                      }`}
                      onClick={() => {
                        setPaymentmethod("COD");
                        setShowPaymentMethod(true);
                      }}
                    >
                      <span>Cash On Delivery</span>
                    </div>
                    <div
                      className={`cursor-pointer rounded border-2 p-1 hover:border-green-600 hover:bg-green-50 ${
                        paymentmethod == "Prepaid"
                          ? "border-green-600 bg-green-100"
                          : ""
                      }`}
                      onClick={() => {
                        setPaymentmethod("Prepaid");
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
                      disabled={onProcessing}
                    >
                      Place your order
                    </button>

                    <p className="text-lg font-semibold text-white">
                      Order Total :{Math.round(subtotalPrice + deliveryPrice)}
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
            <p>Items: ₹{subtotalPrice}</p>
            <p>
              Delivery:{" "}
              {deliveryPrice
                ? `₹${Math.round(deliveryPrice)}`
                : "Choose Address & paymentmethod"}
            </p>
            <p className="border-y py-2 border-white text-xl">
              Order Total: ₹{Math.round(subtotalPrice + deliveryPrice)}
            </p>
          </div>
        </div>
      </div>
      {addModal && (
        <AddAddressModal
          onClose={() => setAddModal(false)}
          onRefresh={() => fetchCartAddressDetails()}
        />
      )}
    </>
  );
};

export default Checkout;
