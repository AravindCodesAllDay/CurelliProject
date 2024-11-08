"use client";
import Modal from "@/components/Modal";
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

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/order/${slug}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setOrder(data);
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

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setUpdatingStatus(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update order status");
      }
      await fetchDetails();
    } catch (error) {
      console.error("Error updating order status:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

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
    <Modal>
      <div className="max-w-4xl mx-auto p-6 items-center bg-white rounded">
        {order && (
          <div className="space-y-8">
            <div className="flex w-full p-4 items-center bg-green-700 text-white rounded">
              <div className="flex items-center">
                <span className="font-semibold inline">OrderId: </span>
                <span className="inline">{order._id}</span>
              </div>
              <div className="flex items-center justify-end w-full">
                <span className="font-semibold inline">Date: </span>
                <span className="inline"> {order.date}</span>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="mb-2">
                <span className="font-semibold">Payment Method: </span>
                {order.paymentmethod}
              </div>

              <div className="mb-2">
                <h4 className="font-semibold">Shipping Address:</h4>
                <p className="text-sm">
                  {order.address.address}, {order.address.district},{" "}
                  {order.address.state} - {order.address.pincode}
                </p>
                <p className="text-sm">
                  Contact: {order.address.addressContact}
                </p>
              </div>
            </div>

            <table className="w-full p-4">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Product Image</th>
                  <th className="py-2">Product</th>
                  <th className="py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product: Product, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">
                      <img
                        src={product.productId.photos[0]}
                        alt={product.productId.name}
                        className="h-14 mx-auto"
                      />
                    </td>
                    <td className="py-2 text-center">
                      {product.productId.name}
                    </td>
                    <td className="py-2 text-center">{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex text-lg p-4 border-t-2 border-green-800">
              <p> Total Price: {order.totalPrice}</p>
              <div className="ml-auto">
                <span className="font-semibold">Order Status: </span>
                <select
                  id="status-dropdown"
                  className="border rounded-lg px-2 py-1"
                  value={order.orderStatus}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  disabled={updatingStatus}
                >
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}