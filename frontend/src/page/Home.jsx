import React from "react";
import { Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar.jsx";
import Footer from "../component/Footer.jsx";

function Home() {
  return (
    <Flex direction="column" justify="center" alignItems="center">
      <Navbar />
      <Outlet />
      <Footer />
    </Flex>
  );
}

export default Home;
