"use client";
import Modal from "@/components/Modal";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();
  const { token, checkToken } = useUser();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shiprocket/get-order/${slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data || Object.keys(data).length === 0) {
        throw new Error("Order data is empty.");
      }

      console.log(data);
      setOrder({
        ...data.order,
        status: data.status,
        deliverDate: data.deliveryDate,
      });
      setTrackingData(data.trackingData);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verifyAndFetch = async () => {
      const isTokenValid = await checkToken();
      if (!isTokenValid) {
        router.push("/login");
      } else {
        await fetchDetails();
      }
    };

    if (token) {
      verifyAndFetch();
    } else {
      router.push("/login");
    }
  }, [token, checkToken, router]);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shiprocket/cancel-order/${slug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to cancel order: ${res.statusText}`);
      }

      await fetchDetails();
    } catch (error) {
      console.error("Error cancelling the order:", error);
      alert(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <Modal>Loading...</Modal>;
  if (error) return <Modal>Error: {error}</Modal>;
  if (!order) return <Modal>No order data available.</Modal>;

  return (
    <Modal>
      <div className="bg-white p-3 rounded">
        <section className="flex w-full p-4 items-center bg-green-700 text-white rounded-t">
          <div>
            <span className="font-semibold">OrderId: </span>
            <span>{order._id}</span>
          </div>
          <div className="ml-auto">
            <span className="font-semibold">Date: </span>
            <span>{formatDate(order.date)}</span>
          </div>
        </section>
        <section className="p-4 border rounded-lg bg-gray-50">
          <div className="mb-2">
            <span className="font-semibold">Payment Method: </span>
            {order.paymentmethod}
          </div>
          <div className="mb-2">
            <span className="font-semibold"> Contact: </span>
            {order.address.addressContact}
          </div>
          <div className="mb-2">
            <h4 className="font-semibold">Shipping Address:</h4>
            <p className="text-sm">
              {order.address.address}, {order.address.district},{" "}
              {order.address.state} - {order.address.pincode}
            </p>
          </div>
        </section>
        <section className="p-4">
          <table className="w-full border">
            <thead>
              <tr className="border-b">
                <th>Product Image</th>
                <th>Product</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {order.products?.length > 0 ? (
                order.products.map((product: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      <img
                        src={product.photos[0]}
                        alt={product.name}
                        className="h-14 mx-auto"
                      />
                    </td>
                    <td className="p-2 text-center">{product.name}</td>
                    <td className="p-2 text-center">{product.quantity}</td>
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
        <section className="p-4 flex justify-between items-center\">
          <div>
            <div>
              <strong>Status:</strong> {order.status}
            </div>
            <div>
              <strong>Delivery Date:</strong>{" "}
              {order.deliverDate ? formatDate(order.deliverDate) : "N/A"}
            </div>
          </div>
          {order.status !== "CANCELED" && (
            <button
              onClick={handleCancelOrder}
              className="bg-red-500 text-white p-1 rounded"
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </section>
        <section className="p-4 border-t">
          <h3 className="font-semibold mb-2">Tracking Information:</h3>
          {trackingData?.tracking_details?.length > 0 ? (
            <ul className="list-disc pl-5">
              {trackingData.tracking_details.map(
                (detail: any, index: number) => (
                  <li key={index} className="text-sm mb-1">
                    <span className="font-semibold">{detail.status_date}:</span>{" "}
                    {detail.status}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p>No tracking information available.</p>
          )}
        </section>
      </div>
    </Modal>
  );
}
