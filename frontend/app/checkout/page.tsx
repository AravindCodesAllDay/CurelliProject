"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import axios from "axios";

import AddAddressModal from "@/components/AddAddressModal";
import { Bounce, toast } from "react-toastify";
import { useUser } from "@/context/UserContext";

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

interface User {
  _id: string;
  mail: string;
  address: Address[];
  cart: CartItem[];
}

const Checkout: React.FC = () => {
  const router = useRouter();
  const { token, checkToken } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userAddress, setUserAddress] = useState<Address[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [getAddress, setGetAddress] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentmethod, setPaymentmethod] = useState<string>("");
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [onProcessing, setOnProcessing] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load user data.");
      }

      const user = await response.json();
      setUser(user);
      setUserAddress(user.address);
      setCartItems(user.cart);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load address or cart data.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const verifyToken = async () => {
      const isTokenValid = await checkToken();
      if (!isTokenValid) {
        router.push("/login");
      }
    };

    if (token) {
      verifyToken();
      fetchUserDetails();
    } else {
      router.push("/login");
    }
  }, [token, fetchUserDetails, checkToken, router]);

  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      router.push("/orders");
    }
  }, [loading, cartItems, router]);

  const calculateDeliveryPrice = async (COD: string) => {
    try {
      if (!token || !address?._id) {
        throw new Error("Missing userId or addressId for delivery calculation");
      }
      if (!COD || !["COD", "Prepaid"].includes(COD)) {
        toast.error("Invalid payment method.");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shiprocket/get-delivery/`,
        { addressId: address._id, COD },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch delivery price");
      }

      return response.data.deliveryPrice;
    } catch (error) {
      console.error("Error calculating delivery price:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchDeliveryPrice = async () => {
      if (address && paymentmethod) {
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
  }, [address?._id, paymentmethod]);

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
        `${process.env.NEXT_PUBLIC_API_URL}/razorpay/create-payment`,
        {
          amount: `${Math.round(subtotalPrice + deliveryPrice)}`,
          email: user!.mail,
          mobile: address?.addressContact,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          toast.success(
            `Payment successful. Payment ID: ${response.razorpay_payment_id}`,
            {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            }
          );
          try {
            const orderRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/shiprocket/create-order-prepaid`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  order_id,
                  addressId: address?._id,
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
            toast.success("Order placed successfully", {
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
            router.push("/orders");
          } catch (error) {
            toast.error("Error during payment process");
            console.error("Error creating payment:", error);
            setOnProcessing(false);
          }
        },
        prefill: {
          email: user!.mail,
        },
        theme: { color: "#638759" },
        modal: {
          ondismiss: () => {
            setOnProcessing(false);
          },
        },
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            addressId: address?._id,
          }),
        }
      );

      if (!orderRes.ok) {
        throw new Error("Error placing the order");
      }

      await orderRes.json();
      setOnProcessing(false);
      toast.success("Order placed successfully", {
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
      router.push("/orders");
    } catch (error) {
      console.error("Error during placing order", error);
      setOnProcessing(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <div className="flex flex-col justify-center items-center">
        <div className="w-full flex flex-col items-center md:items-start md:flex-row p-3">
          <div className="w-full md:w-4/6 m-3 flex flex-col gap-8 text-xs sm:text-sm md:text-base">
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
                          address?._id === data._id
                            ? "border-green-600 bg-green-100"
                            : ""
                        }`}
                        key={data._id}
                        onClick={() => {
                          setAddress(data);
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
              {getAddress && address && (
                <div className="bg-white rounded-lg p-3 flex items-center">
                  <p>
                    Selected Address :
                    <span className="font-semibold">
                      {
                        userAddress.find((addr) => addr._id === address._id)
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
                          <th>Name</th>
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
                      className={`bg-white text-green-800 py-2 px-4 rounded duration-150 transition-all ease-in-out ${
                        !onProcessing ? "hover:scale-105" : "bg-slate-200"
                      }`}
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
          onRefresh={() => fetchUserDetails()}
        />
      )}
    </>
  );
};

export default Checkout;
