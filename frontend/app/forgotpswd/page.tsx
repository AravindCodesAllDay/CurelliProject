"use client";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import img1 from "../_assets/Logo_02.png";
import { toast } from "react-toastify";
import Image from "next/image";

const ForgotPswd: React.FC = () => {
  const [mail, setMail] = useState<string>("");
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (showOtp) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/verifyOTP/${mail}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ otp }),
          }
        );

        if (res.ok) {
          setVerified(true);

          const registerResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ mail, otp }), // Adjust payload as needed
            }
          );

          if (!registerResponse.ok) {
            toast.error(`Registration failed: ${registerResponse.statusText}`);
            return;
          }

          toast.success("Registration Successful");
          setTimeout(() => {
            nav("/login");
          }, 5000);
        } else {
          setError(true);
          toast.error("OTP verification failed. Please try again.");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error during OTP verification:", error.message);
          toast.error("Error during OTP verification. Please try again later.");
        } else {
          console.error("Unknown error occurred during OTP verification");
          toast.error("Error during OTP verification. Please try again later.");
        }
      }
    } else {
      try {
        setLoading(true);

        const existsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${mail}`
        );

        if (existsResponse.status === 200) {
          toast.error("User already exists");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/sendOTP`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mail }),
          }
        );

        if (res.ok) {
          setShowOtp(true);
        } else {
          toast.error("Failed to send OTP. Please try again.");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error during registration:", error.message);
          toast.error("Error during registration. Please try again later.");
        } else {
          console.error("Unknown error occurred during registration");
          toast.error("Error during registration. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100 p-12">
      <Link to="/">
        <Image src={img1} alt="Company Logo" className="h-24 m-4" />
      </Link>
      <div className="bg-white p-8 px-12 rounded-md shadow-lg w-[440px] flex flex-col items-center">
        <h2 className="text-[#277933] text-2xl mb-6 font-semibold">
          Forgot Password
        </h2>
        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="input-field border-[1px] p-2 rounded border-customGreen"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            disabled={showOtp}
            required
          />
          {showOtp && (
            <>
              <label htmlFor="otpInput" className="sr-only">
                Enter OTP
              </label>
              <input
                type="text"
                id="otpInput"
                placeholder="Enter OTP"
                className="input-field border-[1px] p-2 rounded border-customGreen"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <hr />
              <p className="text-customGreen flex justify-center">
                OTP is sent to your above mail Id
              </p>
            </>
          )}
          <p className="text-start">
            <Link to="/policy" className="text-customGreen cursor-pointer">
              Curelli Privacy Policy
            </Link>
          </p>
          <button
            type="submit"
            className="submit-button bg-green-700 text-white h-10 p-2 rounded"
            disabled={loading}
          >
            {showOtp ? "Submit" : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPswd;
