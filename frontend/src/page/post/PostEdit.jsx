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
import { LoginContext } from "../../component/LoginProvider.jsx";
import MapView from "../../component/Map/MapView.jsx";
import DraftEditorEdit from "../../component/TextEditor/DraftEditorEdit.jsx";
import Lobby from "../Lobby.jsx";
import { LoginContext } from "../../component/LoginProvider.jsx";

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

  useEffect(() => {
    axios.get(`/api/post/${postId}`).then((res) => {
      setPost(res.data.post);
    });
  }, []);

  // 게시글 번호 확인
  if (post === null || post === undefined) {
    return <Spinner />;
  }

  // 저장 버튼 클릭 시
  function handleClickSave() {
    if (post.title.trim().length === 0) {
      toast({
        status: "error",
        position: "bottom",
        description: "제목을 다시 확인해주세요.",
      });
      return;
    }
    if (post.content.trim().length <= 7) {
      toast({
        status: "error",
        position: "bottom",
        description: "내용을 다시 확인해주세요.",
      });
      return;
    }
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
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            position: "bottom",
            description: "게시글 수정에 실패하였습니다.",
          });
        }
        if (err.response.status === 401) {
          toast({
            status: "error",
            position: "bottom",
            description: "게시글 수정에 실패하였습니다.",
          });
        }
      })
      .finally(() => onModalCloseOfSave(), setLoading(false));
  }

  // 취소 버튼 클릭 시
  function handleClickCancel() {
    navigate(`/post/${postId}`);
    toast({
      status: "info",
      position: "bottom",
      description: "게시글 수정이 취소되었습니다.",
    });
  }

  const handleContentChange = (content) => {
    setPost({ ...post, content });
  };

  if (!account.isLoggedIn()) {
    return (
      <Box>
        <Lobby />;
      </Box>
    );
  }

  return (
    <Flex direction={"column"} align={"center"}>
      <Flex direction={"column"} align={"center"}>
        <Box w={"720px"} mt={"2rem"}>
          <Box>
            <Input
              defaultValue={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
          </Box>
        </Box>

        <Box w={"720px"} my={"2rem"}>
          <MapView />
        </Box>

        <Box>
          <Box>
            <Box w={"720px"}>
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
              {/* Todo 게시글 작성 중 임시저장 필요 */}
              {/* TODO 게시글 수정하다가 나가려고 하면 Modal 표기 */}
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
    </Flex>
  );
}
