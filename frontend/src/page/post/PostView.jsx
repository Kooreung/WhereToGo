import React, { useContext, useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function PostView() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const toast = useToast();
  const {
    isOpen: isModalOpenOfDelete,
    onOpen: onModalOpenOfDelete,
    onClose: onModalCloseOfDelete,
  } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/post/${postId}`)
      .then((res) => {
        setPost(res.data.post);
        console.log(res.data.post);
      })
      .catch((err) => {
        navigate("/post/list");
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: "해당 게시물이 존재하지 않습니다.",
            position: "bottom",
          });
        }
      });
  }, []);

  // 게시글 번호 확인
  if (post === null || post === undefined) {
    return <Spinner />;
  }

  // 게시글 삭제 클릭 시
  function handleClickDelete() {
    axios
      .delete(`/api/post/${postId}`)
      .then(() => {
        navigate(`/post/list`);
        toast({
          status: "success",
          position: "bottom",
          description: "게시글이 삭제되었습니다.",
        });
      })
      .catch(() => {
        toast({
          status: "error",
          position: "bottom",
          description: "게시글 삭제를 실패하였습니다.",
        });
      })
      .finally(() => {
        onModalCloseOfDelete();
      });
  }

  return (
    <Box>
      <Flex justify={"space-evenly"}>
        <Box>
          <Box {...GuideLineMediumBanner} w={500} h={500}>
            지도
            {/* Todo 지도 표기 필요 */}
          </Box>
          <Box {...GuideLineMediumBanner} w={500}>
            추가 dsadas
            {/* Todo 장소 내용 표기 필요 */}
          </Box>
        </Box>
        <Box>
          <Box {...GuideLineMediumBanner} w={500} h={1000} p={10}>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>제목</FormLabel>
                <Input value={post.title} readOnly />
              </FormControl>
            </Box>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>작성자</FormLabel>
                <Input value={post.nickName} readOnly />
              </FormControl>
            </Box>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea h={200} value={post.content} readOnly></Textarea>
              </FormControl>
            </Box>
          </Box>
          {account.hasAccessMemberId(post.memberId) && (
            <Box>
              <Box align={"left"} my={10}>
                <Button onClick={() => navigate(`/post/${postId}/edit`)}>
                  수정
                </Button>
                <Button onClick={onModalOpenOfDelete}>삭제</Button>
              </Box>
            </Box>
          )}
        </Box>
      </Flex>

      <Modal isOpen={isModalOpenOfDelete} onClose={onModalCloseOfDelete}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시글 삭제</ModalHeader>
          <ModalBody>게시글을 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={handleClickDelete}>삭제</Button>
            <Button onClick={onModalCloseOfDelete}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
