"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Rating from "@mui/material/Rating";
import { ToastContainer, toast } from "react-toastify";

interface Product {
  _id: string;
  photo: string;
  name: string;
  rating: number;
  numOfRating: number;
  price: number;
}

export default function Products() {
  const router = useRouter();
  const [cardDetails, setCardDetails] = useState<Product[]>([]);
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();
        setCardDetails(products);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const openPopup = (details: Product) => {
    router.push(`/shop/${details._id}`);
  };

  const handleAddToCartOrWishlist = async (
    url: string,
    productId: string,
    message: string
  ) => {
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

      if (!userResponse.ok) {
        throw new Error(userResult.error || "Unknown error");
      }

      const isInList =
        userResult.cart.find(
          (item: { _id: string }) => item._id === productId
        ) ||
        userResult.wishlist.find(
          (item: { product: string }) => item.product === productId
        );

      if (isInList) {
        toast.info(`Item already in ${message}`, {
          closeButton: false,
          pauseOnHover: false,
        });
      } else {
        const listResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${url}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, product: productId }),
          }
        );

        if (listResponse.ok) {
          const listResult = await listResponse.json();
          toast.info(`Item added to ${message}`, {
            closeButton: false,
            pauseOnHover: false,
          });
        } else {
          const errorResult = await listResponse.json();
          throw new Error(errorResult.error || "Unknown error");
        }
      }
    } catch (error) {
      console.error(`
        Error adding item to ${message.toLowerCase()}:,
        error`);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {cardDetails.map((details) => (
          <div
            key={details._id}
            className="card-container flex flex-row flex-wrap justify-center group/main"
          >
            <div className="relative w-full max-w-[290px] border-2 max-h-[400px] hover:shadow-2xl flex flex-col justify-between m-2 lg:my-5 transition-shadow duration-150 ease-out">
              <div className="relative max-h-[250px] w-full h-full">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${details.photo}`}
                  alt="plant"
                  className="w-full h-full object-cover hover:cursor-pointer"
                  onClick={() => openPopup(details)}
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2 transition-all cursor-pointer opacity-0 group-hover/main:opacity-100">
                  <div
                    className="rounded-full bg-white p-3 shadow group"
                    onClick={() =>
                      handleAddToCartOrWishlist(
                        "wishlist",
                        details._id,
                        "Wishlist"
                      )
                    }
                  >
                    <FaHeart className="text-[#303030] duration-150 ease-out group-hover:scale-150 xs:size-3 sm:size-3 md:size-3 lg:size-4 xl:size-4 2xl:size-5" />
                  </div>
                  <div
                    className="rounded-full bg-white p-3 shadow group"
                    onClick={() =>
                      handleAddToCartOrWishlist("cart", details._id, "Cart")
                    }
                  >
                    <FaShoppingCart className="text-[#303030] duration-150 ease-out group-hover:scale-150 xs:size-3 sm:size-3 md:size-3 lg:size-4 xl:size-4 2xl:size-5" />
                  </div>
                </div>
              </div>
              <div className="p-4 cursor-default">
                <h2 className="xs:text-xs sm:text-xs md:text-sm lg:text-md xl:text-md 2xl:text-lg font-bold mb-2">
                  {details.name}
                </h2>
                <div className="flex flex-row -ml-0.5">
                  <Rating
                    name="size-small"
                    readOnly
                    defaultValue={details.rating}
                    precision={0.5}
                    size="small"
                  />
                  &nbsp;
                  <p className="text-gray-600 -mt-1 ">
                    ({details.numOfRating})
                  </p>
                </div>
                <p className="text-green-600 font-bold xs:text-xs sm:text-xs md:text-sm lg:text-md xl:text-md 2xl:text-lg">
                  Rs: {details.price}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
