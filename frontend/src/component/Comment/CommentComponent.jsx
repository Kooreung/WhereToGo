import React from "react";
import { Box } from "@chakra-ui/react";
import CommentWrite from "./CommentWrite.jsx";
import CommentList from "./CommentList.jsx";
import CommentEdit from "./CommentEdit.jsx";

export function CommentComponent(props) {
  return (
    <Box>
      <Box>Comment</Box>
      <CommentWrite></CommentWrite>
      <CommentEdit />
      <CommentList></CommentList>
    </Box>
  );
}

export default CommentComponent;
