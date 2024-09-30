"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { googleLogout } from "@react-oauth/google";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

export default function Dropdown() {
  const router = useRouter();

  const exit = (): void => {
    localStorage.clear();
    googleLogout();
    router.push("/login");
  };

  return (
    <Menu as="div" className="relative inline-block text-left z-40">
      <Menu.Button className="inline-flex w-full justify-center text-sm font-semibold text-gray-900 shadow-sm rounded-full">
        <p className="text-white rounded-full p-1 w-8 bg-[#964B00] border-2">
          {localStorage.getItem("name")?.charAt(0)}
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
                  onClick={exit}
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
  );
}
