import React from "react";
import Map from "./Map";

export default function ContactDetails() {
  return (
    <>
      <div className="container p-6 flex flex-col text-center mx-auto">
        <p className="text-[#277933] text-center text-3xl">CONTACT US</p>
        <p className="text-[#277933] text-center font-light text-xl mt-4">
          No.705/3B of Chenbagaramanputhoor Road, Sahayanagar, Thovalai Village,
        </p>
        <p className="text-[#277933] text-center font-light text-xl">
          Shanmugapuram, Kanyakumari district, Tamil Nadu - 629302
        </p>
        <p className="text-[#277933] text-center font-light text-xl mt-2">
          contact@curellifoods.com
        </p>
        <p className="text-[#277933] text-center font-light text-xl mt-2">
          +91 8668157699
        </p>
      </div>

      <Map />

      <div className="flex flex-row items-center py-10 relative bg-[#c9ddca] justify-center">
        <div className="max-w-4xl text-center">
          <p className="text-[#277933] text-3xl md:text-4xl tracking-normal leading-normal mb-4">
            OPENING HOURS
          </p>
          <p className="text-[#277933] text-base tracking-normal leading-normal">
            Monday - Friday
            <br />
            9:00am - 8:00pm
            <br />
            <br />
            Saturday and Sunday
            <br />
            10:00am - 5:00pm
          </p>
        </div>
      </div>
    </>
  );
}
