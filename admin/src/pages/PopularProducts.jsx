import React, { useState, useEffect } from "react";

export default function PopularProducts() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    popularproduct1: "",
    popularProductOneTag: "",
    popularproduct2: "",
    productTwoTag: "",
    popularproduct3: "",
    productThreeTag: "",
    popularproduct4: "",
    productFourTag: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API}products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();
        setProducts(products);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmission = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API}bestseller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          popularproduct1: formData.popularproduct1,
          popularProductOneTag: formData.popularProductOneTag,
          popularproduct2: formData.popularproduct2,
          productTwoTag: formData.productTwoTag,
          popularproduct3: formData.popularproduct3,
          productThreeTag: formData.productThreeTag,
          popularproduct4: formData.popularproduct4,
          productFourTag: formData.productFourTag,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
      } else {
        console.error("Failed to add popular products");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="w-screen flex flex-col items-center justify-center">
      <h2 className="mt-12 font-semibold text-2xl">Popular Products</h2>
      <form
        onSubmit={handleSubmission}
        className="flex flex-col w-[700px] m-8 border-2 rounded p-8 justify-center items-center gap-4"
      >
        {/* Input fields for selecting products and entering tags */}
        {/* Repeat for each product */}
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="flex gap-3 items-center mb-4">
            <select
              name={`popularproduct${index}`}
              value={formData[`popularproduct${index}`]}
              onChange={handleInputChange}
              className="border rounded px-2 py-1"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={formData[`product${index}Tag`]}
              onChange={handleInputChange}
              className="border rounded px-2 py-1"
              placeholder="Enter a tag"
              name={`product${index}Tag`}
            />
          </div>
        ))}
        <button
          type="submit"
          className=" shadow-md rounded py-1 px-2 font-bold mx-auto text-primecolor bg-green-800 text-white font-content focus:outline-brown hover:bg-gray-100 hover:text-green-800"
        >
          Add Popular Products
        </button>
      </form>
    </div>
  );
}
