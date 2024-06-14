import React, { useState } from "react";
import { Box, Button, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";

function CommentWrite({ postId, isTransition, setIsTransition }) {
  const [comment, setComment] = useState("");
  const toast = useToast();
  console.log("comment", comment);

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
    <Box>
      <Box>
        <Textarea
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
      </Box>
      <Box>
        <Button onClick={handleSubmitComment} isLoading={isTransition}>
          작성
        </Button>
      </Box>
    </Box>
  );
}

export default CommentWrite;
