"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { FaShareAlt, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import "react-toastify/dist/ReactToastify.css";
import Header from "../_components/Header";

const Wishlist = () => {
  const router = useRouter();
  const userId = localStorage.getItem("id");
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };

  const fetchWishDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
      );
      const user = await response.json();

      const updatedWishItems = await Promise.all(
        user.wishlist.map(async (wishItem: any) => {
          const productDetails = await fetchProductDetails(wishItem.product);
          return {
            ...productDetails,
            id: wishItem.product,
          };
        })
      );

      setWishlistItems(updatedWishItems);
    } catch (error) {
      console.error("Error fetching user wishlist:", error);
      toast.error("Error fetching wishlist. Please try again later.");
    }
  };

  useEffect(() => {
    fetchWishDetails();
  }, [userId]);

  const handleDelete = async (productId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/wishlist`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, product: productId }),
      });

      await fetchWishDetails();
      toast.success("Item removed from wishlist.");
    } catch (error) {
      console.error("Error deleting item from wishlist:", error);
      toast.error("Error deleting item from wishlist. Please try again later.");
    }
  };

  const add2Cart = async (productId: string) => {
    if (!userId) {
      console.error("User ID is not available.");
      router.push("/login");
      return;
    }

    try {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
      );
      const userResult = await userResponse.json();
      const isInCart = userResult.cart.find(
        (item: any) => item._id === productId
      );

      if (isInCart) {
        toast.info("Item already in Cart", {
          closeButton: false,
          pauseOnHover: false,
        });
      } else {
        const cartResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/cart`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              product: productId,
            }),
          }
        );

        if (cartResponse.ok) {
          toast.info("Item added to Cart", {
            closeButton: false,
            pauseOnHover: false,
          });
        } else {
          const errorResult = await cartResponse.json();
          console.error(
            "Error adding item to cart:",
            errorResult.error || "Unknown error"
          );
        }
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <Header title="My Wishlist" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-3">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 shadow rounded flex flex-row items-center justify-between text-xs md:text-base"
          >
            <div className="flex items-center">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.photo}`}
                alt={item.name}
                className="sm:size-24 size-20  object-cover mr-4"
              />
              <div>
                <h2 className="text-base md:text-lg font-semibold">
                  {item.name}
                </h2>
                <div className="flex items-center -ml-0.5">
                  <Rating
                    name="size-small"
                    readOnly
                    defaultValue={item.rating}
                    precision={0.5}
                    size="small"
                  />
                  &nbsp;
                  <p className="text-gray-600 -mt-1">({item.numOfRating})</p>
                </div>
                <p className="text-gray-600 mb-2">Rs: {item.price}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="p-2 bg-[#40773b] text-white rounded hover:bg-[#30512d]"
                onClick={() => add2Cart(item._id)}
              >
                Add to Cart
              </button>
              <div className="flex justify-center">
                <FaTrash
                  className="w-5 h-5 text-red-800 mr-4 cursor-pointer"
                  onClick={() => handleDelete(item._id)}
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
