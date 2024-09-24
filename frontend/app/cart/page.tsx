"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../_components/Header";

import { toast } from "react-toastify";
import { FaShareAlt, FaTrash } from "react-icons/fa";

interface CartItem {
  productId: string;
  name: string;
  photos: string[];
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const router = useRouter();
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("id") || "" : "";
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = async (productId: string, sign: "+" | "-") => {
    try {
      console.log(productId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/cart/${sign}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            productId,
          }),
        }
      );

      if (res.status === 404) throw new Error("Product not found in the cart");
      if (res.status === 400) throw new Error("Invalid request");
      if (res.status !== 200) throw new Error("Failed to update quantity");

      await fetchCartDetails();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(
        `Error updating quantity: ${
          error instanceof Error ? error.message : "An error occurred"
        }`
      );
    }
  };

  const fetchCartDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/cart/${userId}`
      );

      if (!response.ok) throw new Error("Failed to fetch cart details");

      const cart = await response.json();
      console.log(cart);
      setCartItems(cart);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user cart:", error);
      setError("Error fetching cart. Please try again later.");
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/cart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId }),
      });

      if (!res.ok) throw new Error("Failed to delete item");

      await fetchCartDetails();
      toast.success("Item removed successfully", {
        closeButton: false,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error("Error deleting item from cart:", error);
      toast.error("Error deleting item from cart. Please try again later.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartDetails();
    }
  }, [userId]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <Header title={"Cart"} />
      {cartItems.length > 0 ? (
        <div className="container mx-auto p-2">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId} className="border-b">
                  <td className="flex justify-center p-2">
                    <img
                      src={item.photos[0]}
                      alt={item.name}
                      className="w-24 h-24 object-contain"
                    />
                  </td>
                  <td className="p-2 text-center">{item.name}</td>
                  <td className="p-2">
                    <div className="flex justify-center items-center">
                      <button
                        className="size-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 font-bold text-lg"
                        onClick={() =>
                          handleQuantityChange(item.productId, "-")
                        }
                      >
                        -
                      </button>
                      <span className="font-bold text-xl">{item.quantity}</span>
                      <button
                        className="size-6 rounded-full bg-gray-200 flex items-center justify-center ml-2 font-bold text-lg"
                        onClick={() =>
                          handleQuantityChange(item.productId, "+")
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    ₹{item.price * item.quantity}
                  </td>
                  <td className="p-2">
                    <div className="flex justify-center items-center space-x-4">
                      <FaTrash
                        className="w-5 h-5 text-red-800 cursor-pointer"
                        onClick={() => handleDelete(item.productId)}
                      />
                      <FaShareAlt className="w-5 h-5 text-black cursor-pointer" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border p-4 mt-4">
            <h2 className="text-lg font-bold text-center">
              Subtotal ({totalItems} Item{totalItems > 1 ? "s" : ""}) : ₹
              {totalPrice}
            </h2>
            <hr className="my-2" />
            <div className="text-center mt-4">
              <button
                className="bg-[#40773b] hover:bg-green-600 transition-colors ease-out duration-150 text-white px-4 py-2 rounded-md"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 mx-auto p-2">
          <p>No items in cart</p>
          <Link
            href={"/shop"}
            className="bg-[#40773b] hover:bg-green-600 transition-colors ease-out duration-150 text-white px-4 py-2 rounded-md"
          >
            Browse Products
          </Link>
        </div>
      )}
    </>
  );
};

export default Cart;
