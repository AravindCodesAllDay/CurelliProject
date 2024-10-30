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
    nav.push("/admin/popular/addpopular");
  }

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
        setImages(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <button onClick={navigate}>Add Product</button>
      <div className="w-full">
        <div className="grid grid-cols-4">
          {images &&
            images.lap.map((photo, index) => (
              <img src={photo} alt={`laptop image:${index + 1}`} key={index} />
            ))}
        </div>
      </div>
    </>
  );
}
