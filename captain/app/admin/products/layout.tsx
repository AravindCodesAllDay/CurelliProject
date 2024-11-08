"use client";
import React from "react";
import Products from "./Products";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nav = useRouter();

  function navigate() {
    nav.push("/admin/products/addproduct");
  }

  return (
    <>
      <div
        className="bg-green-600 p-2 m-5 rounded
       flex items-center justify-center font-bold"
      >
        <h2 className="text-lg text-white">Products Page</h2>
        <button
          className="bg-green-800 flex gap-1 justify-center items-center rounded ml-auto p-1 border-2 text-sm text-white"
          onClick={navigate}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            className="size-6"
          >
            <path d="M12 5l0 14"></path> <path d="M5 12l14 0"></path>
          </svg>
          Add Product
        </button>
      </div>
      <Products />
      {children}
    </>
  );
}
