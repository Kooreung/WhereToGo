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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import CommentEdit from "./CommentEdit.jsx";
import axios from "axios";
import { LoginContext } from "../LoginProvider.jsx";
import ButtonCircle from "../../css/Button/ButtonCircle.jsx";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function CommentItem({ comment, isTransition, setIsTransition }) {
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();
  const account = useContext(LoginContext);
  const { onClose, isOpen, onOpen } = useDisclosure();
  const headColor = useColorModeValue("purple", "pink");

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

  return (
    <Box>
      {isEditing || (
        <Box>
          <Flex
            w={"720px"}
            my={"16px"}
            borderWidth="1px"
            borderRadius={"lg"}
            p={2}
          >
            <Box>
              <Text color={headColor} fontWeight={"bolder"} m1={1}>
                {comment.nickName}
              </Text>
              <Text>{comment.comment}</Text>
            </Box>
            <Spacer />
            <Box>
              <Text color={"lightgray"}>{comment.createDate}</Text>
              {account.hasAccessMemberId(comment.memberId) && (
                <Flex align={"center"} gap={3}>
                  <ButtonCircle onClick={() => setIsEditing(true)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </ButtonCircle>
                  <ButtonCircle onClick={onOpen} isLoading={isTransition}>
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
