import React from "react";
import { Box } from "@chakra-ui/react";

function ButtonCustom(props) {
  return (
    <Box
      fontSize="xl"
      fontWeight="bolder"
      color={"#D8B7E5"}
      boxShadow="2xl"
      p="4"
      rounded="3xl"
      backgroundColor={"RGBA(255, 255, 255, 0.92)"}
      {...props}
    ></Box>
  );
}

export default ButtonCustom;
