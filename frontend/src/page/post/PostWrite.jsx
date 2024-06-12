import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
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
import { GuideLineMediumBanner } from "../../css/CustomStyles.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PostWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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

  // 저장 버튼 비활성화 조건
  let disableSaveButton = false;
  if (title.trim().length === 0) {
    disableSaveButton = true;
  }
  if (content.trim().length === 0) {
    disableSaveButton = true;
  }

  // 저장 버튼 클릭 시
  function handleClickSave() {
    setLoading(true);
    axios
      .postForm("/api/post/add", { title, content })
      .then(() => {
        navigate(`/post/list`);
        toast({
          status: "success",
          position: "bottom",
          description: "게시글이 등록되었습니다.",
        });
      })
      .catch()
      .finally(() => setLoading(false));
  }

  // 취소 버튼 클릭 시
  function handleClickCancel() {
    navigate("/post/list");
    toast({
      status: "info",
      position: "bottom",
      description: "게시글 작성이 취소되었습니다.",
    });
  }

  return (
    <Box>
      <Grid templateColumns={"repeat(1,1fr)"} templateRows={"repeat(4,1fr)"}>
        <GridItem></GridItem>
      </Grid>
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
                  defaultValue={"제목"}
                  onChange={(e) => setTitle(e.target.value)}
                ></Input>
              </FormControl>
            </Box>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>작성자</FormLabel>
                <Input value={"작성자"} readOnly></Input>
              </FormControl>
            </Box>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea
                  h={200}
                  defaultValue={"내용을 작성해주세요."}
                  onChange={(e) => setContent(e.target.value)}
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
                등록
              </Button>
              <Button onClick={onModalOpenOfCancel}>취소</Button>
              {/* Todo 게시글 작성 중 임시저장 필요 */}
            </Box>
          </Box>
        </Box>
      </Flex>

      {/* 게시글 작성 저장 Modal */}
      <Modal isOpen={isModalOpenOfSave} onClose={onModalCloseOfSave}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시글 저장</ModalHeader>
          <ModalBody>게시글을 등록하시겠습니까?</ModalBody>
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
          <ModalHeader>게시글 작성 취소</ModalHeader>
          <ModalBody>작성을 취소하시겠습니까?</ModalBody>
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

export default PostWrite;
