import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import CommentItem from "./CommentItem.jsx";

function CommentList({ postId, isTransition, setIsTransition, commentId }) {
  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    if (!isTransition) {
      axios.get(`/api/comment/list/${postId}`).then((res) => {
        setCommentList(res.data);
      });
    }
  }, [isTransition]);
  if (commentList.length === 0) {
    return (
      <Box w={"100%"} borderWidth="1px" borderRadius={"1rem"} p={3}>
        작성된 댓글이 없습니다.
      </Box>
    );
  }
  return (
    <Box w={"100%"}>
      {commentList.map((comment) => (
        <CommentItem
          postId={postId}
          commentId={comment.commentId}
          comment={comment}
          key={comment.commentId}
          isTransition={isTransition}
          setIsTransition={setIsTransition}
        />
      ))}
    </Box>
  );
}

export default CommentList;
