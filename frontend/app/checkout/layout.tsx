import Header from "@/components/Header";
import React from "react";

export default function layout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="hidden md:block">
        <Header title="Checkout" />
      </div>
      {props.children}
    </>
  );
}
