import React from "react";
import { Flex } from "@chakra-ui/react";

const presets = {
  small: {
    size: "20px",
  },
  medium: {
    size: "40px",
  },
  large: {
    size: "60px",
  },
};

function ButtonCircle({ variant = "medium", ...props }) {
  const preset = presets[variant] || presets["medium"];

  return (
    <Flex
      boxShadow="md"
      borderRadius="100%"
      color={"#836091"}
      w={preset.size}
      h={preset.size}
      cursor={"pointer"}
      align={"center"}
      justifyContent="center"
      sx={{
        "&:hover": {
          backgroundColor: "RGBA(0, 0, 0, 0.1)",
        },
      }}
      {...props}
    />
  );
}

export default ButtonCircle;
