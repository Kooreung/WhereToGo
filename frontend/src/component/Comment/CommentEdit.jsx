import React, { useState } from "react";
import { Box, Button, Textarea } from "@chakra-ui/react";
import axios from "axios";

function CommentEdit({ comment }) {
  const [reWriteComment, setReWriteComment] = useState(comment.comment);

  function handleEditSubmit() {
    axios
      .put("/api/comment/edit", {
        comment: reWriteComment,
        commentId: comment.commentId,
      })
      .then((res) => {});
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
        <Button onClick={handleEditSubmit}>확인</Button>
        <Button>취소</Button>
      </Box>
    </Box>
  );
}

export default CommentEdit;
