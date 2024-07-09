import { Box, Flex } from "@chakra-ui/react";
import React from "react";

export function CommentReplyList({ commentId, replyList }) {
  // if (replyList && replyList.length === 0) {
  //   return (
  //     <Box w={"100%"} borderWidth="1px" borderRadius={"1rem"} p={3}>
  //       작성된 댓글이 없습니다.
  //     </Box>
  //   );
  // }

  return (
    <Box>
      {replyList &&
        replyList.map((replyComment, index) => {
          return (
            <Box key={index}>
              <Flex ml={4} mt={2}>
                <Box mr={3}>{replyComment.nickName}</Box>
                <Box mr={3}>{replyComment.replyComment}</Box>
              </Flex>
            </Box>
          );
        })}
    </Box>
  );
}
