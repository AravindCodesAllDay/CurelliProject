import React, { useState } from "react";

export default function AddProduct() {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    photo: null,
    otherPhotos: [],
    description: "",
    rating: "",
    numOfRating: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("description", productData.description);
    formData.append("rating", productData.rating);
    formData.append("numOfRating", productData.numOfRating);

    if (productData.photo) {
      formData.append("photo", productData.photo);
    }

    productData.otherPhotos.forEach((file) => {
      formData.append("otherPhotos", file);
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
        name: "",
        price: "",
        photo: null,
        otherPhotos: [],
        description: "",
        rating: "",
        numOfRating: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Error adding product. Please try again.");
      setSuccess(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size < 1048576) {
      setProductData((prevData) => ({
        ...prevData,
        photo: file,
      }));
    } else {
      alert("File is too big! File must be less than 1 MB.");
    }
  };

  const handleImageChanges = (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      if (file.size > 1048576) {
        alert(
          `File ${file.name} is too big! Each file must be less than 1 MB.`
        );
        return;
      }
    }

    setProductData((prevData) => ({
      ...prevData,
      otherPhotos: [...prevData.otherPhotos, ...files],
    }));
  };

  return (
    <>
      <div className="flex justify-center mt-12">
        <h1 className="text-xl font-semibold font-content text-primecolor mt-2">
          Add your new product here
        </h1>
      </div>
      <div className="flex justify-center mt-6">
        <div className="flex flex-col">
          <form
            onSubmit={handleSubmit}
            className="shadow-lg p-7 rounded-lg gap-4"
          >
            <div className="flex w-full m-2 items-center">
              <label
                className="text-l font-semibold font-content text-primecolor"
                htmlFor="name"
              >
                Name:
              </label>
              <input
                className="w-96 shadow-md rounded p-2 bg-gray-50 font-content focus:outline-brown"
                type="text"
                placeholder="Enter the name"
                name="name"
                value={productData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex w-full m-2 items-center">
              <label
                className="text-l font-semibold font-content text-primecolor"
                htmlFor="price"
              >
                Price:
              </label>
              <input
                className="w-96 shadow-md rounded p-2 bg-gray-50 font-content focus:outline-brown"
                type="number"
                placeholder="Enter the price"
                name="price"
                value={productData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex w-full m-2 items-center">
              <label
                className="text-l font-semibold font-content text-primecolor"
                htmlFor="photo"
              >
                Photo (max:1mb):
              </label>
              <input
                className="w-96 shadow-md rounded p-2 bg-gray-50 font-content focus:outline-brown"
                type="file"
                name="photo"
                onChange={handleImageChange}
                required
              />
            </div>
            <div className="flex w-full m-2 items-center">
              <label
                className="text-l font-semibold font-content text-primecolor"
                htmlFor="otherPhotos"
              >
                Other Photos:
              </label>
              <input
                className="w-96 shadow-md rounded p-2 bg-gray-50 font-content focus:outline-brown"
                type="file"
                name="otherPhotos"
                multiple
                onChange={handleImageChanges}
              />
            </div>
            <div className="flex w-full m-2 items-center">
              <label
                className="text-l font-semibold font-content text-primecolor"
                htmlFor="description"
              >
                Description:
              </label>
              <input
                className="w-96 shadow-md rounded p-2 bg-gray-50 font-content focus:outline-brown"
                type="text"
                placeholder="Enter the description"
                name="description"
                value={productData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex w-full m-2 items-center">
              <label
                className="text-l font-semibold font-content text-primecolor"
                htmlFor="rating"
              >
                Rating (0-5):
              </label>
              <input
                className="w-96 shadow-md rounded p-2 bg-gray-50 font-content focus:outline-brown"
                type="number"
                min="0"
                max="5"
                placeholder="Enter the rating"
                name="rating"
                value={productData.rating}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex w-full m-2 items-center">
              <label
                className="text-l font-semibold font-content text-primecolor"
                htmlFor="numOfRating"
              >
                Number of Ratings:
              </label>
              <input
                className="w-96 shadow-md rounded p-2 bg-gray-50 font-content focus:outline-brown"
                type="number"
                placeholder="Enter the number of ratings"
                name="numOfRating"
                value={productData.numOfRating}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="shadow-md rounded py-1 px-2 mt-3 font-bold mx-auto text-primecolor bg-green-800 text-white font-content focus:outline-brown hover:bg-gray-100 hover:text-green-800"
            >
              Submit
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
          </form>
        </div>
      </div>
    </>
  );
}
