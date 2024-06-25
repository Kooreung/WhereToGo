import { useTheme } from "@chakra-ui/react";

export const getInputStyles = () => {
  const theme = useTheme();
  return {
    height: theme.sizes[12],
  };
};