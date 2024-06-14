import React, { useContext, useState } from "react";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import CommentEdit from "./CommentEdit.jsx";
import axios from "axios";
import { LoginContext } from "../LoginProvider.jsx";

function CommentItem({ comment, isTransition, setIsTransition }) {
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();
  const account = useContext(LoginContext);

  function handleRemoveSubmit() {
    setIsTransition(true);
    axios
      .delete("/api/comment/delete", {
        data: { commentId: comment.commentId },
      })
      .then((res) => {
        toast({
          status: "success",
          position: "top",
          isClosable: true,
          description: "댓글 삭제 완료",
        });
      })
      .catch()
      .finally(() => {
        setIsTransition(false);
      });
  }

  return (
    <Box>
      {isEditing || (
        <Box>
          <Box>
            <Text>{comment.nickName}</Text>
            <Text>{comment.comment}</Text>
          </Box>
          {account.hasAccessMemberId(comment.memberId) && (
            <Box>
              <Button onClick={() => setIsEditing(true)}>수정</Button>
              <Button onClick={handleRemoveSubmit} isLoading={isTransition}>
                삭제
              </Button>
            </Box>
          )}
        </Box>
      )}
      {isEditing && (
        <CommentEdit
          comment={comment}
          setIsEditing={setIsEditing}
          isTransition={isTransition}
          setIsTransition={setIsTransition}
        />
      )}
    </Box>
  );
}

export default CommentItem;
