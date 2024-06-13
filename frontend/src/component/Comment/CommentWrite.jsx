import React, { useState } from "react";
import { Box, Button, Textarea } from "@chakra-ui/react";
import axios from "axios";

function CommentWrite({ postId }) {
  const [comment, setComment] = useState("");
  console.log("comment", comment);

  function handleSubmitComment() {
    axios.post("/api/comment/add", { postId, comment });
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
        <Button onClick={handleSubmitComment}>작성</Button>
      </Box>
    </Box>
  );
}

export default CommentWrite;
