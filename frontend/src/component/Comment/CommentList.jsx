import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import CommentItem from "./CommentItem.jsx";

function CommentList({ postId, isTransition, setIsTransition }) {
  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    if (!isTransition) {
      axios.get(`/api/comment/list/${postId}`).then((res) => {
        setCommentList(res.data);
      });
    }
  }, [isTransition]);
  if (commentList.length === 0) {
    return <Box>댓글이 없습니당</Box>;
  }
  return (
    <Box>
      <Box p={3}>
        {commentList.map((comment) => (
          <CommentItem
            comment={comment}
            key={comment.commentId}
            isTransition={isTransition}
            setIsTransition={setIsTransition}
          />
        ))}
      </Box>
    </Box>
  );
}

export default CommentList;
