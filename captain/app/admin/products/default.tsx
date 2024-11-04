"use client";
import Products from "./Products";
import { useRouter } from "next/navigation";

export default function Page() {
  const nav = useRouter();

  function navigate() {
    nav.push("/admin/products/addproduct");
  }

  return (
    <div>
      <button onClick={navigate}>Add Product</button>
      <Products />
    </div>
  );
}
