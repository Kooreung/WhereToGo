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
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SearchIcon } from "@chakra-ui/icons";

export function PostLikeList(props) {
  const [postLikeList, setPostLikeList] = useState([]);
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  useEffect(() => {
    axios.get("/api/post/likeList").then((res) => {
      setPostLikeList(res.data);
    });
  }, []);

  function handleSearchClick() {
    navigate(`/post/likeList?type=${searchType}&keyword=${searchKeyword}`);
  }

  return (
    <Box align="center" justify="center">
      <Divider
        border={"1px solid lightGray"}
        w={{ base: "720px", lg: "960px" }}
        my={"2rem"}
      ></Divider>
      {postLikeList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
      {postLikeList.length > 0 && (
        <VStack
          divider={<StackDivider borderColor={"lightgray"} />}
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
    </Box>
  );
}

export default PostLikeList;
