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

function CommentWrite({ postId, isTransition, setIsTransition }) {
  const [comment, setComment] = useState("");
  const toast = useToast();
  const account = useContext(LoginContext);
  const { isOpen, onClose, onOpen } = useDisclosure();

  function handleSubmitComment() {
    if (!account.isLoggedIn()) {
      return;
    }
    setIsTransition(true);
    axios
      .post("/api/comment/add", { postId, comment })
      .then((res) => {
        setComment("");
        toast({
          status: "success",
          position: "top",
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

  return (
    <Box w={"720px"} my={"16px"} mt={3}>
      <Box>
        <Textarea
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          placeholder={"댓글을 입력하세요"}
        />
      </Box>
      <Flex justify={"end"} mt={3}>
        <Tooltip
          isDisabled={account.isLoggedIn()}
          hasArrow
          label={"회원만 작성 가능합니다"}
        >
          <Button
            onClick={onOpen}
            isLoading={isTransition}
            isDisabled={!account.isLoggedIn() || comment.length === 0}
          >
            작성
          </Button>
        </Tooltip>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>작성 확인</ModalHeader>
          <ModalBody>작성하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleSubmitComment}>확인</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CommentWrite;
