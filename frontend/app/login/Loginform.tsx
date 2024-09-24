"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEye } from "react-icons/fa";

import google from "../_assets/google.png";

export default function Loginform() {
  const router = useRouter();
  const [mail, setMail] = useState("");
  const [pswd, setPswd] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showPswd, setShowPswd] = useState(false);
  const [wrongPswd, setWrongPswd] = useState(false);

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ mail, pswd }),
        }
      );

      if (response.status === 401) {
        setWrongPswd(true);
        throw new Error("Incorrect password or email.");
      }

      if (!response.ok) {
        throw new Error("Login failed.");
      }

      const user = await response.json();
      toast.success("Login Successful", { position: "top-center" });

      localStorage.setItem("id", user._id);
      localStorage.setItem("name", user.name);
      router.push("/");
    } catch (error: any) {
      console.error("Error during login:", error.message);
      toast.error(error.message || "Error during login, try again later", {
        position: "top-center",
      });
    }
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then(async (res) => {
          const result = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/google`,
            {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                mail: res.data.email,
                name: res.data.name,
              }),
            }
          );
          if (result.ok) {
            const data = await result.json();
            localStorage.setItem("id", data._id);
            localStorage.setItem("name", data.name);
            router.push("/");
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          if (user) {
            googleLogout();
          }
        });
    }
  }, [user, router]);

  return (
    <div className="h-100% flex justify-center items-center bg-gray-100 xs:p-3 sm:p-4 md:p-5 lg:p-12 xl:p-12 2xl:p-14">
      <div className="bg-white rounded-md shadow-lg w-[440px] xs:p-4 sm:p-8 md:p-10 lg:p-12 xl:p-12 2xl:p-14">
        <h2 className="text-[#277933] text-2xl mb-6 text-center font-semibold">
          Login
        </h2>
        <form onSubmit={handleSubmission} className="flex flex-col gap-6">
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            placeholder="Email"
            className="input-field border-[1px] p-2 rounded border-[#0d5b41]"
            required
          />
          <div className="relative flex items-center">
            <input
              type={showPswd ? "text" : "password"}
              value={pswd}
              autoComplete="off"
              onChange={(e) => setPswd(e.target.value)}
              placeholder="Password"
              className={`input-field border-[1px] p-2 rounded border-[#0d5b41] w-full ${
                wrongPswd ? "border-red-800" : "border-[#0d5b41]"
              }`}
              required
            />

            <FaEye
              onClick={() => setShowPswd(!showPswd)}
              className="cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 mr-2"
            />
          </div>
          {wrongPswd && (
            <p className="flex text-sm text-red-800 -mt-3 items-center">
              Incorrect password
            </p>
          )}

          <p className="text-end">
            <Link
              href="/forgotpswd"
              className="cursor-pointer hover:text-[#b65c21] text-[#2a64ba]"
            >
              Forgot Password?
            </Link>
          </p>

          <button
            type="submit"
            className="submit-button bg-green-700 text-white h-10 p-2 rounded z-20"
          >
            Submit
          </button>
        </form>
        <p className="text-start mt-4">
          By continuing, you agree to Curelli Foods{" "}
          <Link
            href="/policy"
            className="font-semibold cursor-pointer hover:text-[#2a64ba] text-[#277933]"
          >
            Privacy Policy.
          </Link>
        </p>
        <hr className="my-3" />
        <button
          className="submit-button text-black p-2 border-2 my-2 rounded-full flex items-center w-full justify-center"
          onClick={() => login()}
        >
          <Image src={google} alt="google logo" className="size-6 mr-2" />
          <p className="font-semibold">Continue with Google</p>
        </button>
        <button
          className="submit-button text-black p-2 border-2 rounded-full flex items-center justify-center font-semibold hover:bg-[#277933] hover:text-white w-full"
          onClick={() => router.push("/register")}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
