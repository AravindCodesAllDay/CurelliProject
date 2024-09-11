import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar.jsx";
import SubNavbar from "./components/SubNabar.jsx";
import Login from "./pages/Login.jsx";
import UpdateProduct from "./pages/Update.jsx";
import ViewProducts from "./pages/ViewProducts.jsx";
import Addproduct from "./pages/Addproduct.jsx";
import AddCarouselImg from "./pages/AddCarouselImg.jsx";
import PopularProducts from "./pages/PopularProducts.jsx";
import ViewUsers from "./pages/ViewUsers.jsx";
import ViewOrders from "./pages/ViewOrders.jsx";
import NoPage from "./pages/NoPage.jsx";
import Profile from "./pages/Profile.jsx";
import AddSubAdmin from "./pages/AddSubAdmin.jsx";
import ViewSubAdmin from "./pages/ViewSubAdmin.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/viewproducts",
    element: (
      <Navbar>
        <ViewProducts />
      </Navbar>
    ),
  },
  {
    path: "/update/:_id",
    element: (
      <Navbar>
        <UpdateProduct />
      </Navbar>
    ),
  },
  {
    path: "/viewusers",
    element: (
      <Navbar>
        <ViewUsers />
      </Navbar>
    ),
  },
  {
    path: "/viewuserprofile/:userId",
    element: (
      <Navbar>
        <Profile />
      </Navbar>
    ),
  },
  {
    path: "/add",
    element: (
      <Navbar>
        <Addproduct />
      </Navbar>
    ),
  },
  {
    path: "/addcarousel",
    element: (
      <Navbar>
        <AddCarouselImg />
      </Navbar>
    ),
  },
  {
    path: "/popularproducts",
    element: (
      <Navbar>
        <PopularProducts />
      </Navbar>
    ),
  },
  {
    path: "/vieworders",
    element: (
      <Navbar>
        <ViewOrders />
      </Navbar>
    ),
  },
  {
    path: "/viewsubadmins",
    element: (
      <Navbar>
        <ViewSubAdmin />
      </Navbar>
    ),
  },
  {
    path: "/addsubadmin",
    element: (
      <Navbar>
        <AddSubAdmin />
      </Navbar>
    ),
  },
  {
    path: "*",
    element: <NoPage />,
  },
  {
    path: "/orders",
    element: (
      <SubNavbar>
        <ViewOrders />
      </SubNavbar>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="154374303742-6fvp12c1uut9b1l6qnlpr6esvt2d3eq9.apps.googleusercontent.com">
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </GoogleOAuthProvider>
);
