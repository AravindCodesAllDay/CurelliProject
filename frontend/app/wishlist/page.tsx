"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaShareAlt, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import Header from "../_components/Header";

interface WishlistItem {
  productId: string;
  name: string;
  rating: number;
  ratingcount: number;
  photos: string[];
  price: number;
}

const Wishlist = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const fetchWishDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/wishlist/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const updatedWishItems = await response.json();
      setWishlistItems(updatedWishItems);
    } catch (error) {
      console.error("Error fetching user wishlist:", error);
      toast.error("Error fetching wishlist. Please try again later.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("id");
      setUserId(storedUserId);
    }
  }, []);
  useEffect(() => {
    if (userId) {
      fetchWishDetails();
    }
  }, [userId, fetchWishDetails]);

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/wishlist`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, productId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete item from wishlist");
      }

      await fetchWishDetails();
      toast.success("Item removed from wishlist.");
    } catch (error) {
      console.error("Error deleting item from wishlist:", error);
      toast.error("Error deleting item from wishlist. Please try again later.");
    }
  };

  const add2cart = async (productId: string) => {
    if (!userId) {
      toast.warn("Please login to continue", {
        closeButton: false,
        pauseOnHover: true,
      });
      router.push("/login");
      return;
    }

    try {
      const listResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, productId }),
        }
      );

      if (listResponse.status === 409) {
        toast.info(`Item already in cart`, {
          closeButton: false,
          pauseOnHover: true,
        });
      } else if (listResponse.ok) {
        toast.success(`Item added to cart`, {
          closeButton: false,
          pauseOnHover: true,
        });
      } else {
        const errorResult = await listResponse.json();
        throw new Error(errorResult.error || `Error adding item to cart`);
      }
    } catch (error) {
      toast.error(`Failed to add item to cart`, {
        closeButton: false,
        pauseOnHover: true,
      });
    }
  };

  return (
    <>
      <Header title="My Wishlist" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-3">
        {wishlistItems.map((item) => (
          <div
            key={item.productId}
            className="bg-white p-4 shadow rounded flex flex-row items-center justify-between text-xs md:text-base"
          >
            <div className="flex items-center">
              <img
                src={item.photos[0]}
                alt={item.name}
                className="sm:size-24 size-20 object-cover mr-4"
              />
              <div>
                <h2 className="text-base md:text-lg font-semibold">
                  {item.name}
                </h2>
                <div className="flex items-center -ml-0.5">
                  <Rating
                    name="size-small"
                    readOnly
                    value={item.rating}
                    precision={0.5}
                    size="small"
                  />
                  <p className="text-gray-600 -mt-1">({item.ratingcount})</p>
                </div>
                <p className="text-gray-600 mb-2">Rs: {item.price}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="p-2 bg-[#40773b] text-white rounded hover:bg-[#30512d]"
                onClick={() => add2cart(item.productId)}
              >
                Add to Cart
              </button>
              <div className="flex justify-center">
                <FaTrash
                  className="w-5 h-5 text-red-800 mr-4 cursor-pointer"
                  onClick={() => handleDelete(item.productId)}
                />
                <FaShareAlt className="w-5 h-5 text-black cursor-pointer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Wishlist;
