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
  components: {},
});
