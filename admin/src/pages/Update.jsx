import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UpdateProduct() {
  const { _id } = useParams();

  const [name, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API}products/${_id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await res.json();
        setProductName(data.name);
        setPrice(data.price);
        setDescription(data.description);
        setStock(data.stock);
      } catch (error) {
        console.error(error);
        // Handle error, show message to user or redirect
      }
    };
    fetchProduct();
  }, [_id]);

  const productDetails = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("stock", stock);
      if (photo) {
        formData.append("photo", photo);
      }
      console.log(formData);
      const res = await fetch(`${import.meta.env.VITE_API}products/${_id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to update product");
      }

      const data = await res.json();
      console.log(data.updatedProduct);
    } catch (error) {
      console.error(error);
      // Handle error, show message to user or redirect
    }
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    await productDetails();
    // Clear form fields after submission
    setProductName("");
    setPrice("");
    setPhoto(null);
    setDescription("");
    setStock("");
  };

  return (
    <form onSubmit={handleSubmission}>
      <label htmlFor="name">Product name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setProductName(e.target.value)}
      />
      <br />
      <label htmlFor="price">Product Price:</label>
      <input
        type="number"
        id="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br />
      <label htmlFor="description">Product description:</label>
      <input
        type="text"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <label htmlFor="stock">Product Stock:</label>
      <input
        type="number"
        id="stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
      <br />
      <label htmlFor="photo">Product Photo:</label>
      <input
        type="file"
        id="photo"
        onChange={(e) => setPhoto(e.target.files[0])}
      />
      <br />
      <input type="submit" value="Submit" />
    </form>
  );
}
