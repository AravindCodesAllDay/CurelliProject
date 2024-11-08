"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface CarouselItem {
  lap: string[];
  mobile: string[];
}

export default function Carousel() {
  const nav = useRouter();
  const [images, setImages] = useState<CarouselItem | null>(null);

  function navigate() {
    nav.push("/admin/carousel/addcarousel");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/carousel`,
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
        setImages(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div
        className="bg-green-600 p-2 m-5 rounded
       flex items-center justify-center font-bold"
      >
        <h2 className="text-lg text-white">Carousel Page</h2>
        <button
          className="bg-green-800 flex gap-1 justify-center items-center rounded ml-auto p-1 border-2 text-sm text-white"
          onClick={navigate}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="size-6"
            stroke-width="2"
          >
            <path d="M12 15l8.385 -8.415a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3z"></path>
            <path d="M16 5l3 3"></path>
            <path d="M9 7.07a7 7 0 0 0 1 13.93a7 7 0 0 0 6.929 -6"></path>
          </svg>
          Change Carousel
        </button>
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <h4 className="font-bold text-xl">Desktop Carousels</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          {images &&
            images.lap.map((photo, index) => (
              <img src={photo} alt={`laptop image:${index + 1}`} key={index} />
            ))}
        </div>

        <h4 className="font-bold text-xl">Mobile Carousels</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 p-2 gap-2">
          {images &&
            images.mobile.map((photo, index) => (
              <img src={photo} alt={`mobile image:${index + 1}`} key={index} />
            ))}
        </div>
      </div>
    </>
  );
}
