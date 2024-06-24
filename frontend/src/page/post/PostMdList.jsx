import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import axios from "axios";
import ContentParser from "../../component/ContentParser.jsx";

export function PostMdList(props) {
  const [mdPost, setMdPost] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(3);
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  useEffect(() => {
    axios
      .get("/api/post/mdList")
      .then((res) => {
        setMdPost(res.data.post);
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  }, []);

  function handleLoadMore() {
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 3);
  }

  return (
    <Box align="center" justify="center">
      <Box mb={"2rem"}>
        <Heading align={"center"}>MD'S PICK</Heading>
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
