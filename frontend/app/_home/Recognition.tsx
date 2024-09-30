import React from "react";
import img1 from "@/assets/startupindia.png";
import img2 from "@/assets/Startuptn-logo.png";
import Image from "next/image";

export default function Recognition() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h4 className="text-[#40773b] text-2xl lg:text-4xl md:text-3xl sm:text-xl xl:text-4xl 2xl:text-4xl text-center">
        As seen and Recognised on
      </h4>

      <div className="m-6 flex justify-center items-center">
        <Image
          src={img1}
          alt=""
          style={{ width: "60%", maxWidth: "20rem", marginRight: "1rem" }}
        />
        <Image
          src={img2}
          alt=""
          style={{ width: "60%", maxWidth: "20rem", marginRight: "1rem" }}
        />
      </div>
    </div>
  );
}
