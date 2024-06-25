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
        fontFamily: "Pretendard-Regular, sans-serif",
        fontWeight: 400,
        _dark: {
          textColor: "pink",
        },
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        color: "blackAlpha.900",
        fontFamily: "Pretendard-Bold, sans-serif",
        fontWeight: 800,
        _dark: {
          color: "pink",
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
