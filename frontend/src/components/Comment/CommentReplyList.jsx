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
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../ui/LoginProvider.jsx";
import ButtonCircle from "../ui/Button/ButtonCircle.jsx";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommentReplyEdit } from "./CommentReplyEdit.jsx";
import axios from "axios";

export function CommentReplyList({ replyList, isTransition, setIsTransition }) {
  const account = useContext(LoginContext);
  const [editingReplyIndex, setEditingReplyIndex] = useState(null);
  const headColor = useColorModeValue(
    "rgba(131, 96, 145, 1)",
    "rgba(216, 183, 229, 1)",
  );
  const toast = useToast();
  // 각 대댓글 모달 상태 관리
  const [modalOpenIndex, setModalOpenIndex] = useState(null);
  const handleOpenModal = (index) => {
    setModalOpenIndex(index);
  };
  const handleCloseModal = () => {
    setModalOpenIndex(null);
  };

  const handleRemoveReply = (replyId) => {
    setIsTransition(true);
    axios
      .delete("/api/replycomment/delete", {
        data: { replyId },
      })
      .then((res) => {
        toast({
          status: "success",
          position: "bottom",
          isClosable: true,
          description: "댓글 삭제 완료",
        });
      })
      .catch((err) => {})
      .finally(() => {
        setIsTransition(false);
        handleCloseModal();
      });
  };

  return (
    <Box>
      {replyList.map((replyComment, index) => {
        const isEditing = editingReplyIndex === index;
        const isModalOpen = modalOpenIndex === index;

        return (
          <Box key={index}>
            {isEditing ? (
              <CommentReplyEdit
                replyComment={replyComment}
                isTransition={isTransition}
                setIsTransition={setIsTransition}
                setEditingReplyIndex={setEditingReplyIndex}
              />
            ) : (
              <Flex mt={2}>
                <Box ml={4}>
                  <Box mr={3} color={headColor} fontWeight="bolder">
                    {replyComment.nickName}
                  </Box>
                  <Text mr={3} w={{ base: "650px", lg: "550px", sm: "450px" }}>
                    {replyComment.replyComment}
                  </Text>
                </Box>
                <Spacer />
                <Box>
                  <Text color="lightgray">{replyComment.createDate}</Text>
                  {account.hasAccessMemberId(replyComment.memberId) && (
                    <Flex gap={3}>
                      <ButtonCircle onClick={() => setEditingReplyIndex(index)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </ButtonCircle>
                      <ButtonCircle onClick={() => handleOpenModal(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </ButtonCircle>
                    </Flex>
                  )}
                </Box>
              </Flex>
            )}
            {/* Modal for each reply */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>삭제 확인</ModalHeader>
                <ModalBody>삭제하시겠습니까?</ModalBody>
                <ModalFooter>
                  <Button
                    onClick={() => handleRemoveReply(replyComment.replyId)}
                  >
                    확인
                  </Button>
                  <Button onClick={handleCloseModal}>취소</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        );
      })}
    </Box>
  );
}
