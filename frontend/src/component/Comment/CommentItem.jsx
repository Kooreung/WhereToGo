import React, { useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import CommentEdit from "./CommentEdit.jsx";
import axios from "axios";

function CommentItem({ comment }) {
  const [isEditing, setIsEditing] = useState(false);

  function handleRemoveSubmit() {
    axios.delete("/api/comment/delete", {
      data: { commentId: comment.commentId },
    });
  }

  return (
    <Box>
      {isEditing || (
        <Box>
          <Box>
            <Text>{comment.comment}</Text>
          </Box>
          <Button onClick={() => setIsEditing(true)}>수정</Button>
          <Button onClick={handleRemoveSubmit}>삭제</Button>
        </Box>
      )}
      {isEditing && <CommentEdit comment={comment} />}
    </Box>
  );
}

export default CommentItem;
