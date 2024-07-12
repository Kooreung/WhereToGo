import React, { useState } from "react";
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
import axios from "axios";
import ButtonNeo from "../ui/Button/ButtonNeo.jsx";

function CommentEdit({ comment, isTransition, setIsEditing, setIsTransition }) {
  const [reWriteComment, setReWriteComment] = useState(comment.comment);
  const toast = useToast();
  const { onOpen, isOpen, onClose } = useDisclosure();

  function handleEditSubmit() {
    setIsTransition(true);
    const trimmedComment = reWriteComment.trim();
    const trimmedOriginalComment = comment.comment.trim();

    if (
      trimmedComment !== trimmedOriginalComment && // 제거된 reWriteComment가 원래 코멘트와 다르고
      trimmedComment.length > 0 // 제거된 reWriteComment의 길이가 0보다 크면
    ) {
      onOpen();
      axios
        .put("/api/comment/edit", {
          comment: reWriteComment,
          commentId: comment.commentId,
        })
        .then((res) => {
          toast({
            status: "success",
            position: "bottom",
            isClosable: true,
            description: "수정완료",
          });
        })
        .catch((err) => {})
        .finally(() => {
          setIsTransition(false);
          setIsEditing(false);
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

  function handleSubmitKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      const trimmedComment = reWriteComment.trim();
      const trimmedOriginalComment = comment.comment.trim();

      if (
        trimmedComment !== trimmedOriginalComment && // 제거된 reWriteComment가 원래 코멘트와 다르고
        trimmedComment.length > 0 // 제거된 reWriteComment의 길이가 0보다 크면
      ) {
        onOpen();
      }

      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <Box>
      <Box>
        <Textarea
          value={reWriteComment}
          onChange={(e) => setReWriteComment(e.target.value)}
          onKeyDown={handleSubmitKeyDown}
        />
      </Box>
      <Flex mt={2}>
        <ButtonNeo onClick={onOpen} isLoading={isTransition} mr={1}>
          확인
        </ButtonNeo>
        <ButtonNeo onClick={() => setIsEditing(false)} size={"sm"}>
          취소
        </ButtonNeo>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalBody>수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={handleEditSubmit}>확인</Button>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CommentEdit;
