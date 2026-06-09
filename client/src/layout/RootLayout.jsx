import React, { useState } from "react";
import { Navbar } from "../components";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
      <Navbar onSearch={setSearchTerm} />
      <Outlet context={{ searchTerm }} />
    </>
  );
};

export default RootLayout;
