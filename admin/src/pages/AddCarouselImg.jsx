import React, { useState } from "react";

export default function AddCarouselImg() {
  const [productData, setProductData] = useState({
    laptopPhotos: [],
    mobilePhotos: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    productData.laptopPhotos.forEach((file) => {
      formData.append("laptopPhotos", file);
    });
    productData.mobilePhotos.forEach((file) => {
      formData.append("mobilePhotos", file);
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_API}products`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      setSuccess("Product added successfully!");
      setError(null);

      setProductData({
        laptopPhotos: [],
        mobilePhotos: [],
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Error adding product. Please try again.");
      setSuccess(null);
    }
  };

  const handleImageChanges = (e) => {
    const { name } = e.target;
    const files = Array.from(e.target.files);

    for (const file of files) {
      if (file.size > 1048576) {
        alert(
          `File ${file.name} is too big! Each file must be less than 1 MB.`
        );
        return;
      }
    }

    switch (name) {
      case "laptopPhotos":
        setProductData((prevData) => ({
          ...prevData,
          laptopPhotos: [...prevData.laptopPhotos, ...files],
        }));
        break;
      case "mobilePhotos":
        setProductData((prevData) => ({
          ...prevData,
          mobilePhotos: [...prevData.mobilePhotos, ...files],
        }));
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="flex justify-center mt-12">
        <h1 className="text-xl font-semibold font-content text-primecolor">
          Upload Carousel Images
        </h1>
      </div>
      <div className="flex justify-center mt-6">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="shadow-lg p-5 rounded-lg flex flex-col"
        >
          <div className="flex w-full m-2 items-center">
            <label
              className="text-l font-semibold font-content text-primecolor"
              htmlFor="laptopPhotos"
            >
              Laptop Carousels:
            </label>
            <input
              className="w-96 shadow-md rounded p-2 bg-gray-50 font-content focus:outline-brown"
              type="file"
              name="laptopPhotos"
              multiple
              onChange={handleImageChanges}
            />
          </div>
          <div className="flex w-full m-2 items-center">
            <label
              className="text-l font-semibold font-content text-primecolor"
              htmlFor="mobilePhotos"
            >
              Mobile Carousels:
            </label>
            <input
              className="w-96 shadow-md rounded p-2 bg-gray-50 font-content focus:outline-brown"
              type="file"
              name="mobilePhotos"
              multiple
              onChange={handleImageChanges}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className=" shadow-md rounded py-1 px-2 mt-3 font-bold mx-auto text-primecolor bg-green-800 text-white font-content focus:outline-brown hover:bg-gray-100 hover:text-green-800"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
