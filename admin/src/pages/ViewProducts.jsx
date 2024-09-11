import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

export default function GridData() {
  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);

  const fetchProductData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}products`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const productsData = await response.json();
      setProductData(productsData.map(mapProductData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const mapProductData = (element) => ({
    id: element._id,
    name: element.name,
    photo: element.photo,
    description: element.description,
    price: element.price,
    rating: element.rating,
    numOfRating: element.numOfRating,
    stock: element.stock,
  });

  const deleteProduct = async (_id) => {
    if (window.confirm("Are you sure to delete product?")) {
      try {
        await fetch(`${import.meta.env.VITE_API}products/${_id}`, {
          method: "DELETE",
        });
        setProductData((prevData) =>
          prevData.filter((product) => product.id !== _id)
        );
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const columns = [
    { field: "id", headerAlign: "center", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Product Name",
      headerAlign: "center",
      width: 150,
    },
    {
      field: "photo",
      headerAlign: "center",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={`${import.meta.env.VITE_API}uploads/${params.row.photo}`}
          alt="Circular Image"
          className="w-12 h-12 rounded-full"
        />
      ),
    },
    {
      field: "description",
      headerAlign: "center",
      headerName: "Description",
      width: 250,
    },
    { field: "stock", headerAlign: "center", headerName: "Stock", width: 100 },
    { field: "price", headerAlign: "center", headerName: "Price", width: 100 },
    {
      field: "rating",
      headerAlign: "center",
      headerName: "Average Rating",
      width: 100,
    },
    {
      field: "numOfRating",
      headerAlign: "center",
      headerName: "Rating Count",
      width: 100,
    },
    {
      field: "update",
      headerAlign: "center",
      headerName: "Update",
      width: 90,
      renderCell: (params) => (
        <ion-icon
          name="create-outline"
          onClick={() => navigate(`/update/${params.row.id}`)}
        ></ion-icon>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      headerAlign: "center",
      width: 90,
      renderCell: (params) => (
        <ion-icon
          name="trash-outline"
          onClick={() => deleteProduct(params.row.id)}
        ></ion-icon>
      ),
    },
  ];

  return (
    <>
      <div className=" flex justify-center items-center m-3">
        <Box>
          <DataGrid
            rows={productData}
            columns={columns}
            pageSize={11}
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
          />
        </Box>
      </div>
    </>
  );
}
