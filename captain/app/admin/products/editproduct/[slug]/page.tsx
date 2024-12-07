"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Modal from "@/components/Modal";

interface FormData {
  name: string;
  price: string;
  description: string;
  status: string;
  rating: string;
  ratingcount: string;
  sku: string;
  hsn: string;
  weight: string;
  length: string;
  breadth: string;
  height: string;
  images: FileList | null;
  imagePreviews: string[];
}

interface ProductDetails {
  _id: string;
  photos: string[];
  name: string;
  description: string;
  status: string;
  rating: number;
  ratingcount: number;
  price: number;
  sku: string;
  hsn: number;
  weight: number;
  length: number;
  breadth: number;
  height: number;
}

export default function UpdateProductForm({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: "",
    description: "",
    rating: "",
    ratingcount: "",
    status: "",
    sku: "",
    hsn: "",
    weight: "",
    length: "",
    breadth: "",
    height: "",
    images: null,
    imagePreviews: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`
        );
        const productData: ProductDetails = response.data;

        setFormData({
          name: productData.name || "",
          price: productData.price?.toString() || "",
          description: productData.description || "",
          rating: productData.rating?.toString() || "",
          ratingcount: productData.ratingcount?.toString() || "",
          sku: productData.sku?.toString() || "",
          hsn: productData.hsn?.toString() || "",
          weight: productData.weight?.toString() || "",
          length: productData.length?.toString() || "",
          breadth: productData.breadth?.toString() || "",
          height: productData.height?.toString() || "",
          imagePreviews: productData.photos || [],
          status: productData.status || "",
          images: null,
        });
      } catch (error) {
        console.error("Error fetching product data:", error);
        router.push("/admin/products");
      }
    };

    fetchProductData();
  }, [slug, router]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imagePreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );

      setFormData({
        ...formData,
        images: files,
        imagePreviews,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("rating", formData.rating);
    data.append("ratingcount", formData.ratingcount);
    data.append("status", formData.status);
    data.append("sku", formData.sku);
    data.append("hsn", formData.hsn);
    data.append("weight", formData.weight);
    data.append("length", formData.length);
    data.append("breadth", formData.breadth);
    data.append("height", formData.height);

    if (formData.images) {
      for (let i = 0; i < formData.images.length; i++) {
        data.append("images", formData.images[i]);
      }
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Product updated successfully:", response.data);
        setSuccess(true);
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("There was an error updating the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal>
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Edit Product
        </h2>
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-600 bg-green-100 p-3 rounded">
            Product updated successfully!
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[600px] overflow-y-auto"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <input
              type="number"
              name="rating"
              min={0}
              max={5}
              placeholder="0-5"
              value={formData.rating}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rating Count
            </label>
            <input
              type="number"
              name="ratingcount"
              value={formData.ratingcount}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={String(formData.status)}
              onChange={handleChange}
              className="mt-1 p-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="inStock">inStock</option>
              <option value="noStock">noStock</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sku
            </label>
            <input
              type="text"
              name="sku"
              placeholder="stock keeping unit"
              value={formData.sku}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hsn
            </label>
            <input
              type="text"
              name="hsn"
              placeholder="Harmonized System of Nomenclature"
              value={formData.hsn}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight
            </label>
            <input
              type="number"
              name="weight"
              placeholder="in gm"
              min={0}
              value={formData.weight}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Length
            </label>
            <input
              type="number"
              name="length"
              placeholder="in cm"
              min={0}
              value={formData.length}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Breadth
            </label>
            <input
              type="number"
              name="breadth"
              placeholder="in cm"
              min={0}
              value={formData.breadth}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Height
            </label>
            <input
              type="number"
              name="height"
              placeholder="in cm"
              min={0}
              value={formData.height}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Images
            </label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleFileChange}
              className="mt-1 p-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {formData.imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {formData.imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md shadow-sm"
                />
              ))}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Updating Product..." : "Update Product"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
