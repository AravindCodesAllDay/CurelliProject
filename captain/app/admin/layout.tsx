import NavbarAdmin from "@/components/NavbarAdmin";
import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavbarAdmin />
      {children}
    </div>
  );
}
