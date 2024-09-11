"use client";
import React, { useState, useEffect } from "react";
import { TECarousel, TECarouselItem } from "tw-elements-react";

interface CarouselItem {
  _id: string;
  name: string;
  photo: string;
  index: number;
  mobile: boolean;
}

export default function Carousel() {
  const [carouselLap, setCarouselLap] = useState<CarouselItem[]>([]);
  const [carouselMobile, setCarouselMobile] = useState<CarouselItem[]>([]);

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

        const products: CarouselItem[] = await response.json();

        const lapItems = products.filter((item) => !item.mobile);
        const mobileItems = products.filter((item) => item.mobile);
        lapItems.sort((a, b) => a.index - b.index);
        mobileItems.sort((a, b) => a.index - b.index);
        setCarouselLap(lapItems);
        setCarouselMobile(mobileItems);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const renderCarouselItems = (items: CarouselItem[]) =>
    items.length > 0 ? (
      items.map((item, index) => (
        <TECarouselItem
          key={item._id}
          itemID={index + 1}
          className="relative float-left -mr-[100%] hidden w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none"
        >
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/carouselImg/${item.photo}`}
            className="block w-full"
            alt={item.name || "Carousel Image"}
          />
        </TECarouselItem>
      ))
    ) : (
      <p className="text-center text-green-700">Loading Images</p>
    );

  const CarouselComponent = ({ items }: { items: CarouselItem[] }) => (
    <TECarousel showControls showIndicators ride="carousel">
      <div className="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
        {renderCarouselItems(items)}
      </div>
    </TECarousel>
  );

  return (
    <>
      <div className="hidden md:block w-full">
        <CarouselComponent items={carouselLap} />
      </div>
      <div className="md:hidden w-full">
        <CarouselComponent items={carouselMobile} />
      </div>
    </>
  );
}
