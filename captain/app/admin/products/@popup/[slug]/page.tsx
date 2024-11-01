"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import Stars from "@/components/Stars";

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

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      ) : (
        details && (
          <Modal>
            <div className="bg-white relative rounded-lg w-full flex flex-col sm:flex-col md:flex-row justify-center items-center m-2 p-2 sm:p-4 md:p-3 lg:p-4 xl:p-6 2xl:p-8 sm:m-4 xl:m-6 2xl:m-8">
              <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2 flex items-center justify-center">
                {details?.photos && (
                  <img
                    src={details.photos[0]}
                    alt="Product"
                    className="max-w-full h-auto"
                  />
                )}
              </div>

              <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2 flex flex-col justify-center m-2">
                <h2 className="text-2xl font-semibold mb-2">{details.name}</h2>
                <p className="text-gray-600 mb-4">{details.description}</p>
                <div className="flex items-center -ml-0.5">
                  <Stars rating={details.rating} />
                  &nbsp;
                  <p className="text-gray-600">({details.ratingcount})</p>
                </div>
                <p className="text-green-600 font-semibold mb-4">
                  Rs: {details.price}
                </p>
              </div>
            </div>
          </Modal>
        )
      )}
    </>
  );
}
