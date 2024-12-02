"use client";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("id");
      setUserId(storedUserId);
    }
  }, []);

  const fetchDetails = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shiprocket/get-order/${userId}/${slug}`
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data || Object.keys(data).length === 0) {
        throw new Error("Received empty data from the API.");
      }

      setOrder(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [userId, slug]);

  const handleCancelOrder = async () => {
    if (!userId || !slug) return;

    try {
      setCancelling(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shiprocket/cancel-order/${userId}/${slug}`,
        { method: "PATCH" }
      );

      if (!res.ok) {
        throw new Error(`Failed to cancel order: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Order cancelled:", data);
      fetchDetails();
    } catch (error) {
      console.error("Error cancelling the order:", error);
      alert(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <Modal>Loading...</Modal>;
  if (error) return <Modal>Error: {error}</Modal>;
  if (!order) return <Modal>No order data available.</Modal>;

  const isCancelled = order.status === "CANCELED";

  return (
    <Modal>
      <div className="bg-white p-3 rounded">
        <section className="flex w-full p-4 items-center bg-green-700 text-white rounded-t">
          <div className="flex items-center">
            <span className="font-semibold inline">OrderId: </span>
            <span className="inline ml-2">{order.order._id}</span>
          </div>
          <div className="flex items-center justify-end w-full">
            <span className="font-semibold inline">Date: </span>
            <span className="inline ml-2">{formatDate(order.order.date)}</span>
          </div>
        </section>
        <section>
          <table className="w-full p-4">
            <thead>
              <tr className="border-b">
                <th className="py-2">Product Image</th>
                <th className="py-2">Product</th>
                <th className="py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {order.order.products?.length > 0 ? (
                order.order.products.map((product: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">
                      <img
                        src={product.photos[0]}
                        alt={product.name}
                        className="h-14 mx-auto"
                      />
                    </td>
                    <td className="py-2 text-center">{product.name}</td>
                    <td className="py-2 text-center">{product.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No products available in this order.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
        <section>
          <div>
            <span className="font-bold text-lg">Order Status:</span>{" "}
            {order.status}
          </div>
          <div>
            <span className="font-bold text-lg">Order Delivering Date:</span>{" "}
            {order.deliverDate ? formatDate(order.deliverDate) : "N/A"}
          </div>
        </section>
        {!isCancelled && (
          <div className="mt-4">
            <button
              onClick={handleCancelOrder}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-400"
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          </div>
        )}
        <section>
          <h3 className="font-bold text-lg mt-4">Tracking Information</h3>
          {!isCancelled ? (
            order.trackingData?.[0]?.tracking_data ? (
              <div>
                <p>
                  <strong>Status:</strong>{" "}
                  {order.trackingData[0].tracking_data.track_status === 1
                    ? "In Transit"
                    : "No updates available"}
                </p>
                <p>
                  <strong>Shipment Status:</strong>{" "}
                  {order.trackingData[0].tracking_data.shipment_status}
                </p>
                {order.trackingData[0].tracking_data.track_url && (
                  <p>
                    <strong>Track URL:</strong>{" "}
                    <a
                      href={order.trackingData[0].tracking_data.track_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {order.trackingData[0].tracking_data.track_url}
                    </a>
                  </p>
                )}
              </div>
            ) : (
              <p>No tracking information available.</p>
            )
          ) : (
            <p>Tracking status is unavailable for cancelled orders.</p>
          )}
        </section>
      </div>
    </Modal>
  );
}
