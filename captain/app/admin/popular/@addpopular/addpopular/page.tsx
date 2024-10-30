"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Modal from "@/components/Modal";

interface FormData {
  productId: string;
  tag: string;
}

interface Product {
  _id: string;
  photos: string[];
  name: string;
  rating: number;
  ratingcount: number;
  price: number;
}

export default function AddProductForm() {
  const nav = useRouter();
  const [productDetails, setProductDetails] = useState<Product[]>([]);
  const [formData, setFormData] = useState<FormData[]>([
    { productId: "", tag: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updatedFormData = [...formData];
    updatedFormData[index] = {
      ...updatedFormData[index],
      [e.target.name]: e.target.value,
    };
    setFormData(updatedFormData);

    // Add a new field if the current last field is fully filled
    const lastItem = updatedFormData[updatedFormData.length - 1];
    if (lastItem.productId && lastItem.tag && index === formData.length - 1) {
      setFormData([...updatedFormData, { productId: "", tag: "" }]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/bestseller`,
        { products: formData.filter((data) => data.productId && data.tag) },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Bestsellers added:", response.data);
      setSuccess(true);
      setFormData([{ productId: "", tag: "" }]);
      nav.push("/admin/popular");
    } catch (error) {
      console.error("Error adding product:", error);
      setError("There was an error adding the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();
        setProductDetails(products);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  // Filter out already selected product IDs for each select dropdown
  const getAvailableProducts = (currentIndex: number) => {
    const selectedProductIds = formData
      .slice(0, currentIndex)
      .map((data) => data.productId);
    return productDetails.filter(
      (product) => !selectedProductIds.includes(product._id)
    );
  };

  return (
    <Modal>
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Add Bestseller
        </h2>
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-600 bg-green-100 p-3 rounded">
            Bestseller added successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {formData.map((data, index) => (
            <div key={index} className="flex items-center space-x-2">
              <select
                name="productId"
                value={data.productId}
                onChange={(e) => handleChange(index, e)}
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>
                  Select Product
                </option>
                {getAvailableProducts(index).map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="tag"
                value={data.tag}
                onChange={(e) => handleChange(index, e)}
                placeholder="Tag"
                className="block w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Adding Products..." : "Add Products"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
