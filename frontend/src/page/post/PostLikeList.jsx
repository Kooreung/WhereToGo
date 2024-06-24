import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  Select,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { SearchIcon } from "@chakra-ui/icons";
import { LoginContext } from "../../component/LoginProvider.jsx";
import Lobby from "../Lobby.jsx";

export function PostLikeList() {
  const [postLikeList, setPostLikeList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/post/likeList?${searchParams}`).then((res) => {
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
    navigate(`/postLike/list?type=${searchType}&keyword=${searchKeyword}`);
  }

  // 검색 창 Enter 시 URL
  function handleSearchKeyDown(e) {
    if (e.key === "Enter") {
      navigate(`/postLike/list?type=${searchType}&keyword=${searchKeyword}`);
    }
  }

  // 페이지 버튼 클릭 시
  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    navigate(`/postLike/list?${searchParams}`);
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
      <Divider
        border="3px solid #836091" // 경계선 정의
        borderRadius="10px"
        w={{ base: "720px", lg: "960px" }}
        my={"2rem"}
      ></Divider>
      {postLikeList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
      {postLikeList.length > 0 && (
        <VStack
          divider={
            <StackDivider
              border="1px solid #836091" // 경계선 정의
              borderRadius="10px"
            />
          }
          my={"2rem"}
          spacing={"2rem"}
          w={{ base: "720px", lg: "960px" }}
        >
          {postLikeList.map((post) => (
            <Box
              key={post.postId}
              onClick={() => navigate(`/post/${post.postId}`)}
              w={"720px"}
            >
              <Box>
                <Grid
                  w={"720px"}
                  h={"224px"}
                  templateColumns={"repeat(9, 1fr)"}
                  templateRows={"1fr 1fr 5fr"}
                  sx={{
                    "&:hover": {
                      backgroundColor: "RGBA(0, 0, 0, 0.06)",
                    },
                  }}
                  cursor={"pointer"}
                >
                  <GridItem
                    colSpan={9}
                    rowSpan={1}
                    alignContent={"center"}
                    whiteSpace={"nowrap"}
                    borderY={"1px solid lightgray"}
                  >
                    <Flex pl={3}>
                      <Text
                        display={{ base: "none", lg: "block" }}
                        mr={1}
                        fontSize={"xl"}
                        fontWeight={"bold"}
                      >
                        제목 <FontAwesomeIcon icon={faCaretRight} />
                      </Text>
                      <Text
                        overflow={"hidden"}
                        textOverflow={"ellipsis"}
                        fontSize={"xl"}
                        fontWeight={"bold"}
                      >
                        {post.title}
                      </Text>
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={3} rowSpan={1} alignContent={"center"}>
                    <Flex pl={3}>
                      <Text display={{ base: "none", lg: "block" }} mr={1}>
                        작성자 <FontAwesomeIcon icon={faCaretRight} />
                      </Text>
                      <Text overflow={"hidden"} textOverflow={"ellipsis"}>
                        {post.nickName}
                      </Text>
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={2} rowSpan={1} alignContent={"center"}>
                    <Flex pl={3}>
                      <Text display={{ base: "none", lg: "block" }} mr={1}>
                        조회수 <FontAwesomeIcon icon={faCaretRight} />
                      </Text>
                      <Text>{post.view}</Text>
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={2} rowSpan={1} alignContent={"center"}>
                    <Flex pl={3}>
                      <Text display={{ base: "none", lg: "block" }} mr={1}>
                        좋아요 <FontAwesomeIcon icon={faCaretRight} />
                      </Text>
                      <Text>{post.likeCount}</Text>
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={2} rowSpan={1} alignContent={"center"}>
                    <Flex pl={3}>
                      <Text display={{ base: "none", lg: "block" }} mr={1}>
                        댓글 <FontAwesomeIcon icon={faCaretRight} />
                      </Text>
                      <Text>{post.commentCount}</Text>
                    </Flex>
                  </GridItem>
                  <GridItem
                    colSpan={2}
                    rowSpan={1}
                    alignContent={"center"}
                    borderY={"1px solid lightgray"}
                  >
                    <Flex pl={3}>
                      <Text display={{ base: "none", lg: "block" }} mr={1}>
                        썸네일
                      </Text>
                    </Flex>
                  </GridItem>
                  <GridItem
                    colSpan={7}
                    rowSpan={1}
                    alignContent={"center"}
                    overflow={"hidden"}
                    textOverflow={"ellipsis"}
                    whiteSpace={"nowrap"}
                    borderY={"1px solid lightgray"}
                  >
                    <Box pl={3}>
                      <Flex>
                        <Text display={{ base: "none", lg: "block" }} mr={1}>
                          내용 <FontAwesomeIcon icon={faCaretRight} />{" "}
                        </Text>
                        <Box
                          maxW={"560px"}
                          textAlign={"start"}
                          overflow={"hidden"}
                          textOverflow={"ellipsis"}
                          display={"-webkit-box"}
                          css={{
                            "-webkit-line-clamp": "4",
                            "-webkit-box-orient": "vertical",
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {post.content}
                        </Box>
                      </Flex>
                      <Text textAlign={"left"} mt={"1rem"} color={"lightgray"}>
                        {post.createDate}
                      </Text>
                    </Box>
                  </GridItem>
                </Grid>
              </Box>
            </Box>
          ))}
        </VStack>
      )}
      <Divider
        border="3px solid #836091" // 경계선 정의
        borderRadius="10px"
        w={{ base: "720px", lg: "960px" }}
        my={"2rem"}
      ></Divider>
      {/* 게시글 검색 */}
      <Box my={"2rem"}>
        <Flex align={"center"} justify={"center"} gap={10}>
          <Box w={"80px"}></Box>
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
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={"검색어"}
              />
            </Box>
            <Box>
              <IconButton
                onClick={handleSearchClick}
                icon={<SearchIcon />}
                aria-label={"Search database"}
              />
            </Box>
          </Center>
        </Flex>
      </Box>
      <Box>
        <Center>
          {pageInfo.prevPageNumber && (
            <>
              <Button onClick={() => handlePageButtonClick(1)}>
                <FontAwesomeIcon icon={faAnglesLeft} />
              </Button>
              <Button
                onClick={() => handlePageButtonClick(pageInfo.prevPageNumber)}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </Button>
            </>
          )}

          {pageNumbers.map((pageNumber) => (
            <Button
              key={pageNumber}
              onClick={() => handlePageButtonClick(pageNumber)}
            >
              {pageNumber}
            </Button>
          ))}

          {pageInfo.nextPageNumber && (
            <>
              <Button
                onClick={() => handlePageButtonClick(pageInfo.nextPageNumber)}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </Button>
              <Button
                onClick={() => handlePageButtonClick(pageInfo.lastPageNumber)}
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </Button>
            </>
          )}
        </Center>
      </Box>
    </Box>
  );
}

export default PostLikeList;
