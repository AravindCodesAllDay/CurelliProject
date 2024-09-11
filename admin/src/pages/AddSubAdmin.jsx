import React, { useState } from "react";
import axios from "axios";

export default function AddSubAdmin() {
  const [mail, setMail] = useState("");
  const [confirmMail, setConfirmMail] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mail !== confirmMail) {
      alert("Emails do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}admin/addsubadmin`,
        { mail }
      );
      if (response.status === 200) {
        alert("Sub-admin added successfully");
        setMail("");
        setConfirmMail("");
        setError(null); // Reset error state
      }
    } catch (error) {
      console.error("Error adding sub-admin:", error.message);
      setError("Error adding sub-admin, please try again later");
    }
  };

  return (
    <div className="w-full flex justify-center flex-col items-center">
      <h2 className="text-2xl font-semibold m-3">Add Sub-admin</h2>
      <form
        className="border-2 shadow-lg m-3 p-3 flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          placeholder="Enter email"
          className="border-2 shadow m-2"
        />
        <input
          type="email"
          value={confirmMail}
          onChange={(e) => setConfirmMail(e.target.value)}
          placeholder="Confirm email"
          className="border-2 shadow m-2"
        />
        <button
          type="submit"
          className="shadow-md rounded py-1 px-2 mt-3 font-bold text-white bg-green-800 font-content focus:outline-none hover:bg-gray-100 hover:text-green-800"
        >
          Add SubAdmin
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <p>Note: Default subadmin password is "subadmin"</p>
      </form>
    </div>
  );
}
