"use client";
import React, { useState, useEffect } from "react";
import Stars from "@/components/Stars";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  photos: string[];
  name: string;
  rating: number;
  ratingcount: number;
  price: number;
}

export default function Products() {
  const nav = useRouter();
  const [cardDetails, setCardDetails] = useState<Product[]>([]);

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

  function navigate(productId: string) {
    nav.push(`/admin/products/${productId}`);
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {cardDetails.map((details) => (
        <div
          key={details._id}
          className="card-container flex flex-row flex-wrap justify-center group/main"
        >
          <div className="relative w-full max-w-[290px] border-2 max-h-[400px] hover:shadow-2xl flex flex-col justify-between m-2 lg:my-5 transition-shadow duration-150 ease-out">
            <div
              className="relative  w-full h-full"
              onClick={() => navigate(details._id)}
            >
              <img
                src={details.photos[0]}
                alt={details.name}
                className="w-full h-full object-cover hover:cursor-pointer"
              />
            </div>
            <div className="p-4 cursor-default">
              <h2 className="xs:text-xs sm:text-xs md:text-sm lg:text-md xl:text-md 2xl:text-lg font-bold mb-2">
                {details.name}
              </h2>
              <div className="flex flex-row items-center gap-2 -ml-0.5">
                <Stars rating={details.rating} />
                <p className="text-gray-600 -mt-1 ">({details.ratingcount})</p>
              </div>
              <p className="text-green-600 font-bold xs:text-xs sm:text-xs md:text-sm lg:text-md xl:text-md 2xl:text-lg">
                Rs: {details.price}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
