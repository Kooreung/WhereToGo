import React from "react";
import { Flex } from "@chakra-ui/react";
import CommentWrite from "./CommentWrite.jsx";
import CommentList from "./CommentList.jsx";

export function CommentComponent({ postId, isTransition, setIsTransition }) {
  return (
    <Flex
      maxW={"720px"}
      w={"100%"}
      direction={"column"}
      align={"center"}
      justify={"center"}
    >
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
    </Flex>
  );
}

export default CommentComponent;
