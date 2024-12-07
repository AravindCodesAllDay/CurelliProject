"use client";
import React, { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { googleLogout } from "@react-oauth/google";
import { Menu, Transition } from "@headlessui/react";
import { FaUser } from "react-icons/fa";

export default function Dropdown() {
  const router = useRouter();
  const { name, token, logout } = useUser();

  const handleLogout = () => {
    googleLogout();
    logout();
    router.push("/login");
  };

  return (
    <>
      {!token ? (
        <Link href="/login">
          <FaUser className="size-[21px] sm:size-[23px] md:size-[25px] lg:size-[27px] 2xl:size-[29px] text-white" />
        </Link>
      ) : (
        <Menu as="div" className="relative inline-block text-left z-40">
          <Menu.Button className="inline-flex w-full justify-center text-sm font-semibold text-gray-900 shadow-sm rounded-full">
            <p className="text-white rounded-full p-1 w-8 bg-[#964B00] border-2">
              {name?.charAt(0) || "U"}
            </p>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-30 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/orders"
                      className={`${
                        active ? "bg-gray-100" : "bg-white"
                      } text-gray-900 block px-4 py-2 text-sm`}
                    >
                      My Orders
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/wishlist"
                      className={`${
                        active ? "bg-gray-100" : "bg-white"
                      } text-gray-900 block px-4 py-2 text-sm`}
                    >
                      Wishlist
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={`${
                        active ? "bg-gray-100" : "bg-white"
                      } text-gray-900 block px-4 py-2 text-sm`}
                    >
                      Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      onClick={() => handleLogout()}
                      className={`${
                        active ? "bg-gray-100" : "bg-white"
                      } text-gray-900 block px-4 py-2 text-sm cursor-pointer`}
                    >
                      Logout
                    </div>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    </>
  );
}
