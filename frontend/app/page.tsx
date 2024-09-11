import React from "react";
import Footer from "./_components/Footer";
import Banner from "./_home/Banner";
import Posters from "./_home/Posters";
import Carousels from "./_home/Carousel";
import Tagline from "./_home/Tagline";
import ToTop from "./_components/ToTop";
import PopularProducts from "./_home/PopularProducts";
import Recognition from "./_home/Recognition";
import FollowUs from "./_home/FollowUs";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-12">
        <Carousels />
        <Tagline />
        <PopularProducts />
        <FollowUs />
        <Posters />
        <Banner />
        <Recognition />
        <Footer />
      </div>
      <ToTop />
    </>
  );
}
