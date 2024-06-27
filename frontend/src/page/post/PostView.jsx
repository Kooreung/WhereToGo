import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem, Heading,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import CommentComponent from "../../component/Comment/CommentComponent.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight, faEye, faHeart,
  faHeart as emptyHeart,
  faList,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-regular-svg-icons";
import MapView from "../../component/Map/MapView.jsx";
import defaultImage from "../../resource/img/unknownImage.png";

export function PostView() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [place, setPlace] = useState([]);
  const [like, setLike] = useState({ like: false, count: 0 });
  const [comment, setComment] = useState({ count: 0 });

  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isTransition, setIsTransition] = useState(false);
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const dataRef = useRef(null);
  const [positionX, setPositionX] = useState(0);
  const [authType, setAuthType] = useState("");
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
        setComment({ count: res.data.commentCount });
        setAuthType(res.data.author);
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
  }, [isLikeLoading, isTransition]);

  useEffect(() => {
    axios.get(`/api/post/${postId}/place`).then((res) => {
      setPlace(res.data);
    });
  }, []);

  // 게시글 번호 확인
  if (post === null || post === undefined) {
    return <Spinner />;
  }

  // 게시글 좋아요 클릭 시
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
      .catch(() => {})
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
  function handleMoveLeft() {
    setPositionX((prev) => Math.min(prev + 400, 0));
  }

  function handleMoveRight() {
    const flexWidth = dataRef.current.scrollWidth;
    const containerWidth = dataRef.current.parentElement.offsetWidth;
    setPositionX((prev) => Math.max(prev - 400, containerWidth - flexWidth));
  }

  function handleSelectInfo(place, index) {
    console.log(index);
    console.log(place);
  }

  return (
    <Box w={{ base: "720px", lg: "1080px" }}>
      <Heading pl={10}>{post.title}</Heading>
      <Divider />
    <Flex direction="column" align="center">
      <Flex direction="column" align="center">
        <Grid
          w={{ base: "720px", lg: "1080px" }}
          h={"px"}
          my={"32px"}
          templateColumns={"repeat(5,1fr)"}
          templateRows={"1fr 1fr"}
        >

          <GridItem rowSpan={2} colSpan={1}>

          </GridItem>

          <GridItem colSpan={4}>
            <Flex pl={10}>
              <Text>{post.nickName}</Text>
            </Flex>
          </GridItem>

          <GridItem colSpan={2}>
            <Flex pl={10}>
              <Text display={{ base: "none", lg: "block" }} mr={1}>
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{ color: "#D8B7E5" }}
                  size="sm"
                />
              </Text>
              <Text fontSize="sm">{like.count}</Text>
              <Text display={{ base: "none", lg: "block" }} mr={1} ml={2}>
                <FontAwesomeIcon
                  icon={faEye}
                  size="sm"
                  style={{ color: "#836091" }}
                />
              </Text>
              <Text fontSize="sm">{post.view}</Text>
            </Flex>
          </GridItem>

          <GridItem colSpan={2}>
            <Flex pl={3}>
              <Text display={{ base: "none", lg: "block" }} mr={1}>
                작성일자 <FontAwesomeIcon icon={faCaretRight} />{" "}
              </Text>
              <Text>{post.createDate}</Text>
            </Flex>
          </GridItem>


        </Grid>

        <Box w={"576px"} h={"360px"} bg={"lightgray"} my={"32px"} mt={"100px"}>
          <MapView />
        </Box>

        <Flex
          w={"540px"}
          h={"160px"}
          alignItems={"center"}
          justify={"space-evenly"}
          bg={"lightgray"}
        >
          <Button onClick={handleMoveLeft}>옆</Button>
          <Box w={"400px"} overflow={"hidden"} alignItems={"center"}>
            <Flex
              ref={dataRef}
              sx={{
                transform: `translateX(${positionX}px)`,
                transition: "transform 0.5s ease",
              }}
            >
              {place.map((place, index) => (
                <Box
                  key={index}
                  onMouseEnter={() => handleSelectInfo(place, index)}
                >
                  <Link
                    href={place.placeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Flex w={"400px"} justifyContent={"center"}>
                      <Box
                        w={"120px"}
                        h={"120px"}
                        border={"1px dotted red"}
                        alignContent={"center"}
                      >
                        <Image
                          src={place.picurl || defaultImage}
                          objectFit={"cover"}
                          w={"100%"}
                          h={"100%"}
                        />
                      </Box>
                      <Box
                        w={"260px"}
                        h={"120px"}
                        border={"1px dotted red"}
                        p={3}
                      >
                        <Box
                          overflow={"hidden"}
                          textOverflow={"ellipsis"}
                          whiteSpace={"nowrap"}
                        >
                          {index + 1}번 장소
                        </Box>
                        <Box
                          overflow={"hidden"}
                          textOverflow={"ellipsis"}
                          whiteSpace={"nowrap"}
                        >
                          {place.placeName}
                        </Box>
                        <Box
                          overflow={"hidden"}
                          textOverflow={"ellipsis"}
                          whiteSpace={"nowrap"}
                        >
                          {place.address}
                        </Box>
                        <Box>게시글 등록 횟수 : {place.countPlace} 건</Box>
                      </Box>
                    </Flex>
                  </Link>
                </Box>
              ))}
            </Flex>
          </Box>
          <Button onClick={handleMoveRight}>옆</Button>
        </Flex>
      </Flex>
      <Box
        w={"720px"}
        bg={"lightgray"}
        my={"32px"}
        p={"1rem"}
        whiteSpace={"pre-wrap"}
      >
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
              <Text fontSize={"xl"} display={{ base: "none", lg: "block" }}>
                좋아요
              </Text>
              <Text fontSize={"xl"}>{like.count}</Text>
            </Flex>
          </Button>
        </Tooltip>
        <Spacer />
        {/* 수정 및 삭제 버튼 */}
        {(account.hasAccessMemberId(post.memberId) || account.isAdmin()) && (
          <Box>
            <Box align={"left"} my={10}>
              <Button onClick={() => navigate(`/post/${postId}/edit`)}>
                <FontAwesomeIcon icon={faPenToSquare} />
                <Text display={{ base: "none", lg: "block" }} ml={1}>
                  수정
                </Text>
              </Button>
              <Button onClick={onModalOpenOfDelete}>
                <FontAwesomeIcon icon={faTrash} />
                <Text display={{ base: "none", lg: "block" }} ml={1}>
                  삭제
                </Text>
              </Button>
            </Box>
          </Box>
        )}

        {/* 목록 */}
        {authType === "user" ? (
          <Button onClick={() => navigate("/post/list")}>
            <FontAwesomeIcon icon={faList} />
            <Text display={{ base: "none", lg: "block" }} ml={1}>
              목록
            </Text>
          </Button>
        ) : authType === "admin" ? (
          <Button onClick={() => navigate("/post/mdList")}>
            <FontAwesomeIcon icon={faList} />
            <Text display={{ base: "none", lg: "block" }} ml={1}>
              목록
            </Text>
          </Button>
        ) : null}
      </Flex>
      {/*댓글*/}
      <CommentComponent
        postId={post.postId}
        isTransition={isTransition}
        setIsTransition={setIsTransition}
      />

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
    </Box>
  );
}
