import React from "react";

export default function Footer() {
  return (
    <div className="bottom-0 left-0 w-full bg-white border-t-2 border-[#277933]">
      <div className="flex items-center justify-center relative min-w-[320px] min-h-[200px]">
        <div className="text-center">
          <p className="text-[#277933] text-2xl md:text-3xl tracking-wide leading-normal mb-2">
            Curelli Foods Pvt Ltd
          </p>
          <p className="text-[#277933] text-lg tracking-wide leading-normal mb-2">
            contact@curellifoods.com
          </p>
          <p className="text-[#277933] text-base tracking-wide leading-normal">
            © Curelli Foods 2023
          </p>
        </div>
      </div>
    </div>
  );
}
