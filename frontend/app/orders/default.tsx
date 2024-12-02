"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface Order {
  _id: string;
  shiprocketId: number;
  address: {};
  products: {};
  date: string;
  paymentmethod: string;
  deliveryPrice: number;
  subtotalPrice: number;
}

export default function Orders() {
  const nav = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("id");
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${userId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setOrders(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching user orders:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [userId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 items-center space-y-8">
      {Array.isArray(orders) && orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        orders.map((order: any, index: number) => (
          <div
            key={index}
            className="bg-white rounded shadow-md hover:scale-105 duration-150 transition-all ease-in-out cursor-pointer"
            onClick={() => nav.push(`/orders/${order._id}`)}
          >
            <div className="flex w-full p-4 items-center bg-green-700 text-white rounded-t">
              <div className="flex items-center">
                <span className="font-semibold inline">OrderId: </span>
                <span className="inline">{order._id}</span>
              </div>
              <div className="flex items-center justify-end w-full">
                <span className="font-semibold inline">Date: </span>
                <span className="inline"> {order.date}</span>
              </div>
            </div>

            <div className="text-lg p-4 border-t-2 border-green-800">
              Total Price:{" "}
              {Math.round(order.subtotalPrice + order.deliveryPrice)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
