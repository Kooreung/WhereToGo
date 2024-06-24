import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading, Input, Select,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCaretRight, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {useNavigate, useSearchParams} from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";
import ContentParser from "../../component/ContentParser.jsx";

export function PostMdList(props) {
  const [mdPost, setMdPost] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const account = useContext(LoginContext);


  useEffect(() => {
    axios
      .get(`/api/post/mdList?${searchParams}`)
      .then((res) => {
        setMdPost(res.data.post);
      });

    setSearchType("all");
    setSearchKeyword("");

    const typeParam = searchParams.get("type");
    const keywordParam = searchParams.get("keyword");
    if(typeParam) {
      setSearchType(typeParam);
    }
    if (keywordParam) {
      setSearchKeyword(keywordParam);
    }

  }, [searchParams]);


  function handleLoadMore() {
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 3);
  }

  function handleSearchClick() {
    navigate(`/post/mdList?type=${searchType}&keyword=${searchKeyword}`);
  }

  return (
    <Box align="center" justify="center">
      <Box mb={"2rem"}>
        <Heading align={"center"}>
          MD'S PICK
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
              placeholder="검색어"
            />
          </Box>
            <Box>
              <Button onClick={handleSearchClick}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
            </Box>
          </Center>
        </Heading>
      </Box>
      <Divider
        border={"1px solid lightGray"}
        w={{ base: "720px", lg: "960px" }}
        my={"2rem"}
      ></Divider>
      {mdPost.length === 0 && <Center>조회 결과가 없습니다.</Center>}
      {mdPost.length > 0 && (
        <VStack
          divider={<StackDivider borderColor={"lightgray"} />}
          my={"2rem"}
          spacing={"2rem"}
          w={{ base: "720px", lg: "960px" }}
        >
          {mdPost.slice(0, visiblePosts).map((post) => (
            <Box
              w={"720px"}
              key={post.postId}
              onClick={() => navigate(`/post/${post.postId}`)}
            >
              {/* Todo 썸네일 JOIN */}
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
                        타이틀 {post.title}
                      </Text>
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={3} rowSpan={1} alignContent={"center"}>
                    <Flex pl={3}>
                      <Text display={{ base: "none", lg: "block" }} mr={1}>
                        작성자 <FontAwesomeIcon icon={faCaretRight} />
                      </Text>
                      <Text overflow={"hidden"} textOverflow={"ellipsis"}>
                        닉네임 {post.nickName}
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
                          <ContentParser content={post.content} />
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
      <Box>
        {visiblePosts < mdPost.length && (
          <Button onClick={handleLoadMore}>더보기</Button>
        )}
      </Box>
      {account.isAdmin() && (
        <Button onClick={() => navigate(`/post/write`)}>글쓰기</Button>
      )}
    </Box>
  );
}

export default PostMdList;
