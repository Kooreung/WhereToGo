import React, { useState } from "react";
import { Box, Button, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";

function CommentEdit({ comment, isTransition, setIsEditing, setIsTransition }) {
  const [reWriteComment, setReWriteComment] = useState(comment.comment);
  const toast = useToast();

  function handleEditSubmit() {
    setIsTransition(true);
    axios
      .put("/api/comment/edit", {
        comment: reWriteComment,
        commentId: comment.commentId,
      })
      .then((res) => {
        toast({
          status: "success",
          position: "top",
          isClosable: true,
          description: "수정완료",
        });
      })
      .catch((err) => {})
      .finally(() => {
        setIsTransition(false);
        setIsEditing(false);
      });
  }

  return (
    <Box>
      Comment수정
      <Box>
        <Textarea
          value={reWriteComment}
          onChange={(e) => setReWriteComment(e.target.value)}
        />
      </Box>
      <Box>
        <Button onClick={handleEditSubmit} isLoading={isTransition}>
          확인
        </Button>
        <Button>취소</Button>
      </Box>
    </Box>
  );
}

export default CommentEdit;
