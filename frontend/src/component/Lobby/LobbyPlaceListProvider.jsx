import React from "react";
import { Avatar, Box, WrapItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function LobbyPlaceListProvider({ onClick, src }) {
  const navigate = useNavigate();
  return (
    <Box onClick={onClick} cursor="pointer">
      <WrapItem>
        <Avatar size="xl" name="Dan Abrahmov" src={src} />
      </WrapItem>
    </Box>
  );
}

export default LobbyPlaceListProvider;
