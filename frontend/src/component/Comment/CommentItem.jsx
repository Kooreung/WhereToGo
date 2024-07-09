import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import CommentEdit from "./CommentEdit.jsx";
import axios from "axios";
import { LoginContext } from "../LoginProvider.jsx";
import ButtonCircle from "../../css/Button/ButtonCircle.jsx";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommentReplyList } from "./CommentReplyList.jsx";

function CommentItem({
  postId,
  comment,
  isTransition,
  setIsTransition,
  commentId,
  replyList,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [replyComment, setReplyComment] = useState("");
  const toast = useToast();
  const account = useContext(LoginContext);
  const { onClose, isOpen, onOpen } = useDisclosure();
  const headColor = useColorModeValue(
    "rgba(131, 96, 145, 1)",
    "rgba(216, 183, 229, 1)",
  );

  function handleRemoveSubmit() {
    setIsTransition(true);
    axios
      .delete("/api/comment/delete", {
        data: { commentId: comment.commentId },
      })
      .then((res) => {
        toast({
          status: "success",
          position: "bottom",
          isClosable: true,
          description: "댓글 삭제 완료",
        });
      })
      .catch()
      .finally(() => {
        onClose();
        setIsTransition(false);
      });
  }

  function handleSubmitReply() {
    if (!account.isLoggedIn() || isTransition || !replyComment.trim()) {
      return;
    }
    setIsTransition(true);
    axios
      .post("/api/replycomment/addreply", {
        postId,
        commentId,
        replyComment,
      })
      .then((res) => {
        setReplyComment("");
        toast({
          status: "success",
          position: "bottom",
          description: "등록완료",
          isClosable: true,
        });
      })
      .catch((err) => {})
      .finally(() => {
        setIsTransition(false);
      });
  }

  return (
    <Box>
      {isEditing || (
        <Box>
          <Flex
            maxW={"720px"}
            w={"100%"}
            my={"1rem"}
            borderWidth="1px"
            borderRadius={"1rem"}
            p={3}
          >
            <Box>
              <Text color={headColor} fontWeight={"bolder"} m1={1}>
                {comment.nickName}
              </Text>
              <Flex>
                <Text>{comment.comment}</Text>
                <Text
                  fontSize={"smaller"}
                  ml={4}
                  mt={1}
                  cursor={"pointer"}
                  color={"lightgray"}
                  sx={{
                    "&:hover": {
                      color: `purple`,
                    },
                  }}
                  onClick={() => setIsReply(true)}
                >
                  댓글달기
                </Text>
              </Flex>
              {isReply && (
                <Box>
                  <Flex mt={4}>
                    <Textarea
                      mb={4}
                      onChange={(e) => setReplyComment(e.target.value)}
                      value={replyComment}
                    />
                    <Button onClick={handleSubmitReply}>작성</Button>
                  </Flex>
                </Box>
              )}
              <CommentReplyList commentId={commentId} replyList={replyList} />
            </Box>
            <Spacer />
            <Box>
              <Text color={"lightgray"}>{comment.createDate}</Text>
              {account.hasAccessMemberId(comment.memberId) && (
                <Flex align={"center"} gap={3}>
                  <ButtonCircle onClick={() => setIsEditing(true)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </ButtonCircle>
                  <ButtonCircle onClick={onOpen}>
                    <FontAwesomeIcon icon={faTrash} />
                  </ButtonCircle>
                </Flex>
              )}
            </Box>
          </Flex>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>삭제 확인</ModalHeader>
              <ModalBody>삭제하시겠습니까?</ModalBody>
              <ModalFooter>
                <Button onClick={handleRemoveSubmit}>확인</Button>
                <Button onClick={onClose}>취소</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}
      {isEditing && (
        <CommentEdit
          comment={comment}
          setIsEditing={setIsEditing}
          isTransition={isTransition}
          setIsTransition={setIsTransition}
        />
      )}
    </Box>
  );
}

export default CommentItem;
