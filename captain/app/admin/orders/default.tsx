"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Product {
  productId: string;
  photos: string[];
  name: string;
  description: string;
  price: number;
  rating: number;
  ratingcount: number;
  status: string;

  quantity: number;
}

interface Order {
  _id: string;
  date: string;
  products: Product[];
  subtotalPrice: number;
  deliveryPrice: number;
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    nav.push(`/admin/orders/${orderId}`);
  }

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
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        {orders.length === 0 ? (
          <div>No orders found.</div>
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
              {orders.map((order) => (
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
                  <td className="border py-2 px-4">
                    {Math.round(order.subtotalPrice + order.deliveryPrice)}
                  </td>
                  <td className="border py-2 px-4">{order.paymentmethod}</td>
                  <td className="border py-2 px-4">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
