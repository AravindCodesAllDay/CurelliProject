"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import img1 from "../_assets/Web_Image_03.jpg";
import Link from "next/link";

const Posters: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full bg-[#cddccb]">
      {/* Image container */}
      <div className="w-full lg:w-1/2">
        <Image
          className="shadow-lg w-full h-auto object-cover"
          src={img1}
          alt="flowers"
        />
      </div>

      {/* Text container */}
      <div className="flex flex-col w-full lg:w-1/2 justify-center items-center text-center p-4 gap-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold text-[#40773b]">
          GET TO KNOW US
        </h2>
        <p className="text-[#40773b] text-sm sm:text-base md:text-lg xl:text-xl text-justify">
          We believe in preserving the rich heritage of forgotten herbs while
          embracing the modern needs of health-conscious individuals. We are
          passionate about reviving traditional wisdom and bringing it to your
          table in the form of highly medicinal Vathals. Our range includes the
          rarest of herbs such as Pirandai, Sangupushpam, Avarampoo, and more,
          meticulously crafted into delectable Vathals that not only tantalize
          your taste buds but also nurture your well-being.
        </p>
        <Link
          href={"/aboutus"}
          className="text-[#40773b] py-1 px-4 rounded-md border-2 border-[#40773b] transition-colors duration-150 ease-in-out hover:text-white hover:bg-[#277933] text-base md:text-lg xl:text-xl 2xl:text-2xl"
        >
          More
        </Link>
      </div>
    </div>
  );
};

export default Posters;
