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
  styles: {
    global: {
      body: {
        textColor: "blackAlpha.900",
        _dark: {
          textColor: "pink",
        },
      },
    },
  },
  components: {
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
