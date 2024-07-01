import React from "react";
import { Flex, Spacer } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar.jsx";
import Footer from "../component/Footer.jsx";

function Home() {
  return (
    <Flex direction="column" justify="start" alignItems="center" minH={"100vh"}>
      <Navbar />
      <Outlet />
      <Spacer />
      <Footer />
    </Flex>
  );
}

export default Home;
