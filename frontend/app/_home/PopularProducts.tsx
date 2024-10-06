"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";

interface PopularProductsData {
  productId: string;
  name: string;
  description: string;
  price: number;
  photos: string;
  status: string;
  rating: number;
  ratingcount: number;
  tag: string;
}

const PopularProducts: React.FC = () => {
  const router = useRouter();
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const [cardDetails, setCardDetails] = useState<PopularProductsData[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const openPopup = (details: PopularProductsData) => {
    router.push(`/shop/${details.productId}`);
  };

  const handleAddToCartOrWishlist = async (path: string, productId: string) => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/users/${path}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, productId }),
        }
      );

      if (listResponse.status === 409) {
        toast.info(`Item already in ${path}`, {
          closeButton: false,
          pauseOnHover: true,
        });
      } else if (listResponse.ok) {
        toast.success(`Item added to ${path}`, {
          closeButton: false,
          pauseOnHover: true,
        });
      } else {
        const errorResult = await listResponse.json();
        throw new Error(errorResult.error || `Error adding item to ${path}`);
      }
    } catch (error) {
      toast.error(`Failed to add item to ${path}`, {
        closeButton: false,
        pauseOnHover: true,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bestseller`,
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
        const data = await response.json();
        console.log(data);
        setCardDetails(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="overflow-x-auto flex justify-between md:justify-around">
      {cardDetails.map((details) => (
        <div
          key={details.productId}
          className="relative w-full max-w-[290px] border-2 max-h-[400px] hover:shadow-2xl flex flex-col justify-between mx-2 lg:my-5 transition-shadow duration-150 ease-out"
          onMouseEnter={() => setHoveredCard(details.productId)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="relative max-h-[250px] w-100% h-100%">
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded">
              {details.tag}
            </div>
            <img
              src={details.photos[0]}
              alt={details.name}
              className="w-full h-full object-cover hover:cursor-pointer"
              onClick={() => openPopup(details)}
            />
            <div
              className={`absolute top-4 right-4 flex flex-col gap-2 transition-all cursor-pointer ${
                hoveredCard === details.productId ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="rounded-full bg-white p-3 shadow group"
                onClick={() =>
                  handleAddToCartOrWishlist("wishlist", details.productId)
                }
              >
                <FaHeart className="text-[#303030] duration-150 ease-out group-hover:scale-150 xs:size-3 sm:size-3 md:size-3 lg:size-4 xl:size-4 2xl:size-5" />
              </div>
              <div
                className="rounded-full bg-white p-3 shadow group"
                onClick={() =>
                  handleAddToCartOrWishlist("cart", details.productId)
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
              <p className="text-gray-600 -mt-1 ">({details.ratingcount})</p>
            </div>
            <p className="text-green-600 font-bold xs:text-xs sm:text-xs md:text-sm lg:text-md xl:text-md 2xl:text-lg">
              Rs: {details.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PopularProducts;
