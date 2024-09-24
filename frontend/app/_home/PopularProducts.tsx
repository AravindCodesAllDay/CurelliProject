"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  photo: string;
  status: string;
  rating: number;
  numOfRating: number;
}

interface PopularProducts {
  _id: string;
  productId: string;
  tag: string;
}
interface PopularProductsData {
  _id: string;
  name: string;
  description: string;
  price: number;
  photo: string;
  status: string;
  rating: number;
  numOfRating: number;
  tag: string;
}

const PopularProducts: React.FC = () => {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const openPopup = (details: Product) => {
    router.push(`/shop/${details._id}`);
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
        (item: Product) => item._id === productId
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

  const add2Wishlist = async (productId: string) => {
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

      if (userResponse.ok) {
        if (
          userResult.wishlist.some((item: Product) => item._id === productId)
        ) {
          toast.info("Item already in wishlist");
        } else {
          const wishlistResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/wishlist`,
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

          if (wishlistResponse.ok) {
            toast.info("Item added to wishlist...!", {
              closeButton: false,
              pauseOnHover: false,
            });
          }
        }
      } else {
        console.error(
          "Error fetching user data:",
          userResult.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
    }
  };

  const [cardDetails, setCardDetails] = useState<PopularProductsData[]>([]);

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
        const popular: PopularProducts[] = await response.json();

        // Fetch all product data
        const productsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!productsResponse.ok) {
          throw new Error(`HTTP error! Status: ${productsResponse.status}`);
        }
        const products: Product[] = await productsResponse.json();

        const popularProducts: PopularProductsData[] = products
          .filter((item) => popular.some((pop) => pop.productId === item._id))
          .map((product) => {
            const productTag =
              popular.find((pop) => pop.productId === product._id)?.tag || "";
            return {
              ...product,
              tag: productTag,
            };
          });

        setCardDetails(popularProducts);
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
          key={details._id}
          className="relative w-full max-w-[290px] border-2 max-h-[400px] hover:shadow-2xl flex flex-col justify-between mx-2 lg:my-5 transition-shadow duration-150 ease-out"
          onMouseEnter={() => setHoveredCard(details._id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="relative max-h-[250px] w-100% h-100%">
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded">
              {details.tag}
            </div>
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${details.photo}`}
              alt="plant"
              className="w-full h-full object-cover hover:cursor-pointer"
              onClick={() => openPopup(details)}
            />
            <div
              className={`absolute top-4 right-4 flex flex-col gap-2 transition-all cursor-pointer ${
                hoveredCard === details._id ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="rounded-full bg-white p-3 shadow group"
                onClick={() => add2Wishlist(details._id)}
              >
                <FaHeart className="text-[#303030] duration-150 ease-out group-hover:scale-150 xs:size-3 sm:size-3 md:size-3 lg:size-4 xl:size-4 2xl:size-5" />
              </div>
              <div
                className="rounded-full bg-white p-3 shadow group"
                onClick={() => add2Cart(details._id)}
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
              <p className="text-gray-600 -mt-1 ">({details.numOfRating})</p>
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
