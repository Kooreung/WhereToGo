import { Box, Flex, Spacer, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { LoginContext } from "../LoginProvider.jsx";
import ButtonCircle from "../../css/Button/ButtonCircle.jsx";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommentReplyEdit } from "./CommentReplyEdit.jsx";

export function CommentReplyList({
  replyList,
  isTransition,
  setIsTransition,
  replyComment,
}) {
  const account = useContext(LoginContext);
  const [editingReplyIndex, setEditingReplyIndex] = useState(null);
  const headColor = useColorModeValue(
    "rgba(131, 96, 145, 1)",
    "rgba(216, 183, 229, 1)",
  );
  return (
    <Box>
      {replyList.map((replyComment, index) => {
        const isEditing = editingReplyIndex === index;
        return (
          <Box key={index}>
            {isEditing ? (
              <CommentReplyEdit
                replyComment={replyComment}
                replyList={replyList}
                isTransition={isTransition}
                setIsTransition={setIsTransition}
                setEditingReplyIndex={setEditingReplyIndex}
              />
            ) : (
              <Flex mt={2}>
                <Box ml={4}>
                  <Box mr={3} color={headColor} fontWeight={"bolder"}>
                    {replyComment.nickName}
                  </Box>
                  <Text mr={3} w={{ base: "650px", lg: "550px", sm: "450px" }}>
                    {replyComment.replyComment}
                  </Text>
                </Box>
                <Spacer />
                <Box>
                  <Text color={"lightgray"}>{replyComment.createDate}</Text>
                  {account.hasAccessMemberId(replyComment.memberId) && (
                    <Flex gap={3}>
                      <ButtonCircle onClick={() => setEditingReplyIndex(index)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </ButtonCircle>
                      <ButtonCircle>
                        <FontAwesomeIcon icon={faTrash} />
                      </ButtonCircle>
                    </Flex>
                  )}
                </Box>
              </Flex>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
