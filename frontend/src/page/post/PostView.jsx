import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
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
  Spacer,
  Spinner,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { GuideLineMediumBanner } from "../../css/CustomStyles.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import CommentComponent from "../../component/Comment/CommentComponent.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faHeart as emptyHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-regular-svg-icons";

export function PostView() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [like, setLike] = useState({ like: false, count: 0 });
  const [isLikeLoading, setIsLikeLoading] = useState(false);
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
        setLike(res.data.like);
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
  }, [isLikeLoading]);

  // 게시글 번호 확인
  if (post === null || post === undefined) {
    return <Spinner />;
  }

  function handleLikeCount() {
    if (!account.isLoggedIn()) {
      return;
    }
    setIsLikeLoading(true);
    axios
      .put("/api/post/like", { postId: post.postId })
      .then((res) => {
        setLike(res.data);
      })
      .catch((err) => {})
      .finally(() => {
        setIsLikeLoading(false);
      });
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
    <Flex direction="column" align="center">
      <Flex direction="column" align="center">
        <Grid
          w={{ base: "720px", lg: "1080px" }}
          h={"80px"}
          bg={"lightgray"}
          my={"32px"}
          templateColumns={"repeat(5,1fr)"}
          templateRows={"1fr 1fr"}
        >
          <GridItem
            border={"1px dotted red"}
            rowSpan={1}
            colSpan={1}
            alignContent={"center"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
          >
            <Flex pl={3}>
              <Text>
                지역 <FontAwesomeIcon icon={faCaretRight} />
              </Text>
            </Flex>
          </GridItem>
          <GridItem
            border={"1px dotted red"}
            rowSpan={1}
            colSpan={4}
            alignContent={"center"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
          >
            <Flex pl={3}>
              <Text>
                제목 <FontAwesomeIcon icon={faCaretRight} />
              </Text>
              <Box ml={1}>{post.title}</Box>
            </Flex>
          </GridItem>
          <GridItem
            border={"1px dotted red"}
            rowSpan={1}
            colSpan={1}
            alignContent={"center"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
          >
            <Text pl={3}>
              작성자 <FontAwesomeIcon icon={faCaretRight} /> {post.nickName}
            </Text>
          </GridItem>
          <GridItem
            border={"1px dotted red"}
            rowSpan={1}
            colSpan={1}
            alignContent={"center"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
          >
            <Flex pl={3}>
              <Text>
                조회수 <FontAwesomeIcon icon={faCaretRight} />
              </Text>
            </Flex>
          </GridItem>
          <GridItem
            border={"1px dotted red"}
            rowSpan={1}
            colSpan={1}
            alignContent={"center"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
          >
            <Flex pl={3}>
              <Text>
                좋아요 <FontAwesomeIcon icon={faCaretRight} /> {like.count}
              </Text>
            </Flex>
          </GridItem>
          <GridItem
            border={"1px dotted red"}
            rowSpan={1}
            colSpan={1}
            alignContent={"center"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
          >
            <Flex pl={3}>
              <Text>
                댓글 <FontAwesomeIcon icon={faCaretRight} />
              </Text>
            </Flex>
          </GridItem>
          <GridItem
            border={"1px dotted red"}
            rowSpan={1}
            colSpan={1}
            alignContent={"center"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
          >
            <Flex pl={3}>
              <Text>
                작성일자 <FontAwesomeIcon icon={faCaretRight} />{" "}
                {post.createDate}
              </Text>
            </Flex>
          </GridItem>
        </Grid>
        <Box w={"576px"} h={"360px"} bg={"lightgray"} my={"32px"}>
          지도
          {/* Todo 지도 표기 필요 */}
        </Box>
        <Box
          w={{ base: "720px", lg: "1080px" }}
          h={"160px"}
          bg={"lightgray"}
          my={"32px"}
        >
          장소 선택
          {/* Todo 장소 내용 표기 필요 */}
        </Box>
      </Flex>
      <Box w={"720px"} h={"360px"} bg={"lightgray"} my={"32px"}>
        <Box>
          <Box align={"left"}>
            <FormControl>
              <FormLabel>설명</FormLabel>
              <Textarea value={post.content} readOnly></Textarea>
            </FormControl>
          </Box>
        </Box>
      </Box>

      <Divider border={"1px solid lightGray"} w={"720px"} />
      {/* 좋아요 & 수정/삭제/목록 버튼 */}
      <Flex w={"720px"} h={"64px"} my={"16px"} align={"center"}>
        {/* 좋아요 */}
        <Tooltip
          isDisabled={account.isLoggedIn()}
          hasArrow
          label={"로그인 해주세요"}
        >
        <Button onClick={handleLikeCount}>
          <Flex align={"center"} gap={1}>
            <Text fontSize={"xl"}>
              {like.like && <FontAwesomeIcon icon={emptyHeart} />}
              {like.like || <FontAwesomeIcon icon={fullHeart} />}
            </Text>
            <Text fontSize={"xl"}>좋아요</Text>
            <Text fontSize={"xl"}>{like.count}</Text>
          </Flex>
        </Button>
        </Tooltip>
        <Spacer />
        {/* 수정 및 삭제 버튼 */}
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
        {/* 목록 */}
        <Button onClick={() => navigate("/post/list")}>목록</Button>
      </Flex>
      {/*댓글*/}
      <CommentComponent postId={post.postId} />

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
    </Flex>
  );
}
