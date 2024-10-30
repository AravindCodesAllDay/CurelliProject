import React from "react";

export default function layout({
  children,
  addcarousel,
}: Readonly<{
  children: React.ReactNode;
  addcarousel: React.ReactNode;
}>) {
  return (
    <div>
      {children}
      {addcarousel}
    </div>
  );
}
