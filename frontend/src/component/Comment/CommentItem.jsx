import React, { useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import CommentEdit from "./CommentEdit.jsx";

function CommentItem({ comment }) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Box>
      {isEditing || (
        <Box>
          <Box>
            <Text>{comment.comment}</Text>
          </Box>
          <Button onClick={() => setIsEditing(true)}>수정~</Button>
        </Box>
      )}
      {isEditing && <CommentEdit />}
    </Box>
  );
}

export default CommentItem;
