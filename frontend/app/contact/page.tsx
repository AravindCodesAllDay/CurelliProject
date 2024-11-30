import React from "react";
import Contactdetails from "./Contactdetails";
import Footer from "@/components/Footer";
import ToTop from "@/components/ToTop";
import PaymentForm from "@/components/PaymentForm";

export default function Contact() {
  return (
    <>
      <Contactdetails />
      <PaymentForm />
      <Footer />
      <ToTop />
    </>
  );
}
