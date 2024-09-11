import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

export default function ViewOrders() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [showOrderStatus, setShowOrderStatus] = useState("pending");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API}orders`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const ordersData = await response.json();
        const mappedOrders = ordersData.map(mapOrderData);
        setPendingOrders(
          mappedOrders.filter((order) => order.status === "pending")
        );
        setDeliveredOrders(
          mappedOrders.filter((order) => order.status === "delivered")
        );
        setCanceledOrders(
          mappedOrders.filter((order) => order.status === "canceled")
        );
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchOrders();
  }, []);

  const getAddress = (data) => {
    const finalAddress =
      data.address +
      "," +
      data.district +
      "," +
      data.state +
      "-" +
      data.pincode;
    return finalAddress;
  };
  const mapOrderData = (order) => ({
    id: order._id,
    address: getAddress(order.address),
    phone: order.address.addressContact,
    date: order.date,
    products: order.products,
    status: order.orderStatus,
    paymentMethod: order.paymentmethod,
    paymentDone: order.paymentDone,
  });

  const columns = [
    { field: "id", headerAlign: "center", headerName: "ID", width: 90 },
    {
      field: "address",
      headerName: "Address",
      headerAlign: "center",
      width: 300,
    },
    { field: "phone", headerName: "Phone", headerAlign: "center", width: 150 },
    { field: "date", headerName: "Date", headerAlign: "center", width: 150 },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      headerAlign: "center",
      width: 150,
    },
    {
      field: "paymentDone",
      headerName: "Paid",
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <label class="inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" class="sr-only peer" />
          <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <select
          id="countries"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
          onChange={async (e) => {
            const res = await fetch(`${import.meta.env.VITE_API}`);
          }}
        >
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>
      ),
    },
  ];

  return (
    <>
      <div>
        <div className="w-screen justify-center flex gap-8 p-8">
          <button
            className={`border-2 rounded-lg px-3 py-1 hover:bg-[#40773b] hover:text-white ${
              showOrderStatus == "pending"
                ? "bg-[#40773b] text-white"
                : "bg-white text-[#40773b]"
            } `}
            onClick={() => setShowOrderStatus("pending")}
          >
            <h2>Pending Orders</h2>
          </button>
          <button
            className={`border-2 rounded-lg px-3 py-1 hover:bg-[#40773b] hover:text-white ${
              showOrderStatus == "delivered"
                ? "bg-[#40773b] text-white"
                : "bg-white text-[#40773b]"
            } `}
            onClick={() => setShowOrderStatus("delivered")}
          >
            <h2>Delivered Orders</h2>
          </button>
          <button
            className={`border-2 rounded-lg px-3 py-1 hover:bg-[#40773b] hover:text-white ${
              showOrderStatus == "canceled"
                ? "bg-[#40773b] text-white"
                : "bg-white text-[#40773b]"
            } `}
            onClick={() => setShowOrderStatus("canceled")}
          >
            <h2>Canceled Orders</h2>
          </button>
        </div>
        <div className=" flex justify-center items-center m-3">
          <Box>
            <DataGrid
              rows={
                showOrderStatus == "pending"
                  ? pendingOrders
                  : showOrderStatus == "delivered"
                  ? deliveredOrders
                  : canceledOrders
              }
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
      </div>
    </>
  );
}
