import Header from "@/components/Header";
import ToTop from "@/components/ToTop";
import React from "react";

export default function layout(props: { children: React.ReactNode }) {
  return (
    <>
      <Header title={"Cart"} />
      {props.children}
      <ToTop />
    </>
  );
}
