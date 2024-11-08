"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Product {
  productId: {
    photos: string[];
    name: string;
    description: string;
    price: number;
    rating: number;
    ratingcount: number;
    status: string;
  };
  quantity: number;
}

interface Order {
  _id: string;
  date: string;
  products: Product[];
  totalPrice: number;
  paymentmethod: string;
  address: {
    address: string;
    district: string;
    state: string;
    pincode: string;
    addressContact: string;
  };
  orderStatus: string;
}

export default function Page() {
  const nav = useRouter();
  const [orders, setOrders] = useState<{
    pending: Order[];
    delivered: Order[];
    cancelled: Order[];
  }>({
    pending: [],
    delivered: [],
    cancelled: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>("pending");

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setOrders(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  function navigate(orderId: string) {
    nav.push(`/subadmin/orders/${orderId}`);
  }

  const renderOrdersTable = (ordersList: Order[], status: string) => (
    <div className="mb-8">
      {ordersList.length === 0 ? (
        <div>No {status.toLowerCase()} orders found.</div>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-[#40773b] text-white">
              <th className="border py-2 px-4">Order ID</th>
              <th className="border py-2 px-4">District</th>
              <th className="border py-2 px-4">Mobile Number</th>
              <th className="border py-2 px-4">Total Price</th>
              <th className="border py-2 px-4">Paid Status</th>
              <th className="border py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {ordersList.map((order) => (
              <tr
                key={order._id}
                className="border-b cursor-pointer
                "
                onClick={() => navigate(order._id)}
              >
                <td className="border py-2 px-4">{order._id}</td>
                <td className="border py-2 px-4">{order.address.district}</td>
                <td className="border py-2 px-4">
                  {order.address.addressContact}
                </td>
                <td className="border py-2 px-4">{order.totalPrice}</td>
                <td className="border py-2 px-4">{order.paymentmethod}</td>
                <td className="border py-2 px-4">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

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

  const getOrdersByStatus = () => {
    switch (currentStatus) {
      case "delivered":
        return renderOrdersTable(orders.delivered, "Delivered");
      case "cancelled":
        return renderOrdersTable(orders.cancelled, "Cancelled");
      default:
        return renderOrdersTable(orders.pending, "Pending");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex space-x-2 mb-4">
        <button
          className={`border-2 rounded-lg px-3 py-1 hover:bg-[#40773b] hover:text-white ${
            currentStatus === "pending"
              ? "bg-[#40773b] text-white"
              : "bg-white text-[#40773b]"
          }`}
          onClick={() => setCurrentStatus("pending")}
        >
          Pending Orders
        </button>
        <button
          className={`border-2 rounded-lg px-3 py-1 hover:bg-[#40773b] hover:text-white ${
            currentStatus === "delivered"
              ? "bg-[#40773b] text-white"
              : "bg-white text-[#40773b]"
          }`}
          onClick={() => setCurrentStatus("delivered")}
        >
          Delivered Orders
        </button>
        <button
          className={`border-2 rounded-lg px-3 py-1 hover:bg-[#40773b] hover:text-white ${
            currentStatus === "cancelled"
              ? "bg-[#40773b] text-white"
              : "bg-white text-[#40773b]"
          }`}
          onClick={() => setCurrentStatus("cancelled")}
        >
          Cancelled Orders
        </button>
      </div>
      {getOrdersByStatus()}
    </div>
  );
}
