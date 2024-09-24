"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function ProfileDetails() {
  const [userId, setUserId] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    mail: "",
    phone: "",
    dob: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("id");
      setUserId(storedUserId);
    }
  }, []);
  useEffect(() => {
    const fetchDetails = async () => {
      if (!userId) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
        );
        if (res.ok) {
          const data: any = await res.json();
          setFormData({
            name: data.name,
            gender: data.gender,
            mail: data.mail,
            phone: data.phone,
            dob: await convertDate(data.dob),
          });
        } else {
          throw new Error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details");
      }
    };

    fetchDetails();
  }, [userId]);

  const convertDate = async (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formData, userId }),
        }
      );
      if (res.ok) {
        setCanEdit(false);
        toast.success("Profile updated");
      } else {
        toast.error("Error updating try later");
      }
    } catch (error) {
      console.error("Error editing user:", error);
      toast.error("Failed to update user details");
    }
  };

  return (
    <>
      <div className="bg-[#CDDCCB] rounded-lg overflow-hidden cursor-default w-11/12 md:w-5/6 mx-auto mb-3">
        <div>
          <form>
            <div className="px-4 py-2 border-b border-gray-300 flex items-center justify-between">
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 placeholder-gray-400 text-gray-700 focus:outline-none focus:border-brown-500 flex-grow mr-2"
                placeholder="E-Mail"
                name="mail"
                value={formData.mail}
                disabled
              />
            </div>
            <div className="flex px-4 py-2 border-b border-gray-300 font-medium">
              <h3 className="font-semibold text-lg">Personal Information</h3>
              {!canEdit && (
                <button
                  className="flex items-center gap-1 ml-auto border-2 border-green-700 bg-green-700 hover:bg-green-400 text-white p-1 px-2 rounded "
                  onClick={() => setCanEdit(true)}
                  disabled={canEdit}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                  Edit
                </button>
              )}
            </div>

            <div className="px-4 py-2 border-b border-gray-300 font-medium">
              UserName
            </div>
            <div className="flex px-4 py-2 border-b border-gray-300">
              <input
                type="text"
                name="name"
                className="border border-gray-300 rounded w-full px-3 py-2 placeholder-gray-400 text-gray-700 focus:outline-none focus:border-brown-500"
                placeholder="First name"
                value={formData.name}
                onChange={handleChange}
                disabled={!canEdit}
              />
            </div>
            <div className="px-4 py-2 border-b border-gray-300 font-medium">
              Gender
            </div>
            <div className="px-4 py-2 border-b border-gray-300">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio"
                    value="male"
                    checked={formData.gender === "male"}
                    name="gender"
                    onChange={handleChange}
                    disabled={!canEdit}
                  />
                  <span className="text-gray-700">Male</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    value="female"
                    className="form-radio"
                    checked={formData.gender === "female"}
                    name="gender"
                    onChange={handleChange}
                    disabled={!canEdit}
                  />
                  <span className="text-gray-700">Female</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    value="others"
                    className="form-radio"
                    checked={formData.gender === "others"}
                    name="gender"
                    onChange={handleChange}
                    disabled={!canEdit}
                  />
                  <span className="text-gray-700">Others</span>
                </label>
              </div>
            </div>
            <div className="px-4 py-2 border-b border-gray-300 font-medium">
              Date of Birth
            </div>
            <div className="flex px-4 py-2 border-b border-gray-300">
              <input
                type="date"
                name="dob"
                className="border border-gray-300 rounded w-full px-3 py-2 placeholder-gray-400 text-gray-700 focus:outline-none focus:border-brown-500"
                value={formData.dob}
                onChange={handleChange}
                disabled={!canEdit}
              />
            </div>
            <div className="px-4 py-2 border-b border-gray-300 font-medium">
              Mobile Number
            </div>
            <div className="px-4 py-2 border-b border-gray-300 flex items-center justify-between">
              <input
                type="number"
                className="border border-gray-300 rounded px-3 py-2 placeholder-gray-400 text-gray-700 focus:outline-none focus:border-brown-500 flex-grow mr-2"
                placeholder="XXXXX XXXXX"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!canEdit}
              />
            </div>
            {canEdit && (
              <div className="justify-center flex m-1 gap-3 p-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-500"
                  onClick={handleSubmit}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-300"
                  onClick={() => setCanEdit(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
