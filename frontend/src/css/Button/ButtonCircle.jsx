import React from "react";
import { Circle } from "@chakra-ui/react";

function ButtonCircle(props) {
  return (
    <Circle boxShadow="md" color={"#836091"} p="12px" px={"20px"} {...props} />
  );
}

export default ButtonCircle;
