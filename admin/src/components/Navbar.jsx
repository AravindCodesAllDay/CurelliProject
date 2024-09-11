import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import img1 from "../assets/Logo01.webp";

export default function Navbar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    const verifyToken = async () => {
      try {
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await fetch(
          `${import.meta.env.VITE_API}admin/verify/${token}`
        );

        if (!response.ok) {
          throw new Error("Failed to verify token");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        navigate("/");
      }
    };
    verifyToken();
  }, [navigate]);

  const signout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-[2px] relative bg-white">
        <div className="flex flex-col items-center justify-center gap-[10px] relative w-full max-w-[1440px]">
          <Link to="/">
            <img
              className="relative h-[100px] object-cover"
              alt="Image"
              src={img1}
            />
          </Link>
        </div>
        <div className="flex items-center justify-between px-4 lg:px-10 py-4 lg:py-13 relative w-full bg-[#40773b]">
          <div className="flex items-center gap-[16px] relative">
            <div
              className={`text-[16px] ${
                location.pathname === "/viewproducts"
                  ? "text-[#6b986a]"
                  : "hover:text-[#6b986a] text-white"
              }`}
            >
              <Link to={`/viewproducts`}>ViewProduct</Link>
            </div>
            <div
              className={`text-[16px] ${
                location.pathname === "/add"
                  ? "text-[#6b986a]"
                  : "hover:text-[#6b986a] text-white"
              }`}
            >
              <Link to={`/add`}>AddProduct</Link>
            </div>
            <div
              className={`text-[16px] ${
                location.pathname === "/viewusers"
                  ? "text-[#6b986a]"
                  : "hover:text-[#6b986a] text-white"
              }`}
            >
              <Link to={`/viewusers`}>ViewUsers</Link>
            </div>
            <div
              className={` text-[16px] ${
                location.pathname === "/addcarousel"
                  ? "text-[#6b986a]"
                  : "hover:text-[#6b986a] text-white"
              }`}
            >
              <Link to={`/addcarousel`}>AddCarousel</Link>
            </div>
            <div
              className={` text-[16px] ${
                location.pathname === "/popularproducts"
                  ? "text-[#6b986a]"
                  : "hover:text-[#6b986a] text-white"
              }`}
            >
              <Link to={`/popularproducts`}>PopularProducts</Link>
            </div>
            <div
              className={` text-[16px] ${
                location.pathname === "/vieworders"
                  ? "text-[#6b986a]"
                  : "hover:text-[#6b986a] text-white"
              }`}
            >
              <Link to={`/vieworders`}>ViewOrders</Link>
            </div>
            <div
              className={` text-[16px] ${
                location.pathname === "/viewsubadmins"
                  ? "text-[#6b986a]"
                  : "hover:text-[#6b986a] text-white"
              }`}
            >
              <Link to={`/viewsubadmins`}>ViewSubAdmins</Link>
            </div>
            <div
              className={` text-[16px] ${
                location.pathname === "/addsubadmin"
                  ? "text-[#6b986a]"
                  : "hover:text-[#6b986a] text-white"
              }`}
            >
              <Link to={`/addsubadmin`}>AddSubAdmin</Link>
            </div>
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
      {children}
    </>
  );
}
