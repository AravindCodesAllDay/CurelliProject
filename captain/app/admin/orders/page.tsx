"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [orders, setOrders] = useState({
    pending: [] as any[],
    delivered: [] as any[],
    cancelled: [] as any[],
  });
  const [showCompletedOrders, setShowCompletedOrders] = useState(false);
  const [showCancelledOrders, setShowCancelledOrders] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}orders`);
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        console.log(data);
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
  }, []);

  let ordersToShow = orders.pending;
  if (showCompletedOrders) {
    ordersToShow = orders.delivered;
  } else if (showCancelledOrders) {
    ordersToShow = orders.cancelled;
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
    <div className="max-w-4xl mx-auto py-8 items-center">
      <div className="flex space-x-2 mb-4">
        <button
          className={`border-2 rounded-lg px-3 py-1 hover:bg-[#40773b] hover:text-white ${
            !showCompletedOrders && !showCancelledOrders
              ? "bg-[#40773b] text-white"
              : "bg-white text-[#40773b]"
          }`}
          onClick={() => {
            setShowCompletedOrders(false);
            setShowCancelledOrders(false);
          }}
        >
          Pending Orders
        </button>
        <button
          className={`border-2 rounded-lg px-3 py-1 hover:bg-[#40773b] hover:text-white ${
            showCompletedOrders
              ? "bg-[#40773b] text-white"
              : "bg-white text-[#40773b]"
          }`}
          onClick={() => {
            setShowCompletedOrders(true);
            setShowCancelledOrders(false);
          }}
        >
          Completed Orders
        </button>
        <button
          className={`border-2 rounded-lg px-3 py-1 hover:bg-[#40773b] hover:text-white ${
            showCancelledOrders
              ? "bg-[#40773b] text-white"
              : "bg-white text-[#40773b]"
          }`}
          onClick={() => {
            setShowCompletedOrders(false);
            setShowCancelledOrders(true);
          }}
        >
          Cancelled Orders
        </button>
      </div>
      <div className="space-y-8">
        {Array.isArray(ordersToShow) && ordersToShow.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          ordersToShow.map((order: any, index: number) => (
            <div key={index} className="bg-white rounded shadow-md">
              <div className="flex w-full p-4 items-center bg-green-700 text-white">
                <div className="flex items-center">
                  <span className="font-semibold inline">OrderId: </span>
                  <span className="inline">{order._id}</span>
                </div>
                <div className="flex items-center justify-end w-full">
                  <span className="font-semibold inline">Date: </span>
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
              <div className="text-lg p-4 border-t-2 border-green-800">
                Total Price: {order.totalPrice}
              </div>
              <div>{order.paymentmethod}</div>
              <div>
                {order.address.address}
                {order.address.district}
                {order.address.state}
                {order.address.pincode}
                {order.address.addressContact}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
