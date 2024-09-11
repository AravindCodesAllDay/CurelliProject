import React from "react";
import AboutBanner from "./AboutBanner";
import AboutDetails from "./AboutDetails";
import AboutContact from "./AboutContact";
import Footer from "../_components/Footer";
import ToTop from "../_components/ToTop";

export default function AboutUs() {
  return (
    <>
      <div className="sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 lg:bg-[#CDDCCB] bg-white">
        <AboutBanner />
        <AboutDetails />
        <AboutContact />
      </div>
      <Footer />
      <ToTop />
    </>
  );
}
