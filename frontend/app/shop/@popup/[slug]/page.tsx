"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";

import Modal from "@/components/Modal";

interface ProductDetails {
  _id: string;
  photos: string[];
  name: string;
  description: string;
  rating: number;
  ratingcount: number;
  price: number;
}

export default function PopupCard({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const slug = params.slug;

  const [details, setDetails] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;

  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`
        );
        if (!response.ok) {
          console.log("Failed to fetch product data");
          router.push("/shop");
        }
        const productData: ProductDetails = await response.json();
        setDetails(productData);
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [slug, router]);

  const handleAddToCartOrWishlist = async (path: string, productId: string) => {
    if (!userId) {
      toast.warn("Please login to continue", {
        closeButton: false,
        pauseOnHover: true,
      });
      router.push("/login");
      return;
    }

    try {
      const listResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${path}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, productId }),
        }
      );

      if (listResponse.status === 409) {
        toast.info(`Item already in ${path}`, {
          closeButton: false,
          pauseOnHover: true,
        });
      } else if (listResponse.ok) {
        toast.success(`Item added to ${path}`, {
          closeButton: false,
          pauseOnHover: true,
        });
      } else {
        const errorResult = await listResponse.json();
        throw new Error(errorResult.error || `Error adding item to ${path}`);
      }
    } catch (error) {
      toast.error(`Failed to add item to ${path}`, {
        closeButton: false,
        pauseOnHover: true,
      });
    }
  };

  const closePopup = () => {
    router.push("/shop", undefined);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p> {/* You can replace this with a loader component */}
        </div>
      ) : (
        <Modal>
          <div className="bg-white relative rounded-lg w-full flex flex-col sm:flex-col md:flex-row justify-center items-center m-2 p-2 sm:p-4 md:p-3 lg:p-4 xl:p-6 2xl:p-8 sm:m-4 xl:m-6 2xl:m-8">
            {/* Close Button */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8 absolute right-0 top-0 m-3 md:m-5 cursor-pointer"
              onClick={closePopup}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>

            {/* Product Image */}
            <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2 flex items-center justify-center">
              {details?.photos && (
                <img
                  src={details.photos[0]}
                  alt="Product"
                  className="max-w-full h-auto"
                />
              )}
            </div>

            {/* Product Info */}
            <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2 flex flex-col justify-center m-2">
              <h2 className="text-2xl font-semibold mb-2">{details?.name}</h2>
              <p className="text-gray-600 mb-4">{details?.description}</p>
              <div className="flex items-center -ml-0.5">
                <Rating
                  name="size-small"
                  readOnly
                  value={details?.rating || 0}
                  precision={0.5}
                  size="medium"
                />
                &nbsp;
                <p className="text-gray-600">({details?.ratingcount})</p>
              </div>
              <p className="text-green-600 font-semibold mb-4">
                Rs: {details?.price}
              </p>

              <div className="flex gap-1 items-center">
                <button
                  className="bg-[#277933] text-white px-4 py-2 rounded-md"
                  onClick={() =>
                    details?._id &&
                    handleAddToCartOrWishlist("cart", details._id)
                  }
                >
                  Add to Cart
                </button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-10 border-2 p-1 rounded-md cursor-pointer"
                  onClick={() =>
                    details?._id &&
                    handleAddToCartOrWishlist("wishlist", details._id)
                  }
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
