"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import {
  googleLogout,
  useGoogleLogin,
  TokenResponse,
} from "@react-oauth/google";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import logo from "@/assets/logo.png";
import google from "@/assets/google.png";

const Login = () => {
  const router = useRouter();
  const [user, setUser] = useState<TokenResponse | null>(null);
  const [mail, setMail] = useState<string>("");
  const [pswd, setPswd] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const status = localStorage.getItem("status");

    if (token && status) {
      router.push(`/${status}/orders`);
    }
  }, [router]);

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mail, pswd }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const { token, status } = await response.json();

      localStorage.setItem("token", token);
      localStorage.setItem("status", status);
      router.push(`/${status}/orders`);
    } catch (error) {
      console.error("Error during login:", (error as Error).message);
      toast.error("Error during login, try again later");
    }
    setIsLoading(false);
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
          const { email } = res.data;
          try {
            const loginRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/admin/google`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mail: email }),
              }
            );

            if (!loginRes.ok) {
              throw new Error("Login failed");
            }

            const { token, status } = await loginRes.json();
            localStorage.setItem("token", token);
            localStorage.setItem("status", status);
            router.push(`/${status}/orders`);
          } catch (error) {
            console.error("Error during login:", (error as Error).message);
            toast.error("Error during login, try again later");
          }
        })
        .catch((err) => console.log(err));
    }
    return () => {
      if (user) {
        googleLogout();
      }
    };
  }, [user, router]);

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 h-screen w-full">
      <Image className="h-16 object-contain" alt="Image" src={logo} />
      <div className="flex justify-center items-center bg-gray-100 p-12">
        <div className="bg-white p-8 px-16 rounded-lg shadow-lg w-[440px]">
          <h2 className="text-[#277933] text-2xl mb-6 text-center font-semibold">
            Admin Login
          </h2>
          <form onSubmit={handleSubmission} className="flex flex-col gap-6">
            <input
              type="text"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              placeholder="Email"
              className="input-field border-[1px] p-2 rounded border-[#0d5b41]"
            />
            <input
              type="password"
              value={pswd}
              onChange={(e) => setPswd(e.target.value)}
              placeholder="Password"
              className="input-field border-[1px] p-2 rounded border-[#0d5b41]"
            />
            <button
              type="submit"
              className="submit-button bg-[#277933] text-white h-10 p-2 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </form>
          <hr className="my-3" />
          <button
            className="text-black p-2 border-2 my-2 rounded-full flex items-center justify-center w-full"
            onClick={() => login()}
          >
            <Image
              src={google}
              alt="google logo"
              className="size-6 object-contain mr-2"
            />
            <p className="font-semibold">Continue with Google</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
