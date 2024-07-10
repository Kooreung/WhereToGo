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

function ButtonCircle({ variant = "medium", isDisabled, ...props }) {
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

  return (
    <Flex
      w={buttonSize}
      h={buttonSize}
      boxShadow="md"
      borderRadius="md"
      color={arrowColor}
      bgColor={isDisabled ? "RGBA(0, 0, 0, 0.06)" : bgColor} // isDisabled prop에 따라 배경색 변경
      cursor={isDisabled ? "not-allowed" : "pointer"} // isDisabled prop에 따라 커서 변경
      align="center"
      justifyContent="center"
      fontWeight="bold"
      sx={{
        "&:hover": {
          backgroundColor: isDisabled ? bgColor : bgColorHover,
        },
      }}
      {...props}
      pointerEvents={isDisabled ? "none" : "auto"} // isDisabled prop에 따라 클릭 이벤트 처리
    />
  );
}

export default ButtonCircle;
