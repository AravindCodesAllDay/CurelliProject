import React, { useState, useEffect } from "react";
export default function ViewSubAdmin() {
  const [subAdmins, setSubAdmins] = useState([]);

  async function fetchSubAdmins() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}admin/subadmins`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch sub-admins");
      }
      const data = await response.json();
      setSubAdmins(data);
    } catch (error) {
      console.error("Error fetching sub-admins:", error.message);
    }
  }

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const handleRemoveSubAdmin = async (mail) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}admin/removesubadmin`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mail }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove sub-admin");
      }

      fetchSubAdmins();
      alert("Sub-admin removed successfully");
    } catch (error) {
      console.error("Error removing sub-admin:", error.message);
      alert(`Error removing sub-admin: ${error.message}`);
    }
  };

  return (
    <div className="w-full flex justify-center flex-col items-center">
      <h2 className="text-2xl font-semibold">Sub-admins</h2>
      <div>
        {subAdmins.length > 0 ? (
          <table className="m-3 shadow-lg border-2 p-2">
            <thead>
              <tr className="border-b-2">
                <th className="m-1">Email</th>
                <th className="m-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {subAdmins.map((subAdmin, index) => (
                <tr key={index} className="border-b-2">
                  <td className="p-2 font-semibold">{subAdmin.mail}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveSubAdmin(subAdmin.mail)}
                      className="bg-red-700 text-white p-1 m-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No sub-admins found</p>
        )}
      </div>
    </div>
  );
}
