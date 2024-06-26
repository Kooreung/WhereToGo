import React from "react";
import { Heading, useBreakpointValue } from "@chakra-ui/react";

// 사이즈 별 분류 , 반응에 따른 사이즈
const presets = {
  xsmall: {
    lg: {
      fontFamily: "Pretendard-SemiBold",
      size: "16px",
    },
    sm: {
      fontFamily: "Pretendard-SemiBold",
      size: "16px",
    },
  },
  small: {
    lg: {
      fontFamily: "Pretendard-SemiBold",
      size: "20px",
    },
    sm: {
      fontFamily: "Pretendard-SemiBold",
      size: "16px",
    },
  },
  medium: {
    lg: {
      fontFamily: "Pretendard-SemiBold",
      size: "24px",
    },
    sm: {
      fontFamily: "Pretendard-SemiBold",
      size: "20px",
    },
  },
  large: {
    lg: {
      fontFamily: "Pretendard-Bold",
      size: "28px",
    },
    sm: {
      fontFamily: "Pretendard-Bold",
      size: "24px",
    },
  },
  xlarge: {
    lg: {
      fontFamily: "Pretendard-Bold",
      size: "32px",
    },
    sm: {
      fontFamily: "Pretendard-Bold",
      size: "28px",
    },
  },
};

function HeadingVariant({ variant = "medium", ...props }) {
  // 기본 프리셋 값 medium
  const preset = presets[variant] || presets["medium"];

  const fontFamily = useBreakpointValue({
    lg: preset.lg.fontFamily,
    sm: preset.sm.fontFamily,
  });
  const fontSize = useBreakpointValue({
    lg: preset.lg.size,
    sm: preset.sm.size,
  });

  // 해당 컴포넌트의 설정 값
  return (
    <Heading fontFamily={fontFamily} fontSize={fontSize} {...props}></Heading>
  );
}

export default HeadingVariant;
