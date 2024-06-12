import React, { useEffect, useState } from "react";
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
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { GuideLineMediumBanner } from "../../CustomStyles.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

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

  // const pageNumbers = [];
  // for (let i = pageInfo.leftpageNumber; i < pageInfo.rightPageNumber; i++) {
  //   pageNumbers.push(i);
  // }

  function handleSearchClick() {
    navigate(`/post/list/?type=${searchType}&keyword=${searchKeyword}`);
  }

  return (
    <Center>
      <Flex w={{ base: 700, lg: 1000 }} direction="column">
        {/* 상단 회원 인기글 페이지 */}
        <Box>
          <Button onClick={() => navigate(`/post/write`)}>임시 글쓰기</Button>
          <Divider orientation={"horizontal"} my={3} />
          <Box {...GuideLineMediumBanner} h={50} fontSize={"lg"} my={3}>
            회원 인기글
          </Box>
          <Flex direction={"row"} justify={"space-evenly"}>
            <Box {...GuideLineMediumBanner} w={150} h={150}>
              aa
            </Box>
            <Box {...GuideLineMediumBanner} w={150} h={150}>
              bb
            </Box>
            <Box {...GuideLineMediumBanner} w={150} h={150}>
              cc
            </Box>
          </Flex>
          <Divider orientation={"horizontal"} my={3} />
        </Box>

        {/* 회원 게시글 페이지 */}
        {postList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
        {postList.length > 0 && (
          <Box>
            <Table>
              <Thead></Thead>
              <Tbody>
                {postList.map((post) => (
                  <Tr
                    key={post.postId}
                    onClick={() => navigate(`/post/${postId}`)}
                    cursor={"pointer"}
                  >
                    <Td>
                      <Grid
                        bg={"lightblue"}
                        w={"700"}
                        h={"200"}
                        templateColumns={"repeat(6, 1fr)"}
                        templateRows={"repeat(3, 1fr)"}
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
                          colSpan={3}
                          rowSpan={1}
                          border={"1px dotted yellow"}
                          alignContent={"center"}
                        >
                          <Flex>제목 {post.title}</Flex>
                        </GridItem>
                        <GridItem
                          colSpan={1}
                          rowSpan={1}
                          border={"1px dotted yellow"}
                          alignContent={"center"}
                        >
                          <Flex>조회수 {post.view}</Flex>
                        </GridItem>
                        <GridItem
                          colSpan={2}
                          rowSpan={3}
                          border={"1px dotted yellow"}
                          alignContent={"center"}
                        >
                          <Flex>썸네일 {post.thumbnail}</Flex>
                        </GridItem>
                        <GridItem
                          colSpan={3}
                          rowSpan={3}
                          border={"1px dotted yellow"}
                          alignContent={"center"}
                        >
                          {post.content}
                        </GridItem>
                        <GridItem
                          colSpan={1}
                          rowSpan={1}
                          border={"1px dotted yellow"}
                          alignContent={"center"}
                        >
                          댓글수 {post.comment}
                        </GridItem>
                        <GridItem
                          colSpan={1}
                          rowSpan={1}
                          border={"1px dotted yellow"}
                          alignContent={"center"}
                        >
                          좋아요 {post.like}
                        </GridItem>
                      </Grid>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {/* 게시글 검색 */}
        <Box>
          <Flex align={"center"} justify={"center"}>
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
                </Select>
              </Box>
              <Box>
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
          </Flex>
        </Box>

        {/* 페이징 */}
      </Flex>
    </Center>
  );
}

export default PostList;
