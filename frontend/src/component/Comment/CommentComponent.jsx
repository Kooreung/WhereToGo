import React from "react";
import { Box } from "@chakra-ui/react";
import CommentWrite from "./CommentWrite.jsx";
import CommentList from "./CommentList.jsx";

export function CommentComponent({ postId, isTransition, setIsTransition }) {
  return (
    <Box>
      <Box fontSize={"lg"} alignContent={"center"}></Box>
      <CommentWrite
        postId={postId}
        isTransition={isTransition}
        setIsTransition={setIsTransition}
      ></CommentWrite>
      <CommentList
        postId={postId}
        isTransition={isTransition}
        setIsTransition={setIsTransition}
      ></CommentList>
    </Box>
  );
}

export default CommentComponent;
