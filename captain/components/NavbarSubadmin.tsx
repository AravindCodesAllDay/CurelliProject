"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import logo from "@/assets/logo.png";

export default function NavbarSubadmin() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verify = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/subadmin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }
        );
        if (!response.ok) {
          localStorage.clear();
          router.push("/");
        }
      } catch (error) {
        console.error("Verification error:", error);
        localStorage.clear();
        router.push("/");
      }
    };
    verify();
  }, []);

  const signout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-[2px] relative bg-white">
      <div className="flex flex-col items-center justify-center p-2 relative w-full">
        <Link href="/">
          <Image
            className="relative w-auto h-12 md:h-20 object-contain"
            placeholder="blur"
            alt="Logo"
            src={logo}
          />
        </Link>
      </div>
      <div className="flex items-center justify-between px-4 lg:px-10 py-4 lg:py-13 relative w-full bg-[#40773b]">
        <div className="flex items-center gap-[16px] relative">
          <MenuItem
            label="Orders"
            path="/subadmin/orders"
            currentPath={pathname}
          />
        </div>
        <div>
          <button
            className="border border-white px-1 rounded text-[#40773b] bg-white font-semibold hover:bg-[#40773b] hover:text-white"
            onClick={signout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

interface MenuItemProps {
  label: string;
  path: string;
  currentPath: string;
}

function MenuItem({ label, path, currentPath }: MenuItemProps) {
  return (
    <div
      className={`text-[16px] ${
        currentPath === path
          ? "text-[#6b986a]"
          : "hover:text-[#6b986a] text-white"
      }`}
    >
      <Link href={path}>{label}</Link>
    </div>
  );
}
