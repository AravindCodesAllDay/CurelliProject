"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import axios from "axios";
import { useUser } from "@/context/UserContext";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";

import google from "@/assets/google.png";

export default function Loginform() {
  const router = useRouter();
  const { token, name, checkToken, logout, setUserContext } = useUser();
  const [mail, setMail] = useState("");
  const [pswd, setPswd] = useState("");
  const [showPswd, setShowPswd] = useState(false);
  const [wrongPswd, setWrongPswd] = useState(false);

  const handleLoginSubmission = async (e: React.FormEvent) => {
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

      if (response.status === 403) {
        toast.error(
          "This account uses Google login. Please sign in with Google.",
          { position: "top-center" }
        );
        throw new Error("Google login required.");
      }

      if (response.status === 401) {
        setWrongPswd(true);
        throw new Error("Incorrect password or email.");
      }

      if (!response.ok) {
        throw new Error("Login failed.");
      }

      const data = await response.json();
      toast.success("Login Successful", { position: "top-center" });

      setUserContext(data.name, data.token);

      router.push("/");
    } catch (error: any) {
      console.error("Error during login:", error.message);
      toast.error(error.message || "Error during login, try again later", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    if (token && name) {
      checkToken().then((isValid) => {
        if (isValid) {
          router.push("/");
        } else {
          logout();
        }
      });
    }
  }, [token, name, router]);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
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

            setUserContext(data.name, data.token);
            router.push("/");
          }
        })
        .catch((err) => console.error("Error fetching user data:", err))
        .finally(() => {
          if (codeResponse.access_token) googleLogout();
        });
    },
    onError: (error) => console.log("Google Login Failed:", error),
  });

  return (
    <div className="h-full flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white rounded-md shadow-lg max-w-md w-full p-6">
        <h2 className="text-green-700 text-2xl mb-4 text-center font-semibold">
          Login
        </h2>
        <form onSubmit={handleLoginSubmission} className="flex flex-col gap-4">
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            placeholder="Email"
            className="input-field p-2 rounded border border-green-700"
            required
          />
          <div className="relative">
            <input
              type={showPswd ? "text" : "password"}
              value={pswd}
              onChange={(e) => setPswd(e.target.value)}
              placeholder="Password"
              className={`input-field p-2 rounded border ${
                wrongPswd ? "border-red-500" : "border-green-700"
              } w-full`}
              required
            />
            <FaEye
              onClick={() => setShowPswd(!showPswd)}
              className="cursor-pointer absolute right-2 top-2/4 transform -translate-y-1/2"
            />
          </div>
          {wrongPswd && (
            <p className="text-red-500 text-sm">Incorrect password</p>
          )}
          <p className="text-end text-blue-600">
            <Link href="/forgotpswd">Forgot Password?</Link>
          </p>
          <button type="submit" className="bg-green-700 text-white p-2 rounded">
            Submit
          </button>
        </form>
        <p className="text-sm mt-4">
          By continuing, you agree to Curelli Foods{" "}
          <Link href="/policy" className="text-green-700 font-semibold">
            Privacy Policy.
          </Link>
        </p>
        <div className="flex justify-between items-center mt-4 gap-3">
          <div className="flex-1 border-t border-gray-400"></div>
          <p className="text-center text-[#277933]">OR</p>
          <div className="flex-1 border-t border-gray-400"></div>
        </div>
        <div className="flex flex-col items-center justify-center mt-6 gap-3">
          <button
            className="flex items-center justify-center  border-[1px] p-2 rounded w-full  bg-[#f4f4f4]"
            onClick={() => loginWithGoogle()}
          >
            <Image src={google} alt="Google logo" className="w-5 h-5 mr-2" />
            Continue with Google
          </button>

          <button
            className="border-[2px] p-2 rounded w-full"
            onClick={() => router.push("/register")}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
