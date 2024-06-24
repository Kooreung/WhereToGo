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
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MapAdd from "../../component/Map/MapAdd.jsx";
import { LoginContext } from "../../component/LoginProvider.jsx";
import DraftEditor from "../../component/TextEditor/DraftEditorWrite.jsx";
import Lobby from "../Lobby.jsx";

function PostWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState("able");
  const [postType, setPostType] = useState("");

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
    const handleBeforeUnload = (event) => {
      event.preventDefault(); // 정확한 구현에 따라 이벤트를 취소할 수 있습니다.
      return (event.returnValue = ""); // 일반적으로 이런 방식으로 경고창을 띄웁니다.
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // 저장 버튼 클릭 시
  function handleClickSave() {
    if (title.trim().length === 0) {
      toast({
        status: "error",
        position: "bottom",
        description: "제목을 다시 확인해주세요.",
      });
      return;
    }
    if (content.trim().length <= 7) {
      toast({
        status: "error",
        position: "bottom",
        description: "내용을 다시 확인해주세요.",
      });
      return;
    }
    if (selectedPlaces.length <= 1) {
      toast({
        status: "error",
        position: "bottom",
        description: "장소를 하나 이상 선택해주세요.",
      });
      return;
    }
    setLoading(true);

    if (account.isAdmin()) {
      setPostType("admin");
    } else {
      setPostType("user");
    }
    axios
      .postForm("/api/post/add", { title, content, postType })
      .then((res) => {
        const postId = res.data;

        axios
          .post(
            "/api/place/add",
            selectedPlaces.map((place) => ({
              placeName: place.place_name,
              placeUrl: place.place_url,
              address: place.address_name,
              category: place.category_group_name,
              latitude: parseFloat(place.y),
              longitude: parseFloat(place.x),
              postId: postId,
            })),
          )
          .then((res) => {
            console.log("place add", res.data);
            const placeIdMap = res.data.places;
            const placesWithId = selectedPlaces.map((place) => {
              const placeId = placeIdMap[place.place_name]; // placeName을 키로 사용하여 placeId 추출
              return {
                placeId: placeId,
                placeName: place.place_name,
                address: place.address_name,
              };
            });

            axios.post("/api/web/crawling", placesWithId);
            console.log("장소가 성공적으로 서버에 전송되었습니다.");
            navigate(`/post/${res.data.postId}`);
            toast({
              status: "success",
              position: "bottom",
              description: "게시글이 등록되었습니다.",
            });
          })
          .catch((error) => {
            console.error(
              "장소를 서버에 전송하는 중 오류가 발생했습니다:",
              error,
            );
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
              placeholder={"제목을 작성해주세요."}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>
        </Box>
        <Box w={"720px"} my={"2rem"}>
          <MapAdd
            selectedPlaces={selectedPlaces}
            setSelectedPlaces={setSelectedPlaces}
          />
        </Box>
        <Box>
          <Box w={"720px"}>
            <Box>
              <DraftEditor setContent={setContent} />
            </Box>
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
                    : disableSaveButton === "disableToPlace"
                      ? "장소를 선택해주세요."
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
    </Flex>
  );
}

export default PostWrite;
