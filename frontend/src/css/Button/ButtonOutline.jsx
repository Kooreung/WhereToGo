import React from "react";
import {
  Button,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";

// 사이즈 별 분류 , 반응에 따른 사이즈
const presets = {
  SquaSmall: {
    lg: {
      w: "20px",
      h: "20px",
    },
    sm: {
      w: "12px",
      h: "12px",
    },
  },
  SquaMedium: {
    lg: {
      w: "40px",
      h: "40px",
    },
    sm: {
      w: "32px",
      h: "32px",
    },
  },
  SquaLarge: {
    lg: {
      w: "60px",
      h: "60px",
    },
    sm: {
      w: "52px",
      h: "52px",
    },
  },
  RecSmall: {
    lg: {
      w: "60px",
      h: "30px",
    },
    sm: {
      w: "50px",
      h: "25px",
    },
  },
  RecMedium: {
    lg: {
      w: "80px",
      h: "40px",
    },
    sm: {
      w: "70px",
      h: "35px",
    },
  },
  RecLarge: {
    lg: {
      w: "100px",
      h: "50px",
    },
    sm: {
      w: "90px",
      h: "45px",
    },
  },
};

const bgColor = useColorModeValue(
  "rgba(216, 183, 229, 0.5)",
  "rgba(131, 96, 145, 0.5)",
);

function ButtonOutline({ variant = "SquaMedium", ...props }) {
  // 기본 프리셋 값 medium
  const preset = presets[variant] || presets["SquaMedium"];

  const buttonWidth = useBreakpointValue({
    lg: preset.lg.w,
    sm: preset.sm.w,
  });

  const buttonHeight = useBreakpointValue({
    lg: preset.lg.h,
    sm: preset.sm.h,
  });

  // 해당 컴포넌트의 설정 값
  return (
    <Button
      w={buttonWidth}
      h={buttonHeight}
      variant={"outline"}
      color={bgColor}
      colorScheme={bgColor}
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

export default ButtonOutline;
