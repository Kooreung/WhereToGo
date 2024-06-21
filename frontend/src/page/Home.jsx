import React from "react";
import { Box, Button, useColorMode } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar.jsx";

function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Button>
      <Navbar />
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Home;
