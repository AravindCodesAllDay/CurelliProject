import React from "react";
import img from "../_assets/AboutUs.jpg";
import img1 from "../_assets/facebook.png";
import img2 from "../_assets/instagram.png";
import img3 from "../_assets/linkedin.png";
import Image from "next/image";

export default function AboutBanner() {
  return (
    <div className="px-4 md:px-8 py-6 md:py-12 relative bg-white">
      <div className="flex flex-col items-center justify-center md:space-x-8 max-w-screen-xl mx-auto">
        <div className="flex flex-col gap-6">
          <h2 className="font-semibold text-[#40773b] text-xl md:text-4xl tracking-wide leading-normal">
            A Mother's Legacy: From Family Favourite to Empowering Mission
          </h2>
          <p className="font-normal text-[#40773b] text-base md:text-lg tracking-normal leading-normal text-justify">
            Deep in the heart of Kanyakumari, a coastal town at the southernmost
            tip of India, a mother's love sparked a journey of tradition,
            empowerment, and wellbeing. In 1996, she crafted a unique vathal,
            bursting with flavor and health benefits, originally intended for
            her family's table. The taste, however, transcended its intended
            audience, captivating neighbours and relatives alike. This was the
            seed of Curelli Foods, a company founded by her son, carrying his
            mother's legacy forward.
          </p>
          <div className="flex flex-col lg:flex-row xl:flex-row 2xl:flex-row items-center">
            <Image
              className=" flex justify-center w-full max-h-96 md:w-auto h-auto rounded-md hover:scale-105 mb-6 md:mb-0 md:mr-8 duration-150 ease-out max-w-md"
              alt="Pancakes"
              src={img}
            />
            <div className="flex flex-col items-center">
              <div className="text-[#40773b] text-base md:text-lg tracking-normal leading-normal text-justify p-4">
                <h3 className="font-semibold text-lg md:text-3xl tracking-wide leading-normal mb-2">
                  Women empowerment
                </h3>
                <p>
                  Curelli Foods is more than just a food products company; it's
                  a celebration of women's power. From cultivating crops to
                  processing and packaging, every step is guided by skilled
                  female hands. This embodies the founder's mother's dream - to
                  create a safe and supportive environment where women can
                  thrive.
                </p>
              </div>
              <div className="font-normal text-[#40773b] text-base md:text-lg tracking-normal leading-normal text-justify p-4">
                <h3 className="font-semibold text-[#40773b] text-lg md:text-3xl tracking-wide leading-normal mb-2">
                  Reviving forgotten traditions
                </h3>
                <p>
                  But the mission doesn't stop there. Curelli Foods fights to
                  preserve ancient wisdom, recognizing the fading knowledge of
                  traditional herbal remedies used by our ancestors. Many of
                  these ingredients are endangered, forgotten by younger
                  generations and neglected by farmers. To combat this, Curelli
                  Foods partners with farmers, helping them cultivate and
                  harvest these precious ingredients. Curelli Foods also offer
                  training programs, empowering farmers with the knowledge to
                  grow and market these valuable herbs, ensuring their
                  sustainability for future generations.
                </p>
              </div>
            </div>
          </div>
          <div className="font-normal text-[#40773b] text-base md:text-lg tracking-normal leading-normal text-justify">
            <p>
              We specialize in organic vathals and other handcrafted products,
              all free from artificial ingredients and preservatives. We believe
              in making healthy eating accessible, offering a variety of options
              that fit any budget and lifestyle
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.instagram.com/curellifoods?igsh=cXlidmxhbm91cGto&utm_source=qr"
              target="_blank"
            >
              <Image
                className="size-7 hover:scale-110"
                alt="Instagram"
                src={img2}
              />
            </a>
            <a href="https://www.facebook.com/curellifoods" target="_blank">
              <Image
                className="size-7 hover:scale-110"
                alt="Facebook"
                src={img1}
              />
            </a>
            <a
              href="https://www.linkedin.com/company/curellifoods/"
              target="_blank"
            >
              <Image
                className="size-7 hover:scale-110"
                alt="LinkedIn"
                src={img3}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
