import React from "react";
import { Box, Button, Textarea } from "@chakra-ui/react";

function CommentEdit() {
  return (
    <Box>
      Comment수정
      <Box>
        <Textarea />
      </Box>
      <Box>
        <Button>확인</Button>
        <Button>취소</Button>
      </Box>
    </Box>
  );
}

export default CommentEdit;
