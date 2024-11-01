import React from "react";

export default function layout({
  children,
  addproduct,
  popup,
}: Readonly<{
  children: React.ReactNode;
  addproduct: React.ReactNode;
  popup: React.ReactNode;
}>) {
  return (
    <div>
      {children}
      {addproduct}
      {popup}
    </div>
  );
}
