import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import CommentItem from "./CommentItem.jsx";

function CommentList({ postId }) {
  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    axios.get(`/api/comment/list/${postId}`).then((res) => {
      setCommentList(res.data);
    });
  }, []);
  return (
    <Box>
      <Box>
        {commentList.map((comment) => (
          <CommentItem comment={comment} key={comment.commentid} />
        ))}
      </Box>
    </Box>
  );
}

export default CommentList;
