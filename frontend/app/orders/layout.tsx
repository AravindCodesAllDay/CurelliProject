import Header from "@/components/Header";
import React from "react";

export default function Layout({
  children,
  vieworder,
}: Readonly<{
  children: React.ReactNode;
  vieworder: React.ReactNode;
}>) {
  return (
    <>
      <Header title="Orders" />
      {children}
      {vieworder}
    </>
  );
}
