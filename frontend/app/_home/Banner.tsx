import React from "react";
import img1 from "../_assets/UnmatchedQuality@AffordablePrice.jpg";
import Image from "next/image";

export default function Banner() {
  return (
    <div className="flex flex-col md:flex-row w-full items-center justify-center gap-4 py-14 p-5 relative bg-white">
      <div className="flex relative md:w-2/6">
        <Image
          className="w-full h-full object-cover rounded-md shadow border-b-8 border-r-8 border-[#277933] hover:scale-105 duration-150 ease-out hover:border-none"
          alt="Rectangle"
          src={img1}
        />
      </div>

      <div className="flex flex-col items-center gap-4 lg:w-4/6 text-justify">
        <p className="xs:text-xl sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-[#40773b] text-center">
          Unmatched Quality at Affordable Price
        </p>
        <div className="text-[#40773b]  xs:text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-center font-semibold mb-2">
          Only the Best
        </div>
        <p className="text-[#40773b] xs:text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl text-justify">
          The term &quot;Organic&quot; often carries a hefty price tag
          elsewhere. At our home, we offer an exception. Despite our commitment
          to authenticity and quality, our products are remarkably affordable.
          How? We grow our original organic ingredients in our very own farms.
          This direct connection from farm to table ensures not only unmatched
          quality but also keeps the prices within reach.
        </p>
      </div>
    </div>
  );
}
