import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Select,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { SearchIcon } from "@chakra-ui/icons";

function PostList() {
  const navigate = useNavigate();
  const [postList, setPostList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    axios.get(`/api/post/list?${searchParams}`).then((res) => {
      setPostList(res.data.postList);
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

  // 검색 클릭 시 url
  function handleSearchClick() {
    navigate(`/post/list?type=${searchType}&keyword=${searchKeyword}`);
  }

  // 페이지 버튼 클릭 시
  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    navigate(`/post/list?${searchParams}`);
  }

  // 회원 인기 게시글
  function ListOfFavoritePost() {
    return (
      <Box w={{ base: "720px", lg: "1080px" }}>
        <Box mb={"2rem"}>
          <Heading align={"center"}>회원 인기글</Heading>
        </Box>
        <Flex justify={"space-evenly"}>
          {/* lg 이상일 때 */}
          <Flex
            border={"1px solid gray"}
            alignItems={"center"}
            display={{ base: "none", lg: "flex" }}
            w={"320px"}
          >
            <Box
              border={"1px dotted red"}
              alignContent={"center"}
              w={"120px"}
              h={"120px"}
            >
              썸네일
            </Box>
            <Box textAlign={"start"} alignContent={"center"} ml={"1"}>
              <Box>제목</Box>
              <Box>작성자</Box>
              <Box>조회수</Box>
              <Box>좋아요</Box>
              <Box>댓글</Box>
            </Box>
          </Flex>
          {/* lg 이하일 때 */}
          <Flex
            border={"1px solid gray"}
            direction={"column"}
            alignItems={"center"}
            display={{ base: "flex", lg: "none" }}
            w={"240px"}
          >
            <Box
              border={"1px dotted red"}
              alignContent={"center"}
              w={"120px"}
              h={"120px"}
            >
              썸네일
            </Box>
            <Box textAlign={"start"} alignContent={"center"} ml={"1"}>
              <Box>제목</Box>
              <Box>작성자</Box>
              <Box>조회수</Box>
              <Box>좋아요</Box>
              <Box>댓글</Box>
            </Box>
          </Flex>
          {/*임시 박스*/}
          <Box
            border={"1px dotted red"}
            alignContent={"center"}
            w={150}
            h={150}
          ></Box>
          <Box
            border={"1px dotted red"}
            alignContent={"center"}
            w={150}
            h={150}
          ></Box>
        </Flex>
      </Box>
    );
  }

  return (
    <Box align="center" justify="center">
      <ListOfFavoritePost />
      <Divider
        border={"1px solid lightGray"}
        w={{ base: "720px", lg: "960px" }}
        my={"2rem"}
      ></Divider>
      {/* 회원 게시글 페이지 */}
      {postList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
      {postList.length > 0 && (
        <VStack
          divider={<StackDivider borderColor={"lightgray"} />}
          my={"2rem"}
          spacing={"2rem"}
          w={{ base: "720px", lg: "960px" }}
        >
          {postList.map((post) => (
            <Box
              key={post.postId}
              onClick={() => navigate(`/post/${post.postId}`)}
              w={"720px"}
            >
              {/* Todo 조회수, 썸네일 JOIN */}
              <Box>
                <Grid
                  w={"720px"}
                  h={"224px"}
                  templateColumns={"repeat(9, 1fr)"}
                  templateRows={"1fr 1fr 5fr"}
                  _hover={{ bgColor: "beige" }}
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
        border={"1px solid lightGray"}
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
                <option value={"title"}>제목</option>
                <option value={"nickName"}>닉네임</option>
                <option value={"place"}>지역</option>
                {/* Todo 지역 검색 키워드 필요 */}
              </Select>
            </Box>
            <Box>
              {/* Todo 검색에 엔터 적용 필요 */}
              <Input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
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
          <Button onClick={() => navigate(`/post/write`)}>글쓰기</Button>
        </Flex>
      </Box>

      {/* 페이징 */}
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

export default PostList;
