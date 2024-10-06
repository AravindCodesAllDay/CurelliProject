import NavbarSubadmin from "@/components/NavbarSubadmin";
import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavbarSubadmin />
      {children}
    </div>
  );
}
