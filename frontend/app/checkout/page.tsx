"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import AddAddressModal from "../_components/AddAddressModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../_components/Header";

interface CartItem {
  _id: string;
  name: string;
  photo: string;
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
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("id") || "" : "";
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userAddress, setUserAddress] = useState<Address[]>([]);
  const [addModal, setAddModal] = useState(false);
  const [getAddress, setGetAddress] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [addressId, setAddressId] = useState<string>("");
  const [paymentmethod, setPaymentmethod] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchCartDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
      );
      const user = await response.json();
      setUserAddress(user.address);
      setCartItems(user.cart);
    } catch (error) {
      console.error("Error fetching user cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartDetails();
    }
  }, [userId]);

  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      router.push("/cart");
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
      const addressIndex = userAddress.findIndex(
        (address) => address._id === addressId
      );
      if (addressIndex === -1) {
        throw new Error("Invalid address selected");
      }
      const address = userAddress[addressIndex];

      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            addressId: address,
            products: cartItems,
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
      <ToastContainer />
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
                        className="flex items-center rounded border-2 p-1 gap-2 text-sm md:text-base"
                        key={data._id}
                      >
                        <input
                          type="radio"
                          id={data._id}
                          name="address"
                          value={data._id}
                          className="mr-2"
                          onChange={(e) => setAddressId(e.target.value)}
                        />
                        <label
                          htmlFor={data._id}
                          className="flex flex-col cursor-pointer"
                        >
                          <p>
                            {data.address}, {data.district},
                          </p>
                          <p>
                            {data.state}-{data.pincode}
                          </p>
                          <p>call-{data.addressContact}</p>
                        </label>
                      </div>
                    ))}

                    <button
                      className="border bg-[#638759] hover:bg-green-600 transition-colors ease-out duration-150 text-white px-4 py-2 rounded-md"
                      onClick={() => setAddModal(true)}
                    >
                      + Add Address
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      className="bg-white text-green-800 py-2 px-4 rounded hover:scale-110"
                      onClick={() => {
                        if (addressId !== "") {
                          setGetAddress(true);
                        } else {
                          toast.error("Select Address first");
                        }
                      }}
                    >
                      Use this address
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col bg-[#638759] rounded-lg shadow-lg p-4 w-full gap-3">
              <h3 className="text-lg font-semibold text-white">
                2. Select a payment method
              </h3>
              {getAddress && !showPaymentMethod && (
                <>
                  <div className="bg-white rounded-lg p-4 flex flex-col gap-3">
                    <div>
                      <div>
                        <input
                          type="radio"
                          value="cash"
                          onChange={(e) => setPaymentmethod(e.target.value)}
                          name="payment-method"
                        />
                        <span>Cash On Delivery</span>
                      </div>
                      <div>
                        <input
                          type="radio"
                          value="upi"
                          onChange={(e) => setPaymentmethod(e.target.value)}
                          name="payment-method"
                        />
                        <span>UPI</span>
                      </div>
                      <div>
                        <input
                          type="radio"
                          value="emi"
                          onChange={(e) => setPaymentmethod(e.target.value)}
                          name="payment-method"
                        />
                        <span>EMI</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="bg-white text-green-800 py-2 px-4 rounded hover:scale-110"
                      onClick={() => {
                        if (paymentmethod !== "") {
                          setShowPaymentMethod(true);
                        } else {
                          toast.error("Select Payment method to submit");
                        }
                      }}
                    >
                      Use this payment method
                    </button>
                  </div>
                </>
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
                            key={item._id}
                            className="border-2 m-1 text-center"
                          >
                            <td className="flex justify-center">
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.photo}`}
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
      {addModal && <AddAddressModal setAddModal={setAddModal} />}
    </>
  );
};

export default Checkout;
