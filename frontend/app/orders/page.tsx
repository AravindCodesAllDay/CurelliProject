"use client";
import React, { useState, useEffect } from "react";
import Header from "../_components/Header";

export default function Orders() {
  const userId = localStorage.getItem("id");
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [showCompletedOrders, setShowCompletedOrders] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setOngoingOrders(
          data.orders
            .filter((order: any) => order.orderStatus === "pending")
            .reverse()
        );
        setCompletedOrders(
          data.orders
            .filter(
              (order: any) =>
                order.orderStatus === "delivered" || order.status === "canceled"
            )
            .reverse()
        );
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [userId]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="h-screen flex items-center justify-center">
        Error: {error}
      </div>
    );

  const ordersToShow = showCompletedOrders ? completedOrders : ongoingOrders;

  return (
    <>
      <Header title="Orders" />
      <div className="max-w-4xl mx-auto py-8 items-center">
        <button
          className={`border-2 rounded-lg px-3 py-1 hover:bg-[#40773b] hover:text-white ${
            !showCompletedOrders
              ? "bg-[#40773b] text-white"
              : "bg-white text-[#40773b]"
          } `}
          onClick={() => setShowCompletedOrders(false)}
        >
          <h2>Pending Orders</h2>
        </button>
        <button
          className={`border-2 rounded-lg px-3 py-1 hover:bg-[#40773b] hover:text-white ${
            showCompletedOrders
              ? "bg-[#40773b] text-white"
              : "bg-white text-[#40773b]"
          } `}
          onClick={() => setShowCompletedOrders(true)}
        >
          <h2>Completed Orders</h2>
        </button>
        <div className="space-y-8">
          {ordersToShow.length === 0 ? (
            <div>No orders found.</div>
          ) : (
            ordersToShow.map((order: any, index: number) => (
              <div key={index} className="bg-white rounded shadow-md">
                <div className="flex w-full p-4 items-center bg-green-700 text-white">
                  <div className="flex items-center ">
                    <span className=" font-semibold inline">OrderId:</span>
                    <span className="inline">{order._id}</span>
                  </div>

                  <div className="flex items-center justify-end w-full">
                    <span className="font-semibold inline">Date:</span>
                    <span className="inline"> {order.date}</span>
                  </div>
                </div>
                <table className="w-full p-4">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">ProductImage</th>
                      <th className="py-2">Product</th>
                      <th className="py-2">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((product: any, index: number) => (
                      <tr key={index} className="border-b ">
                        <td className="py-2 ">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.photo}`}
                            className="h-14 mx-auto"
                          />
                        </td>
                        <td className="py-2 text-center">{product.name}</td>
                        <td className="py-2 text-center">{product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-lg p-4 border-t-2 border-green-800">
                  Total Price: {order.totalPrice}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
