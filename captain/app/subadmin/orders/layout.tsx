import React from "react";

export default function layout({
  children,
  vieworder,
}: Readonly<{
  children: React.ReactNode,
  vieworder: React.ReactNode,
}>) {
  return (
    <>
      {children}
      {vieworder}
    </>
  );
}
