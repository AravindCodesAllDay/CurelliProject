import React from "react";
import Header from "../_components/Header";
import ProfileDetails from "./ProfileDetails";
import Address from "./Address";
import { ToastContainer } from "react-toastify";

const Profile: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <Header title={`Profile`} />
      <ProfileDetails />
      <Address />
    </>
  );
};

export default Profile;
