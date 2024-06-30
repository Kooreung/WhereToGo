import { extendTheme } from "@chakra-ui/react";

export const customTheme = extendTheme({
  breakpoints: {
    base: "0em",
    sm: "30em",
    md: "48em",
    lg: "64em",
    xl: "80em",
    "2xl": "96em",
  },
  fonts: {
    body: "Pretendard-Regular, sans-serif",
  },
  styles: {
    global: {
      body: {
        textColor: "blackAlpha.900",
        fontSize: ["16px", "14px", "14px", "16px", "16px", "16px"],
        fontFamily: "Pretendard-Regular, sans-serif",
        fontWeight: 400,
        _dark: {
          textColor: "whiteAlpha.900",
        },
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        color: "#33664F",
        fontFamily: "Pretendard-Bold, sans-serif",
        fontWeight: 800,
        _dark: {
          color: "#D8B7E5",
        },
      },
    },
    Button: {
      variants: {
        solid: {
          bgColor: "#D8B7E5",
          color: "blackAlpha.900",
          _hover: {
            bgColor: "#836091",
          },
          _dark: {
            bgColor: "#836091",
            _hover: {
              bgColor: "#D8B7E5",
            },
          },
        },
      },
    },
  },
});
