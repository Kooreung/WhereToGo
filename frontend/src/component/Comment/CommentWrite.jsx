import React, { useContext, useState } from "react";
import { Box, Button, Textarea, Tooltip, useToast } from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "../LoginProvider.jsx";

function CommentWrite({ postId, isTransition, setIsTransition }) {
  const [comment, setComment] = useState("");
  const toast = useToast();
  const account = useContext(LoginContext);
  console.log("comment", comment);

  function handleSubmitComment() {
    if (!account.isLoggedIn()) {
      return;
    }
    setIsTransition(true);
    axios
      .post("/api/comment/add", { postId, comment })
      .then((res) => {
        setComment("");
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
        <Tooltip
          isDisabled={account.isLoggedIn()}
          hasArrow
          label={"회원만 작성 가능합니다"}
        >
          <Button onClick={handleSubmitComment} isLoading={isTransition}>
            작성
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default CommentWrite;
