import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

export default function ViewUsers() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API}users`);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const usersData = await response.json();
        setUserData(usersData.map(mapUserData));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  const mapUserData = (user) => ({
    id: user._id,
    name: user.name,
    phone: user.phone,
    mail: user.mail,
  });

  const handleRowClick = (params) => {
    const id = params.row.id;
    navigate(`/viewuserprofile/${id}`);
  };

  const columns = [
    { field: "id", headerAlign: "center", headerName: "ID", width: 150 },
    {
      field: "name",
      headerName: "Name",
      headerAlign: "center",
      width: 200,
    },
    { field: "phone", headerName: "Phone", headerAlign: "center", width: 150 },
    { field: "mail", headerName: "Email", headerAlign: "center", width: 200 },
  ];

  return (
    <>
      <div className=" flex justify-center items-center m-3">
        <Box>
          <DataGrid
            rows={userData}
            columns={columns}
            pageSize={11}
            onCellClick={handleRowClick}
            sx={{
              boxShadow: 10,
              "& .MuiDataGrid-cell": {
                justifyContent: "center",
                backgroundColor: "white",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#40773b",
                color: "white",
              },
            }}
            disableSelectionOnClick
            className="cursor-pointer"
          />
        </Box>
      </div>
    </>
  );
}
