import React, { useState } from "react";
import { Box, Button, Flex, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";

function CommentWrite({ postId, isTransition, setIsTransition }) {
  const [comment, setComment] = useState("");
  const toast = useToast();

  function handleSubmitComment() {
    setIsTransition(true);
    axios
      .post("/api/comment/add", { postId, comment })
      .then((res) => {
        // TODO INPUT 초기화 필요
        toast({
          status: "success",
          position: "top",
          description: "등록완료",
          isClosable: true,
        });
      })
      .catch((err) => {})
      .finally(() => {
        setIsTransition(false);
      });
  }

  return (
    <Box w={"720px"} my={"16px"} mt={3}>
      <Box>
        <Textarea
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
      </Box>
      <Flex justify={"end"} mt={3}>
        <Button onClick={handleSubmitComment} isLoading={isTransition}>
          작성
        </Button>
      </Flex>
    </Box>
  );
}

export default CommentWrite;
