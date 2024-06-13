import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { GuideLineMediumBanner } from "../../css/CustomStyles.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function PostEdit() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const {
    isOpen: isModalOpenOfSave,
    onOpen: onModalOpenOfSave,
    onClose: onModalCloseOfSave,
  } = useDisclosure();
  const {
    isOpen: isModalOpenOfCancel,
    onOpen: onModalOpenOfCancel,
    onClose: onModalCloseOfCancel,
  } = useDisclosure();

  useEffect(() => {
    axios.get(`/api/post/${postId}`).then((res) => {
      setPost(res.data.post);
    });
  }, []);

  // 게시글 번호 확인
  if (post === null || post === undefined) {
    return <Spinner />;
  }

  // 저장 버튼 비활성화 조건
  let disableSaveButton = false;
  if (post.title.trim().length === 0) {
    disableSaveButton = true;
  }
  if (post.content.trim().length === 0) {
    disableSaveButton = true;
  }

  // 저장 버튼 클릭 시
  function handleClickSave() {
    setLoading(true);
    axios
      .putForm(`/api/post/edit`, {
        postId: post.postId,
        title: post.title,
        content: post.content,
      })
      .then(() => {
        navigate(`/post/${postId}`);
        toast({
          status: "success",
          position: "bottom",
          description: "게시글이 수정되었습니다.",
        });
      })
      .catch()
      .finally(() => setLoading(false));
  }

  // 취소 버튼 클릭 시
  function handleClickCancel() {
    navigate(`/post/${postId}`);
    toast({
      status: "info",
      position: "bottom",
      description: "게시글 작성이 취소되었습니다.",
    });
  }

  return (
    <Box>
      <Flex justify={"space-evenly"}>
        <Box>
          <Box {...GuideLineMediumBanner} w={500} h={500}>
            지도
          </Box>
          <Box {...GuideLineMediumBanner} w={500}>
            추가 dsadas
          </Box>
        </Box>
        <Box>
          <Box {...GuideLineMediumBanner} w={500} h={1000} p={10}>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>제목</FormLabel>
                <Input
                  defaultValue={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                ></Input>
              </FormControl>
            </Box>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>작성자</FormLabel>
                <Input defaultValue={post.nickName} readOnly></Input>
              </FormControl>
            </Box>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea
                  h={200}
                  defaultValue={post.content}
                  onChange={(e) =>
                    setPost({ ...post, content: e.target.value })
                  }
                ></Textarea>
              </FormControl>
            </Box>
          </Box>
          <Box>
            <Box align={"left"} my={10}>
              <Button
                onClick={onModalOpenOfSave}
                isLoading={loading}
                isDisabled={disableSaveButton}
              >
                저장
              </Button>
              <Button onClick={onModalOpenOfCancel}>취소</Button>
            </Box>
          </Box>
        </Box>
      </Flex>

      {/* 게시글 작성 저장 Modal */}
      <Modal isOpen={isModalOpenOfSave} onClose={onModalCloseOfSave}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시글 수정</ModalHeader>
          <ModalBody>게시글 수정 내용을 저장하시겠습니까?</ModalBody>
          <ModalFooter>
            <Flex>
              <Button onClick={handleClickSave}>확인</Button>
              <Button onClick={onModalCloseOfSave}>취소</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 게시글 작성 취소 Modal */}
      <Modal isOpen={isModalOpenOfCancel} onClose={onModalCloseOfCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시글 수정 취소</ModalHeader>
          <ModalBody>게시글 수정을 취소하시겠습니까?</ModalBody>
          <ModalFooter>
            <Flex>
              <Button onClick={handleClickCancel}>확인</Button>
              <Button onClick={onModalCloseOfCancel}>취소</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
