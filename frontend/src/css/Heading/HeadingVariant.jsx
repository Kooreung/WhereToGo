import React from "react";
import { Heading } from "@chakra-ui/react";

const presets = {
  small: {
    fontFamily: "Pretendard-SemiBold",
    size: "20px",
  },
  medium: {
    fontFamily: "Pretendard-SemiBold",
    size: "24px",
  },
  large: {
    fontFamily: "Pretendard-Bold",
    size: "28px",
  },
  xlarge: {
    fontFamily: "Pretendard-Bold",
    size: "32px",
  },
};

function HeadingVariant({ variant = "medium", ...props }) {
  const preset = presets[variant] || presets["medium"];

  return (
    <Heading
      fontFamily={preset.size}
      fontSize={preset.size}
      {...props}
    ></Heading>
  );
}

export default HeadingVariant;
