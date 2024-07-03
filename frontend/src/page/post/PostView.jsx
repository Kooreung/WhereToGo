import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
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
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import CommentComponent from "../../component/Comment/CommentComponent.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faEye,
  faHeart,
  faHeart as emptyHeart,
  faList,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-regular-svg-icons";
import MapView from "../../component/Map/MapView.jsx";
import defaultImage from "../../resource/img/unknownImage.png";
import ButtonOutline from "../../css/Button/ButtonOutline.jsx";
import HeadingVariant from "../../css/Heading/HeadingVariant.jsx";
import Lobby from "../Lobby.jsx";

export function PostView() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [place, setPlace] = useState([]);
  const [like, setLike] = useState({ like: false, count: 0 });
  const [comment, setComment] = useState({ count: 0 });
  const navColor = useColorModeValue(
    "rgba(216, 183, 229, 1)",
    "rgba(131, 96, 145, 1)",
  );

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

  if (post.postId === null) {
    return <Lobby />;
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
    setPositionX((prev) => Math.min(prev + 520, 0));
  }

  function handleMoveRight() {
    const flexWidth = dataRef.current.scrollWidth;
    const containerWidth = dataRef.current.parentElement.offsetWidth;
    setPositionX((prev) => Math.max(prev - 520, containerWidth - flexWidth));
  }

  function handleSelectInfo(place, index) {
    console.log(index);
    console.log(place);
  }

  return (
    <Box
      w={{ base: "720px", sm: "640px", lg: "960px" }}
      p={"1rem"}
      border={"1px solid #D8B7E5"}
      borderRadius={"1rem"}
    >
      <HeadingVariant>{post.title}</HeadingVariant>
      <Divider my={{ base: "1rem", sm: "8px", lg: "1rem" }} />
      <Flex direction="column" align="center">
        <Flex direction="column" align="center" w={"100%"}>
          <Flex w={"100%"}>
            <Flex>
              <Avatar
                src={post.profileName}
                onClick={() => navigate(`/member/${post.memberId}`)}
                cursor="pointer"
              />
            </Flex>
            <Flex direction={"column"} w={"100%"}>
              <Flex pl={"1rem"}>
                <Text
                  onClick={() => navigate(`/member/${post.memberId}`)}
                  cursor="pointer"
                  fontWeight={"bold"}
                >
                  {post.nickName}
                </Text>
              </Flex>
              <Flex pl={"1rem"} w={"100%"} justify={"space-between"}>
                <Flex>
                  <Text mr={1}>
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{ color: "#D8B7E5" }}
                      size="sm"
                    />
                  </Text>
                  <Text fontSize="sm">{like.count}</Text>
                  <Text mr={1} ml={2}>
                    <FontAwesomeIcon
                      icon={faEye}
                      size="sm"
                      style={{ color: "#D8B7E5" }}
                    />
                  </Text>
                  <Text fontSize="sm">{post.view}</Text>
                </Flex>
                <Flex>
                  <Text>{post.createDate}</Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          <Box
            w={{ base: "640px", sm: "540px", lg: "640px" }}
            h={{ base: "400px", sm: "360px", lg: "400px" }}
            my={"2rem"}
            borderRadius={"1rem"}
          >
            <MapView />
          </Box>

          <Flex alignItems={"center"} gap={"1rem"}>
            <ButtonOutline onClick={handleMoveLeft}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </ButtonOutline>
            <Flex w={"520px"} h={"160px"}>
              <Flex
                overflow={"hidden"}
                alignItems={"center"}
                borderRadius={"1rem"}
                border={"1px solid #D8B7E5"}
              >
                <Flex
                  ref={dataRef}
                  sx={{
                    transform: `translateX(${positionX}px)`,
                    transition: "transform 0.5s ease",
                  }}
                >
                  {place.map((place, index) => (
                    <Box
                      w={"100%"}
                      key={index}
                      onMouseEnter={() => handleSelectInfo(place, index)}
                    >
                      <Link
                        href={place.placeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Flex
                          w={"520px"}
                          justifyContent={"center"}
                          align={"center"}
                        >
                          <Box w={"160px"} h={"160px"} alignContent={"center"}>
                            <Image
                              src={place.picurl || defaultImage}
                              objectFit={"cover"}
                              w={"100%"}
                              h={"100%"}
                            />
                          </Box>
                          <Flex
                            w={"360px"}
                            h={"160px"}
                            direction={"column"}
                            p={3}
                          >
                            <HeadingVariant
                              overflow={"hidden"}
                              textOverflow={"ellipsis"}
                              whiteSpace={"nowrap"}
                            >
                              {index + 1}번 장소
                            </HeadingVariant>
                            <Box
                              overflow={"hidden"}
                              textOverflow={"ellipsis"}
                              whiteSpace={"nowrap"}
                              fontWeight={"bold"}
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
                            <Spacer />
                            <Box>
                              장소가 등록 된 게시글 수 : {place.countPlace} 개
                            </Box>
                          </Flex>
                        </Flex>
                      </Link>
                    </Box>
                  ))}
                </Flex>
              </Flex>
            </Flex>
            <ButtonOutline onClick={handleMoveRight}>
              <FontAwesomeIcon icon={faChevronRight} />
            </ButtonOutline>
          </Flex>
        </Flex>
        <Box
          maxW={"720px"}
          w={"100%"}
          p={"1rem"}
          whiteSpace={"pre-wrap"}
          borderRadius={"1rem"}
          bgColor={navColor}
          mt={"2rem"}
        >
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </Box>

        <Divider
          border={"1px solid lightGray"}
          maxW={"720px"}
          w="100%"
          my={"2rem"}
        />
        {/* 좋아요 & 수정/삭제/목록 버튼 */}
        <Flex maxW={"720px"} w={"100%"} h={"4rem"} align={"center"}>
          {/* 좋아요 */}
          <Tooltip
            isDisabled={account.isLoggedIn()}
            hasArrow
            label={"로그인 해주세요"}
          >
            <ButtonOutline variant={"RecMedium"} onClick={handleLikeCount}>
              <Flex align={"center"} gap={1}>
                <Text>
                  {like.like && <FontAwesomeIcon icon={emptyHeart} />}
                  {like.like || <FontAwesomeIcon icon={fullHeart} />}
                </Text>

                <Text>{like.count}</Text>
              </Flex>
            </ButtonOutline>
          </Tooltip>
          <Spacer />
          {/* 수정 및 삭제 버튼 */}
          {(account.hasAccessMemberId(post.memberId) || account.isAdmin()) && (
            <Box>
              <Box align={"left"} my={10}>
                <ButtonOutline
                  variant={"RecMedium"}
                  onClick={() => navigate(`/post/${postId}/edit`)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                  <Text display={{ base: "none", lg: "block" }} ml={1}>
                    수정
                  </Text>
                </ButtonOutline>
                <ButtonOutline
                  variant={"RecMedium"}
                  onClick={onModalOpenOfDelete}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <Text display={{ base: "none", lg: "block" }} ml={1}>
                    삭제
                  </Text>
                </ButtonOutline>
              </Box>
            </Box>
          )}

          {/* 목록 */}
          {authType === "user" ? (
            <ButtonOutline
              variant={"RecMedium"}
              onClick={() => navigate("/post/list")}
            >
              <FontAwesomeIcon icon={faList} />
              <Text display={{ base: "none", lg: "block" }} ml={1}>
                목록
              </Text>
            </ButtonOutline>
          ) : authType === "admin" ? (
            <ButtonOutline
              variant={"RecMedium"}
              onClick={() => navigate("/post/mdList")}
            >
              <FontAwesomeIcon icon={faList} />
              <Text display={{ base: "none", lg: "block" }} ml={1}>
                목록
              </Text>
            </ButtonOutline>
          ) : null}
        </Flex>
        {/*댓글*/}
        <Center w={"100%"}>
          <CommentComponent
            postId={post.postId}
            isTransition={isTransition}
            setIsTransition={setIsTransition}
          />
        </Center>

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
