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
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

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
      <Box w={{ base: "700px", lg: "2xl" }} h={"15rem"}>
        <Box border={"1px dotted red"} alignContent={"center"} mb={"32px"}>
          <Heading align={"center"}>회원 인기글</Heading>
        </Box>
        <Flex justify={"space-evenly"}>
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
      <Divider border={"1px solid lightGray"} w={"2xl"} my={"2rem"}></Divider>
      {/* 회원 게시글 페이지 */}
      {postList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
      {postList.length > 0 && (
        <VStack
          divider={<StackDivider borderColor={"lightgray"} />}
          my={6}
          spacing={6}
          width={{ base: "md", lg: "2xl" }}
        >
          {postList.map((post) => (
            <Box
              key={post.postId}
              onClick={() => navigate(`/post/${post.postId}`)}
              cursor={"pointer"}
              width={{ base: "md", lg: "2xl" }}
              overflow={"hidden"}
            >
              {/* Todo 조회수, 좋아요, 댓글수, 썸네일 JOIN */}
              {/* Todo 게시글 내용 보이다가 사리지기 */}
              <Box>
                <Grid
                  w={"700"}
                  h={"200"}
                  templateColumns={"repeat(6, 1fr)"}
                  templateRows={"1fr 1fr 3fr"}
                >
                  <GridItem
                    colSpan={2}
                    rowSpan={1}
                    border={"1px dotted yellow"}
                    alignContent={"center"}
                  >
                    <Flex>닉네임 {post.nickName}</Flex>
                  </GridItem>
                  <GridItem
                    colSpan={4}
                    rowSpan={1}
                    border={"1px dotted yellow"}
                    alignContent={"center"}
                  >
                    <Flex>제목 {post.title}</Flex>
                  </GridItem>
                  <GridItem
                    colSpan={2}
                    rowSpan={1}
                    border={"1px dotted yellow"}
                    alignContent={"center"}
                  >
                    <Flex>조회수 {post.view}</Flex>
                  </GridItem>
                  <GridItem
                    colSpan={2}
                    rowSpan={1}
                    border={"1px dotted yellow"}
                    alignContent={"center"}
                  >
                    <Flex>댓글수 {post.commentCount}</Flex>
                  </GridItem>
                  <GridItem
                    colSpan={2}
                    rowSpan={1}
                    border={"1px dotted yellow"}
                    alignContent={"center"}
                  >
                    <Flex>좋아요 {post.likeCount}</Flex>
                  </GridItem>
                  <GridItem
                    colSpan={2}
                    rowSpan={1}
                    border={"1px dotted yellow"}
                    alignContent={"center"}
                  >
                    <Flex>썸네일 {post.thumbnail}</Flex>
                  </GridItem>
                  <GridItem
                    colSpan={4}
                    rowSpan={1}
                    border={"1px dotted yellow"}
                    alignContent={"center"}
                  >
                    <Flex>{post.content}</Flex>
                  </GridItem>
                </Grid>
              </Box>
            </Box>
          ))}
        </VStack>
      )}
      <Divider border={"1px solid lightGray"} w={"2xl"} my={"2rem"}></Divider>
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
              <IconButton onClick={handleSearchClick}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </IconButton>
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
