"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import Dropdown from "./Dropdown";
import Search from "./Search";
import OffCanvasMenu from "./OffCanvasMenu";
import { FaShoppingBag, FaUser, FaBars } from "react-icons/fa";

import img1 from "../../_assets/Logo_02.png";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserIdPresent, setIsUserIdPresent] = useState(false);
  const [showOffCanvasMenu, setShowOffCanvasMenu] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("id");
      setUserId(storedUserId);
    }
  }, []);
  useEffect(() => {
    const handleSubmission = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
        );
        setIsUserIdPresent(response.ok);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      handleSubmission();
    }
  }, [userId]);

  const accessCart = () => {
    if (isUserIdPresent) {
      router.push("/cart");
    } else {
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
          <div
            className={`text-[16px] duration-150 ease-out ${
              pathname === "/"
                ? "text-[#6b986a]"
                : "hover:text-[#6b986a] text-white"
            }`}
          >
            <Link href="/">Home</Link>
          </div>
          <div
            className={`text-[16px] duration-150 ease-out ${
              pathname === "/aboutus"
                ? "text-[#6b986a]"
                : "hover:text-[#6b986a] text-white"
            }`}
          >
            <Link href="/aboutus">Our Story</Link>
          </div>
          <div
            className={`text-[16px] duration-150 ease-out ${
              pathname === "/shop"
                ? "text-[#6b986a]"
                : "hover:text-[#6b986a] text-white"
            }`}
          >
            <Link href="/shop">Our Products</Link>
          </div>
          <div
            className={`text-[16px] duration-150 ease-out ${
              pathname === "/contact"
                ? "text-[#6b986a]"
                : "hover:text-[#6b986a] text-white"
            }`}
          >
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-5 h-12">
          <Search />
          <FaShoppingBag
            className="size-[21px] sm:size-[23px] md:size-[25px] lg:size-[27px] 2xl:size-[29px] text-white cursor-pointer"
            onClick={accessCart}
          />
          {isUserIdPresent ? (
            <Dropdown />
          ) : (
            <Link href="/login">
              <FaUser className="size-[21px] sm:size-[23px] md:size-[25px] lg:size-[27px] 2xl:size-[29px] text-white" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
