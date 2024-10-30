"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Modal from "@/components/Modal";

interface FormData {
  type: boolean;
  images: FileList | null;
}

export default function AddProductForm() {
  const nav = useRouter();
  const [formData, setFormData] = useState<FormData>({
    type: false,
    images: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value === "true",
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      images: e.target.files,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const data = new FormData();
    data.append("type", String(formData.type));
    if (formData.images) {
      for (let i = 0; i < formData.images.length; i++) {
        data.append("images", formData.images[i]);
      }
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/carousel`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product added:", response.data);
      setSuccess(true);

      setFormData({
        type: false,
        images: null,
      });
      nav.push("/admin/carousel");
    } catch (error) {
      console.error("Error adding product:", error);
      setError("There was an error adding the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal>
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Change Carousel
        </h2>
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-600 bg-green-100 p-3 rounded">
            Carousel Changed successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product type
            </label>
            <select
              name="type"
              value={String(formData.type)}
              onChange={handleChange}
              className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="false">Laptop</option>
              <option value="true">Mobile</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Carousel Images
            </label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleFileChange}
              required
              className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
