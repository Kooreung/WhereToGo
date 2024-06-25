import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar.jsx";

function Home() {
  return (
    <Box>
      <Navbar />
      <Flex justify={"center"}>
        <Outlet />
      </Flex>
    </Box>
  );
}

export default Home;
