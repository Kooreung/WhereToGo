import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import CommentWrite from "./CommentWrite.jsx";
import CommentList from "./CommentList.jsx";

export function CommentComponent({ postId }) {
  const [isTransition, setIsTransition] = useState(false);
  return (
    <Box>
      <Box>Comment</Box>
      <CommentList
        postId={postId}
        isTransition={isTransition}
        setIsTransition={setIsTransition}
      ></CommentList>
      <CommentWrite
        postId={postId}
        isTransition={isTransition}
        setIsTransition={setIsTransition}
      ></CommentWrite>
    </Box>
  );
}

export default CommentComponent;
