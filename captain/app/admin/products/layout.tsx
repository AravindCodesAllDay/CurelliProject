import React from "react";

export default function layout({
  children,
  addproduct,
}: Readonly<{
  children: React.ReactNode;
  addproduct: React.ReactNode;
}>) {
  return (
    <div>
      {children}
      {addproduct}
    </div>
  );
}
