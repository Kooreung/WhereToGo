import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import CommentItem from "./CommentItem.jsx";

function CommentList({ postId, isTransition, setIsTransition, commentId }) {
  const [commentList, setCommentList] = useState([]);
  const [replyCommentList, setReplyCommentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isTransition) {
      const fetchComments = axios.get(`/api/comment/list/${postId}`);
      const fetchReplyComments = axios.get(`/api/replycomment/list/${postId}`);

      Promise.all([fetchComments, fetchReplyComments])
        .then(([commentsRes, replyCommentsRes]) => {
          setCommentList(commentsRes.data);
          setReplyCommentList(replyCommentsRes.data);
        })
        .finally(() => {
          setLoading(false); // 데이터 로드 완료 후 로딩 상태 종료
        });
    }
  }, [isTransition]);

  if (loading) {
    return (
      <Box w={"100%"} borderWidth="1px" borderRadius={"1rem"} p={3}>
        Loading...
      </Box>
    );
  }

  if (commentList.length === 0) {
    return (
      <Box w={"100%"} borderWidth="1px" borderRadius={"1rem"} p={3}>
        작성된 댓글이 없습니다.
      </Box>
    );
  }
  return (
    <Box w={"100%"}>
      {replyCommentList.map((comment) => (
        <CommentItem
          postId={postId}
          replyList={comment.replyList}
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
