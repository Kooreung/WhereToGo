import { Box, Button, Flex, Textarea, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import ButtonOutline from "../../css/Button/ButtonOutline.jsx";
import axios from "axios";

export function CommentReplyEdit({
  replyComment,
  isTransition,
  setIsTransition,
  setEditingReplyIndex,
}) {
  const [reWriteComment, setReWriteComment] = useState(
    replyComment.replyComment,
  );
  const toast = useToast();

  function handleSubmitEditReply() {
    setIsTransition(true);
    axios
      .put("/api/replycomment/edit", {
        replyComment: reWriteComment,
        replyId: replyComment.replyId,
      })
      .then((res) => {
        toast({
          status: "success",
          description: "수정완료",
          position: "bottom",
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          status: "error",
          isClosable: true,
          description: "수정실패",
        });
      })
      .finally(() => {
        setIsTransition(false);
        setEditingReplyIndex(null);
      });
  }

  return (
    <Box>
      <Box>
        Comment수정
        <Flex>
          <Textarea
            mb={4}
            value={reWriteComment}
            onChange={(e) => setReWriteComment(e.target.value)}
          />
        </Flex>
        <Box>
          <Button onClick={handleSubmitEditReply}>확인</Button>
          <ButtonOutline onClick={() => setEditingReplyIndex(null)}>
            취소
          </ButtonOutline>
        </Box>
      </Box>
    </Box>
  );
}
