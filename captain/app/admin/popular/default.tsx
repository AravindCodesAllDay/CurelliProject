"use client";
import Stars from "@/components/Stars";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface PopularProductsData {
  productId: string;
  name: string;
  description: string;
  price: number;
  photos: string[];
  status: string;
  rating: number;
  ratingcount: number;
  tag: string;
}

export default function PopularProducts() {
  const nav = useRouter();
  const [cardDetails, setCardDetails] = useState<PopularProductsData[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  function navigate() {
    nav.push("/admin/popular/addpopular");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error("API URL is missing in environment variables");
        }

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
        setCardDetails(data);
      } catch (error) {
        setFetchError("Failed to fetch products. Please try again later.");
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <button onClick={navigate}>Add Product</button>
      {fetchError && <div className="text-red-600 mt-2 mb-4">{fetchError}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardDetails.map((details) => (
          <div
            key={details.productId}
            className="relative w-full max-w-[290px] border-2 max-h-[400px] hover:shadow-2xl flex flex-col justify-between mx-2 lg:my-5 transition-shadow duration-150 ease-out"
          >
            <div className="relative max-h-[250px] w-full h-full">
              <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded">
                {details.tag}
              </div>
              <img
                src={details.photos[0]}
                alt={details.name}
                className="w-full h-full object-cover hover:cursor-pointer"
              />
            </div>
            <div className="p-4 cursor-default">
              <h2 className="text-md font-bold mb-2">{details.name}</h2>
              <div className="flex flex-row items-center">
                <Stars rating={details.rating} />
                <p className="text-gray-600 ml-2">({details.ratingcount})</p>
              </div>
              <p className="text-green-600 font-bold">Rs: {details.price}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
