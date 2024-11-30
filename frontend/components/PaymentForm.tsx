"use client";
import React, { useState } from "react";
import axios from "axios";
import Script from "next/script";

declare var Razorpay: any;

const PaymentForm: React.FC = () => {
  const [details, setDetails] = useState({
    amount: "",
    email: "",
    contact: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shiprocket/create-payment`,
        details
      );
      const { order_id } = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        order_id: order_id,
        handler: function (response: { razorpay_payment_id: string }) {
          alert(
            `Payment successful. Payment ID: ${response.razorpay_payment_id}`
          );
        },
        prefill: {
          name: "Your Name",
          email: details.email,
          contact: details.contact,
        },
        theme: { color: "#F37254" },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error creating payment:", error.response?.data);
      } else {
        console.error("Unexpected error:", (error as Error).message);
      }
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePayment();
        }}
      >
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          onChange={handleChange}
          required
        />
        <button type="submit">Pay Now</button>
      </form>
    </>
  );
};

export default PaymentForm;
