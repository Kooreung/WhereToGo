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
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { LoginContext } from "../LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

function CommentWrite({ postId, isTransition, setIsTransition }) {
  const [comment, setComment] = useState("");
  const toast = useToast();
  const account = useContext(LoginContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();

  function handleSubmitComment() {
    if (!account.isLoggedIn() || isTransition || !comment.trim()) {
      return;
    }
    setIsTransition(true);
    axios
      .post("/api/comment/add", { postId, comment })
      .then((res) => {
        setComment("");
        toast({
          status: "success",
          position: "bottom",
          description: "등록완료",
          isClosable: true,
        });
      })
      .catch((err) => {})
      .finally(() => {
        onClose();
        setIsTransition(false);
      });
  }

  function handleSubmitKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      if (!account.isLoggedIn() || !comment.trim()) {
        toast({
          status: "error",
          position: "bottom",
          description: "댓글을 입력하세요",
          isClosable: true,
        });
      } else {
        onOpen();
      }
    }
  }

  return (
    <Flex align={"center"} justify={"center"} w={"100%"} my={"1rem"}>
      {account.isLoggedIn() && (
        <Box w={"100%"}>
          <Textarea
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder={"댓글을 입력하세요"}
            onKeyDown={handleSubmitKeyDown}
          />
        </Box>
      )}
      <Flex justify={"end"} mt={3}>
        {account.isLoggedIn() && (
          <Tooltip
            isDisabled={account.isLoggedIn()}
            hasArrow
            label={"회원만 작성 가능합니다"}
          >
            <Button
              onClick={onOpen}
              isLoading={isTransition}
              isDisabled={
                !account.isLoggedIn() || comment.length === 0 || !comment.trim()
              }
            >
              작성
            </Button>
          </Tooltip>
        )}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>작성 확인</ModalHeader>
          <ModalBody>작성하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmitComment}>확인</Button>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default CommentWrite;
