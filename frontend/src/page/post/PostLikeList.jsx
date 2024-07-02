import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Center,
  Flex,
  Image,
  Input,
  Select,
  Spacer,
  StackDivider,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faEye,
  faHeart,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import Lobby from "../Lobby.jsx";
import HeadingVariant from "../../css/Heading/HeadingVariant.jsx";
import ContentParser from "../../component/ContentParser.jsx";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import ButtonCircle from "../../css/Button/ButtonCircle.jsx";
import ButtonOutline from "../../css/Button/ButtonOutline.jsx";
import defaultImage from "../../resource/img/unknownImage.png";

export function PostLikeList() {
  const [postLikeList, setPostLikeList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const navigate = useNavigate();
  const { memberId } = useParams();
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const account = useContext(LoginContext);
  const hColor = useColorModeValue("beige", "#2D3748");

  useEffect(() => {
    axios.get(`/api/post/likeList/${memberId}?${searchParams}`).then((res) => {
      setPostLikeList(res.data.postList);
      setPageInfo(res.data.pageInfo);
    });
    setSearchType("all");
    setSearchKeyword("");
    const typeParam = searchParams.get("type");
    const keywordParam = searchParams.get("keyword");
    if (typeParam) {
      setSearchType(typeParam);
    }
    if (keywordParam) {
      setSearchKeyword(keywordParam);
    }
  }, [searchParams]);

  // 페이지 수
  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  // 검색 클릭 시 URL
  function handleSearchClick() {
    navigate(
      `/post/likeList/${memberId}?type=${searchType}&keyword=${searchKeyword}`,
    );
  }

  // 검색 창 Enter 시 URL
  function handleSearchKeyDown(e) {
    if (e.key === "Enter") {
      navigate(
        `/post/likeList/${memberId}?type=${searchType}&keyword=${searchKeyword}`,
      );
    }
  }

  // 페이지 버튼 클릭 시
  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    navigate(`/post/likeList/${memberId}?${searchParams}`);
  }

  if (!account.isLoggedIn()) {
    return (
      <Box>
        <Lobby />;
      </Box>
    );
  }

  return (
    <Box align="center" justify="center">
      {postLikeList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
      {postLikeList.length > 0 && (
        <VStack
          divider={<StackDivider />}
          my={"2rem"}
          spacing={{ base: "2rem", lg: "2rem", sm: "1rem" }}
          w={{ base: "720px", lg: "720px", sm: "660px" }}
        >
          {postLikeList.map((post) => (
            <Flex
              key={post.postId}
              onClick={() => navigate(`/post/${post.postId}`)}
              w={{ base: "720px", lg: "720px", sm: "660px" }}
              h={{ base: "240px", lg: "240px", sm: "200px" }}
              cursor={"pointer"}
              boxShadow={"base"}
              borderRadius={"1rem"}
              py={"1rem"}
              px={"1rem"}
              sx={{
                "&:hover": {
                  backgroundColor: hColor,
                },
              }}
            >
              <Flex
                direction={"column"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
                whiteSpace={"nowrap"}
                w={"75%"}
                h={"100%"}
                pr={"1rem"}
              >
                <Flex mb={"8px"}>
                  <HeadingVariant overflow={"hidden"} textOverflow={"ellipsis"}>
                    {post.title}
                  </HeadingVariant>
                </Flex>
                <Flex
                  textAlign={"start"}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  display={"-webkit-box"}
                  css={{
                    WebkitLineClamp: "3",
                    WebkitBoxOrient: "vertical",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <ContentParser content={post.content} />
                </Flex>
                <Spacer />
                <Flex w={"100%"} h={"32px"} alignItems={"center"}>
                  <Flex w={"45%"}>
                    <Box w={"24px"} h={"24px"} mr={1} boxShadow={"base"}>
                      <Avatar w={"24px"} h={"24px"} src={post.profileName} />
                    </Box>
                    <Box
                      w={"100%"}
                      textAlign={"start"}
                      overflow={"hidden"}
                      textOverflow={"ellipsis"}
                    >
                      {post.nickName}
                    </Box>
                  </Flex>
                  <Spacer />
                  <Flex
                    gap={"10px"}
                    w={"50%"}
                    color={"lightgray"}
                    fontSize={"12px"}
                    justify={"end"}
                  >
                    <Flex>
                      <Text display={{ base: "none", lg: "block" }} mr={1}>
                        조회
                      </Text>
                      <Text display={{ base: "block", lg: "none" }} mr={1}>
                        <FontAwesomeIcon icon={faEye} size={"lg"} />
                      </Text>
                      <Text>{post.view}</Text>
                    </Flex>
                    <Flex>
                      <Text display={{ base: "none", lg: "block" }} mr={1}>
                        좋아요
                      </Text>
                      <Text display={{ base: "block", lg: "none" }} mr={1}>
                        <FontAwesomeIcon icon={faHeart} size={"lg"} />
                      </Text>
                      <Text>{post.likeCount}</Text>
                    </Flex>
                    <Flex>
                      <Text display={{ base: "none", lg: "block" }} mr={1}>
                        댓글
                      </Text>
                      <Text display={{ base: "block", lg: "none" }} mr={1}>
                        <FontAwesomeIcon icon={faComment} size={"lg"} />
                      </Text>
                      <Text>{post.commentCount}</Text>
                    </Flex>
                    <Flex>{post.createDate}</Flex>
                  </Flex>
                </Flex>
              </Flex>
              <Spacer />
              <Flex
                w={{ base: "200px", lg: "200px", sm: "160px" }}
                h={"100%"}
                align={"center"}
              >
                <Image
                  src={post.picurl || defaultImage}
                  w={{ base: "200px", lg: "200px", sm: "160px" }}
                  h={{ base: "200px", lg: "200px", sm: "160px" }}
                  objectFit={"cover"}
                  borderRadius={"1rem"}
                />
              </Flex>
            </Flex>
          ))}
        </VStack>
      )}

      {/* 게시글 검색 */}
      <Box my={"2rem"}>
        <Flex align={"center"} justify={"center"} gap={10}>
          <Center>
            <Box>
              <Select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                }}
              >
                <option value={"all"}>전체</option>
                <option value={"titleAndContent"}>제목+내용</option>
                <option value={"nickName"}>닉네임</option>
                <option value={"placeName"}>장소명</option>
                <option value={"address"}>지역명</option>
              </Select>
            </Box>
            <Box>
              <Input
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder={"검색어"}
              />
            </Box>
            <Box>
              <ButtonCircle onClick={handleSearchClick}>
                <FontAwesomeIcon icon={faMagnifyingGlass} fontSize="small" />
              </ButtonCircle>
            </Box>
          </Center>
        </Flex>
      </Box>

      {/* 페이징 */}
      <Box>
        <Center>
          {pageInfo.prevPageNumber && (
            <>
              <ButtonOutline onClick={() => handlePageButtonClick(1)}>
                <FontAwesomeIcon icon={faAnglesLeft} />
              </ButtonOutline>
              <ButtonOutline
                onClick={() => handlePageButtonClick(pageInfo.prevPageNumber)}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </ButtonOutline>
            </>
          )}

          {pageNumbers.map((pageNumber) => (
            <ButtonOutline
              key={pageNumber}
              onClick={() => handlePageButtonClick(pageNumber)}
            >
              {pageNumber}
            </ButtonOutline>
          ))}

          {pageInfo.nextPageNumber && (
            <>
              <ButtonOutline
                onClick={() => handlePageButtonClick(pageInfo.nextPageNumber)}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </ButtonOutline>
              <ButtonOutline
                onClick={() => handlePageButtonClick(pageInfo.lastPageNumber)}
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </ButtonOutline>
            </>
          )}
        </Center>
      </Box>
    </Box>
  );
}

export default PostLikeList;
