import React from "react";
import { Heading } from "@chakra-ui/react";

function HeadingLarge(props) {
  return (
    <Heading
      fontSize={"24px"}
      fontFamily={"Pretendard-Bold"}
      {...props}
    ></Heading>
  );
}

export default HeadingLarge;
