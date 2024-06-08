import React from "react";
import { Box } from "@chakra-ui/react";
import CommentWrite from "./CommentWrite.jsx";
import CommentList from "./CommentList.jsx";

function CommentComponent(props) {
  return (
    <Box>
      <Box>Comment</Box>
      <CommentWrite></CommentWrite>
      <CommentList></CommentList>
    </Box>
  );
}

export default CommentComponent;
