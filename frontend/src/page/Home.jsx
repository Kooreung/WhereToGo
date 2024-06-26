import React from "react";
import { Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar.jsx";

function Home() {
  return (
    <Flex direction="column" justify="center" alignItems="center">
      <Navbar />
      <Outlet />
    </Flex>
  );
}

export default Home;
