"use client";
import React, { useState, useEffect } from "react";
import { TECarousel, TECarouselItem } from "tw-elements-react";

interface CarouselItem {
  lap: string[];
  mobile: string[];
}

export default function Carousel() {
  const [images, setImages] = useState<CarouselItem | null>(null);

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

  const renderCarouselItems = (items: string[]) =>
    items.length > 0 ? (
      items.map((item, index) => (
        <TECarouselItem
          key={index}
          itemID={index + 1}
          className="relative float-left -mr-[100%] hidden w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none"
        >
          <img
            src={item}
            className="block w-full"
            alt={`Carousel Image ${index}`}
          />
        </TECarouselItem>
      ))
    ) : (
      <p className="text-center text-green-700">Loading Images</p>
    );

  const CarouselComponent = ({ items }: { items: string[] }) => (
    <TECarousel showControls showIndicators ride="carousel">
      <div className="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
        {renderCarouselItems(items)}
      </div>
    </TECarousel>
  );

  return (
    <>
      <div className="hidden md:block w-full">
        {images && <CarouselComponent items={images.lap} />}
      </div>
      <div className="md:hidden w-full">
        {images && <CarouselComponent items={images.mobile} />}
      </div>
    </>
  );
}
