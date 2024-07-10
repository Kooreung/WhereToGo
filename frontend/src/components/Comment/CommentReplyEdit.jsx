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
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ButtonOutline from "../ui/Button/ButtonOutline.jsx";
import axios from "axios";

export function CommentReplyEdit({
  replyComment,
  isTransition,
  setIsTransition,
  setEditingReplyIndex,
}) {
  const [reWriteComment, setReWriteComment] = useState(
    replyComment.replyComment,
  );
  const toast = useToast();
  const { onClose, isOpen, onOpen } = useDisclosure();

  function handleSubmitEditReply() {
    setIsTransition(true);
    axios
      .put("/api/replycomment/edit", {
        replyComment: reWriteComment,
        replyId: replyComment.replyId,
      })
      .then((res) => {
        toast({
          status: "success",
          description: "수정완료",
          position: "bottom",
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          status: "error",
          isClosable: true,
          description: "수정실패",
        });
      })
      .finally(() => {
        setIsTransition(false);
        setEditingReplyIndex(null);
      });
  }

  function handleEditReplyKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      const trimmedReplyComment = reWriteComment.trim();
      const trimmedOriginalComment = replyComment.replyComment.trim();

      if (
        trimmedReplyComment !== trimmedOriginalComment && // 제거된 reWriteComment가 원래 코멘트와 다르고
        trimmedReplyComment.length > 0 // 제거된 reWriteComment의 길이가 0보다 크면
      ) {
        onOpen();
      } else {
        toast({
          status: "error",
          isClosable: true,
          description: "이전 댓글과 동일합니다",
          position: "bottom",
        });
      }

      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <Box>
      <Box>
        Comment수정
        <Flex>
          <Textarea
            mb={4}
            value={reWriteComment}
            onChange={(e) => setReWriteComment(e.target.value)}
            onKeyDown={handleEditReplyKeyDown}
          />
        </Flex>
        <Box>
          <Button onClick={onOpen}>확인</Button>
          <ButtonOutline onClick={() => setEditingReplyIndex(null)}>
            취소
          </ButtonOutline>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalBody>수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmitEditReply}>확인</Button>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
