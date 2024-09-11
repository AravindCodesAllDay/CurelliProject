import React from "react";

export default function AboutContact() {
  return (
    <div className="flex flex-col items-center justify-center p-6 mt-6 relative bg-white">
      <div className="max-w-4xl w-full">
        <div className="font-bold text-[#40773b] text-2xl md:text-3xl lg:text-4xl tracking-wide leading-normal mb-4 text-center">
          Contact
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
          <p className="font-normal text-[#40773b] text-base md:text-lg tracking-normal leading-normal text-center sm:text-left">
            No.705/3B of Chenbagaramanputhoor Road, Sahayanagar, Thovalai
            Village,
            <br />
            Shanmugapuram, Kanyakumari district,
            <br />
            Tamil Nadu - 629302
          </p>
          <div className="flex flex-col items-center sm:items-start">
            <a
              className="font-normal text-[#40773b] text-base md:text-lg tracking-normal leading-normal underline"
              href="mailto:info@mysite.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              contact@curellifoods.com
            </a>
            <div className="font-normal text-[#40773b] text-base md:text-lg lg:text-xl tracking-normal leading-normal">
              08668157699
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
