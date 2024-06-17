import React, { useState } from "react";
import {
  Box,
  Button,
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

function CommentEdit({ comment, isTransition, setIsEditing, setIsTransition }) {
  const [reWriteComment, setReWriteComment] = useState(comment.comment);
  const toast = useToast();
  const { onOpen, isOpen, onClose } = useDisclosure();

  function handleEditSubmit() {
    setIsTransition(true);
    axios
      .put("/api/comment/edit", {
        comment: reWriteComment,
        commentId: comment.commentId,
      })
      .then((res) => {
        toast({
          status: "success",
          position: "top",
          isClosable: true,
          description: "수정완료",
        });
      })
      .catch((err) => {})
      .finally(() => {
        onClose();
        setIsTransition(false);
        setIsEditing(false);
      });
  }

  return (
    <Box>
      Comment수정
      <Box>
        <Textarea
          value={reWriteComment}
          onChange={(e) => setReWriteComment(e.target.value)}
        />
      </Box>
      <Box>
        <Button
          onClick={onOpen}
          isLoading={isTransition}
          isDisabled={
            comment.comment === reWriteComment || reWriteComment.length === 0
          }
        >
          확인
        </Button>
        <Button onClick={() => setIsEditing(false)}>취소</Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalBody>수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleEditSubmit}>확인</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CommentEdit;
