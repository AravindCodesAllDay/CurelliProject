"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import axios from "axios";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

import { FaEye } from "react-icons/fa";

import google from "@/assets/google.png";
export default function Registerform() {
  const router = useRouter();

  // State variables
  const [name, setName] = useState<string>("");
  const [mail, setMail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [pswd, setPswd] = useState<string>("");
  const [confirmPswd, setConfirmPswd] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPswd, setShowPswd] = useState<boolean>(false);
  const [showConfPswd, setShowConfPswd] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [wrongPswd, setWrongPswd] = useState<boolean>(false);

  const handleSubmission = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedPswd = pswd.trim();
    const trimmedConfirmPswd = confirmPswd.trim();

    if (trimmedPswd === trimmedConfirmPswd) {
      try {
        setLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, mail, phone, pswd: trimmedPswd }),
          }
        );

        if (!response.ok) {
          toast.error("registration failed");
          return;
        }
        toast.success("user Creatred");
        router.push("/login");
      } catch (error) {
        console.error("Error during registration:", (error as Error).message);
        toast.error("Error during registration. Please try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      setWrongPswd(true);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      setLoading(true);
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
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${res.data.email}`
          );
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("id", data._id);
            localStorage.setItem("name", data.name);
            router.push("/");
          } else {
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
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }

    return () => {
      if (user) {
        googleLogout();
      }
    };
  }, [user, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "mail":
        setMail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "pswd":
        setPswd(value);
        break;
      case "confirmPswd":
        setConfirmPswd(value);
        break;
      default:
        break;
    }
  };
  return (
    <div className="h-100% flex justify-center items-center bg-gray-100 xs:p-3 sm:p-4 md:p-5 lg:p-12 xl:p-12 2xl:p-14">
      <div className="bg-white rounded-md shadow-lg w-[440px] xs:p-4 sm:p-8 md:p-10 lg:p-12 xl:p-12 2xl:p-14">
        <h2 className="text-[#277933] text-2xl mb-6 text-center font-semibold">
          RegisterForm
        </h2>
        <form onSubmit={handleSubmission} className="flex flex-col gap-6">
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            placeholder="Username"
            className="input-field border-[1px] p-2 rounded border-[#0d5b41]"
            required
          />

          <input
            type="email"
            name="mail"
            value={mail}
            onChange={handleChange}
            placeholder="Email"
            className="input-field border-[1px] p-2 rounded border-[#0d5b41]"
            required
          />

          <input
            type="text"
            name="phone"
            value={phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="input-field border-[1px] p-2 rounded border-[#0d5b41]"
            inputMode="numeric"
            required
          />
          <div className="relative flex items-center">
            <input
              type={showPswd ? "text" : "password"}
              name="pswd"
              value={pswd}
              onChange={handleChange}
              placeholder="Password"
              className="input-field border-[1px] p-2 rounded border-[#0d5b41] w-full"
              required
              autoComplete="off"
            />
            <FaEye
              onClick={() => setShowPswd(!showPswd)}
              className=" cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 mr-2"
            />
          </div>
          <div className="relative flex items-center">
            <input
              type={showConfPswd ? "text" : "password"}
              name="confirmPswd"
              value={confirmPswd}
              onChange={handleChange}
              placeholder="Confirm Password"
              className={`input-field border-[1px] p-2 rounded border-[#0d5b41] w-full${
                wrongPswd ? "border-red-800" : ""
              }`}
              required
              autoComplete="off"
            />
            <FaEye
              onClick={() => setShowConfPswd(!showConfPswd)}
              className=" cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 mr-2"
            />
          </div>
          {wrongPswd && (
            <p className="flex text-sm text-red-800 underline -mt-3 items-center">
              Password doesn&apos;t match
            </p>
          )}

          {loading && <p className="text-gray-600">Submitting...</p>}
          <button
            type="submit"
            disabled={loading}
            className={`submit-button bg-green-700 text-white h-10 p-2 rounded ${
              loading && "cursor-not-allowed opacity-50"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <p className="text-start mt-4">
          By creating an account or logging in, you agree to Curelli Foods{" "}
          <Link
            href="/policy"
            className=" font-semibold cursor-pointer hover:text-[#2a64ba] text-[#277933]"
          >
            Privacy Policy.
          </Link>
        </p>
        <hr className="my-3" />
        <button
          className="submit-button text-black p-2 border-2 my-2 rounded-full flex items-center justify-center w-full"
          onClick={() => login()}
        >
          <Image src={google} alt="google logo" className="size-6 mr-2" />
          <p className="font-semibold">Signup with Google</p>
        </button>
        <button
          className="submit-button text-black p-2 border-2 rounded-full flex items-center justify-center font-semibold hover:bg-[#277933] hover:text-white w-full"
          onClick={() => router.push("/login")}
        >
          Existing Account
        </button>
      </div>
    </div>
  );
}
