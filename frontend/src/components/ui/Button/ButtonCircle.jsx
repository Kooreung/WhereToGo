import React from "react";
import { Flex, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";

// 사이즈 별 분류 , 반응에 따른 사이즈
const presets = {
  small: {
    lg: {
      size: "20px",
    },
    sm: {
      size: "12px",
    },
  },
  medium: {
    lg: {
      size: "40px",
    },
    sm: {
      size: "32px",
    },
  },
  large: {
    lg: {
      size: "60px",
    },
    sm: {
      size: "52px",
    },
  },
};

function ButtonCircle({ variant = "medium", ...props }) {
  // 기본 프리셋 값 medium
  const preset = presets[variant] || presets["medium"];
  const arrowColor = useColorModeValue(
    "rgba(131, 96, 145, 1)",
    "rgba(216, 183, 229, 1)",
  );
  const bgColor = useColorModeValue(
    "rgba(216, 183, 229, 0.5)",
    "rgba(131, 96, 145, 0.5)",
  );
  const bgColorHover = useColorModeValue(
    "rgba(131, 96, 145, 0.2)",
    "rgba(216, 183, 229, 0.2)",
  );

  const buttonSize = useBreakpointValue({
    lg: preset.lg.size,
    sm: preset.sm.size,
  });

  // 해당 컴포넌트의 설정 값
  return (
    <Flex
      w={buttonSize}
      h={buttonSize}
      boxShadow="md"
      borderRadius="100%"
      color={arrowColor}
      bgColor={bgColor}
      cursor={"pointer"}
      align={"center"}
      justifyContent="center"
      sx={{
        "&:hover": {
          backgroundColor: bgColorHover,
        },
      }}
      {...props}
    />
  );
}

export default ButtonCircle;
