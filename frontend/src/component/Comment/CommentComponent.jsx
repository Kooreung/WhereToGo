import React from "react";
import { Box } from "@chakra-ui/react";
import CommentWrite from "./CommentWrite.jsx";
import CommentList from "./CommentList.jsx";

export function CommentComponent({ postId }) {
  return (
    <Box>
      <Box>Comment</Box>
      <CommentList postId={postId}></CommentList>
      <CommentWrite postId={postId}></CommentWrite>
    </Box>
  );
}

export default CommentComponent;
