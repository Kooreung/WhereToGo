import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { LoginContext } from "../LoginProvider.jsx";
import ButtonCircle from "../../css/Button/ButtonCircle.jsx";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function CommentReplyList({ commentId, replyList }) {
  const account = useContext(LoginContext);
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
              <Flex mt={2}>
                <Box ml={4}>
                  <Box mr={3}>{replyComment.nickName}</Box>
                  <Text mr={3} w={{ base: "650px", lg: "550px", sm: "450px" }}>
                    {replyComment.replyComment}
                  </Text>
                </Box>
                <Spacer />
                <Box>
                  <Text color={"lightgray"}>{replyComment.createDate}</Text>
                  {account.hasAccessMemberId(replyComment.memberId) && (
                    <Flex gap={3}>
                      <ButtonCircle>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </ButtonCircle>
                      <ButtonCircle>
                        <FontAwesomeIcon icon={faTrash} />
                      </ButtonCircle>
                    </Flex>
                  )}
                </Box>
              </Flex>
            </Box>
          );
        })}
    </Box>
  );
}
