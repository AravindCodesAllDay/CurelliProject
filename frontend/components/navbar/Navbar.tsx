"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import Dropdown from "./Dropdown";
import Search from "./Search";
import OffCanvasMenu from "./OffCanvasMenu";
import { FaShoppingBag, FaBars } from "react-icons/fa";

import img1 from "@/assets/Logo_02.png";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useUser();
  const [showOffCanvasMenu, setShowOffCanvasMenu] = useState(false);

  const accessCart = () => {
    if (token) {
      router.push("/cart");
    } else {
      toast.warning("Please log in to access your cart.", {
        position: "top-center",
      });
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full bg-white z-30">
      <div className="flex justify-center w-full">
        <Link href="/">
          <Image
            className="w-full p-2 h-[60px] md:h-[70px] 2xl:h-[80px]"
            alt="Logo"
            src={img1}
            priority
          />
        </Link>
      </div>

      <div className="flex items-center justify-between w-full relative bg-[#40773b] px-4">
        <div className="lg:hidden md:hidden">
          <FaBars
            className="size-[21px] sm:size-[23px] md:size-[25px] lg:size-[27px] xl:size-[27px] 2xl:size-[29px] text-white cursor-pointer"
            onClick={() => setShowOffCanvasMenu(!showOffCanvasMenu)}
          />
          <OffCanvasMenu
            isOpen={showOffCanvasMenu}
            onClose={() => setShowOffCanvasMenu(false)}
          />
        </div>

        <div className="hidden md:flex flex-grow gap-2 md:gap-3 lg:gap-4 2xl:gap-5 relative items-center">
          {["/", "/aboutus", "/shop", "/contact"].map((path, index) => {
            const labels = ["Home", "Our Story", "Our Products", "Contact"];
            return (
              <div
                key={index}
                className={`text-[16px] duration-150 ease-out ${
                  pathname === path
                    ? "text-[#6b986a]"
                    : "hover:text-[#6b986a] text-white"
                }`}
              >
                <Link href={path}>{labels[index]}</Link>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 sm:gap-5 h-12">
          <Search />
          <FaShoppingBag
            className="size-[21px] sm:size-[23px] md:size-[25px] lg:size-[27px] 2xl:size-[29px] text-white cursor-pointer"
            onClick={accessCart}
          />
          <Dropdown />
        </div>
      </div>
    </div>
  );
}
