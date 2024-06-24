import { useTheme } from "@chakra-ui/react";

export const getInputStyles = () => {
  const theme = useTheme();
  return {
    marginBottom: theme.space[6],
    height: theme.sizes[12],
  };
};