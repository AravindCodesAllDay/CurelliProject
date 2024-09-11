"use client";
import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import Image from "next/image";
import img2 from "../_assets/WhatsApp.png";

const ToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openWhatsApp = () => {
    const whatsappChatURL =
      "https://wa.me/" + process.env.NEXT_PUBLIC_WHATSAPPNUMBER;

    // Open the WhatsApp chat link in a new tab
    window.open(whatsappChatURL, "_blank");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${isVisible ? "visible" : "hidden"}`}>
        <div id="uparrow">
          <button
            className="bg-green-500 p-[10px] rounded-full group"
            onClick={scrollToTop}
          >
            <FaArrowUp className="h-6 w-6 text-white group-hover:scale-125" />
          </button>
        </div>
      </div>
      <div id="whatsapp-chat" className="mt-2">
        <button
          className="bg-green-500 text-white p-[10px] rounded-full group"
          onClick={openWhatsApp}
        >
          <Image
            src={img2}
            alt="whatsapp logo"
            className="w-6 group-hover:scale-125"
          />
        </button>
      </div>
    </div>
  );
};

export default ToTop;
