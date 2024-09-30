import ToTop from "@/components/ToTop";
import React from "react";

export default function layout(props: {
  popup: React.ReactNode;
  shop: React.ReactNode;
}) {
  return (
    <>
      {props.popup}
      {props.shop}
      <ToTop />
    </>
  );
}
