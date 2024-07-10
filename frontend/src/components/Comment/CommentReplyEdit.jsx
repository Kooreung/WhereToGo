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
import axios from "axios";
import ButtonNeo from "../ui/Button/ButtonNeo.jsx";

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
    const trimmedReplyComment = reWriteComment.trim();
    const trimmedOriginalComment = replyComment.replyComment.trim();

    if (
      trimmedReplyComment !== trimmedOriginalComment && // 제거된 reWriteComment가 원래 코멘트와 다르고
      trimmedReplyComment.length > 0 // 제거된 reWriteComment의 길이가 0보다 크면
    ) {
      onOpen();
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
        .catch((err) => {})
        .finally(() => {
          setIsTransition(false);
          setEditingReplyIndex(null);
        });
    } else {
      toast({
        status: "error",
        isClosable: true,
        description: "이전 댓글과 동일합니다",
        position: "bottom",
      });
      onClose();
      setIsTransition(false);
    }
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
        <Flex>
          <Textarea
            mb={2}
            mt={4}
            value={reWriteComment}
            onChange={(e) => setReWriteComment(e.target.value)}
            onKeyDown={handleEditReplyKeyDown}
          />
        </Flex>
        <Flex>
          <ButtonNeo onClick={onOpen} mr={1} size={"large"}>
            확인
          </ButtonNeo>
          <ButtonNeo onClick={() => setEditingReplyIndex(null)}>취소</ButtonNeo>
        </Flex>
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
