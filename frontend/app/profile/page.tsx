import React from "react";
import Header from "../_components/Header";
import ProfileDetails from "./ProfileDetails";
import Address from "./Address";

const Profile: React.FC = () => {
  return (
    <>
      <Header title={`Profile`} />
      <ProfileDetails />
      <Address />
    </>
  );
};

export default Profile;
