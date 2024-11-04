import React from "react";

export default function layout({
  children,
  addproduct,
  editproduct,
}: Readonly<{
  children: React.ReactNode;
  addproduct: React.ReactNode;
  editproduct: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {addproduct}
      {editproduct}
    </>
  );
}
