import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../components/ui/LoginProvider.jsx";
import MapView from "../../components/Map/MapView.jsx";
import DraftEditorEdit from "../../components/TextEditor/DraftEditorEdit.jsx";
import Lobby from "../lobby/Lobby.jsx";

export function PostEdit() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState("able");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const account = useContext(LoginContext); // 로그인 상태를 확인하기 위해 LoginContext 에서 isLoggedIn 함수를 가져옴
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

  const fetchPostData = async () => {
    try {
      const res = await axios.get(`/api/post/${postId}`);
      setPost(res.data.post);
    } catch (error) {
      console.error("Failed to fetch post data", error);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [postId]);

  const validatePost = () => {
    if (post.title.trim().length === 0) {
      toast({
        status: "error",
        position: "bottom",
        description: "제목을 다시 확인해주세요.",
      });
      return false;
    }
    if (post.content.trim().length <= 7) {
      toast({
        status: "error",
        position: "bottom",
        description: "내용을 다시 확인해주세요.",
      });
      return false;
    }
    return true;
  };

  // 저장 버튼 클릭 시
  const handleClickSave = async () => {
    if (!validatePost()) return;

    setLoading(true);
    try {
      await axios.putForm(`/api/post/edit`, {
        postId: post.postId,
        title: post.title,
        content: post.content,
      });
      navigate(`/post/${postId}`);
      toast({
        status: "success",
        position: "bottom",
        description: "게시글이 수정되었습니다.",
      });
    } catch (err) {
      const status = err.response?.status;
      if (status === 400 || status === 401) {
        toast({
          status: "error",
          position: "bottom",
          description: "게시글 수정에 실패하였습니다.",
        });
      }
    } finally {
      setLoading(false);
      onModalCloseOfSave();
    }
  };

  // 취소 버튼 클릭 시
  const handleClickCancel = () => {
    navigate(`/post/${postId}`);
    toast({
      status: "info",
      position: "bottom",
      description: "게시글 수정이 취소되었습니다.",
    });
  };

  const handleContentChange = (content) => {
    setPost({ ...post, content });
  };

  if (!account.isLoggedIn() || !account.isAdmin() || !account.isCertifyUser()) {
    return (
      <Box>
        <Lobby />;
      </Box>
    );
  }
  // 게시글 번호 확인
  if (post === null || post === undefined) {
    return <Spinner />;
  }

  return (
    <Box
      w={{ base: "720px", sm: "640px", lg: "960px" }}
      p={"1rem"}
      border={"1px solid #D8B7E5"}
      borderRadius={"1rem"}
    >
      <Flex direction={"column"} align={"center"}>
        <Flex direction={"column"} align={"center"}>
          <Box w={{ base: "720px", sm: "540px", lg: "720px" }} mt={"2rem"}>
            <Input
              defaultValue={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
          </Box>

          <Box
            w={{ base: "640px", sm: "540px", lg: "640px" }}
            h={{ base: "400px", sm: "360px", lg: "400px" }}
            my={"2rem"}
            borderRadius={"1rem"}
          >
            <MapView />
          </Box>

          <Box>
            <Box w={{ base: "720px", sm: "540px", lg: "720px" }}>
              <DraftEditorEdit
                prevContent={post.content}
                onContentChange={handleContentChange}
              />
            </Box>

            <Box my={"2rem"}>
              <Tooltip
                hasArrow
                isDisabled={disableSaveButton === "able"}
                label={
                  disableSaveButton === "disableToTitle"
                    ? "제목을 확인해주세요."
                    : disableSaveButton === "disableToContent"
                      ? "내용을 확인해주세요."
                      : ""
                }
              >
                <Button
                  onClick={onModalOpenOfSave}
                  isLoading={loading}
                  isDisabled={disableSaveButton !== "able"}
                >
                  등록
                </Button>
              </Tooltip>
              <Button onClick={onModalOpenOfCancel}>취소</Button>
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
      </Flex>
    </Box>
  );
}
