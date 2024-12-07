"use client";
import { useUser } from "@/context/UserContext";
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
  const { token, checkToken } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const verifyToken = async () => {
      const isTokenValid = await checkToken();
      if (!isTokenValid) {
        nav.push("/login");
      } else {
        setIsVerifyingToken(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      nav.push("/login");
    }
  }, [token, checkToken, nav]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!token || isVerifyingToken) return;

      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setOrders(data.reverse());
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
  }, [token, isVerifyingToken]);

  if (isVerifyingToken || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        {isVerifyingToken ? "Verifying..." : "Loading..."}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        <div className="text-center">
          <p className="font-bold">An error occurred:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 items-center space-y-8">
      {Array.isArray(orders) && orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg font-semibold">No orders found</p>
          <p className="text-sm">
            Looks like you haven&apos;t placed any orders yet.
          </p>
        </div>
      ) : (
        orders.map((order: Order, index: number) => (
          <div
            key={index}
            className="bg-white rounded shadow-md hover:scale-105 duration-150 transition-all ease-in-out cursor-pointer mb-6"
            onClick={() => nav.push(`/orders/${order._id}`)}
          >
            <div className="flex w-full p-4 items-center bg-green-700 text-white rounded-t">
              <div className="flex items-center">
                <span className="font-semibold inline">OrderId: </span>
                <span className="inline">{order._id}</span>
              </div>
              <div className="flex items-center justify-end w-full">
                <span className="font-semibold inline">Date: </span>
                <span className="inline"> {formatDate(order.date)}</span>
              </div>
            </div>
            <div className="text-lg p-4 border-t-2 border-green-800">
              Total Price:{" "}
              {Math.round(
                (order?.subtotalPrice || 0) + (order?.deliveryPrice || 0)
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
