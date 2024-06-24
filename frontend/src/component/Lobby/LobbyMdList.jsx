import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { faArrowRight, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../LoginProvider.jsx";
import axios from "axios";
import ContentParser from "../ContentParser.jsx";

export function LobbyMdList() {
  const [mdPost, setMdPost] = useState([]);
  const [prevPosts, setPrevPosts] = useState(0);
  const [nextPosts, setNextPosts] = useState(1);
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get("/api/post/mdPickList")
      .then((res) => {
        setMdPost(res.data.post);
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  }, []);

  return (
    <>
      <Center>
        <Button
          onClick={() => {
            if (nextPosts > 1) {
              setNextPosts(nextPosts - 1);
              setPrevPosts(prevPosts - 1);
            }

            if (nextPosts === 1) {
              setNextPosts(5);
              setPrevPosts(4);
            }
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} fontSize="2rem" />
        </Button>
        <Card
          direction={{ base: "column", sm: "row" }}
          overflow="hidden"
          variant="outline"
          maxW="100%"
          justifyContent="center"
        >
          <Stack>
            {nextPosts >= 1 && nextPosts <= 3 && (
              <CardBody>
                <Heading size="md"></Heading>
                {mdPost.length > 0 && (
                  <VStack
                    divider={<StackDivider borderColor={"lightgray"} />}
                    my={"2rem"}
                    spacing={"2rem"}
                    w={{ base: "720px", lg: "960px" }}
                  >
                    {mdPost.slice(prevPosts, nextPosts).map((post) => (
                      <Box
                        w={"720px"}
                        key={post.postId}
                        onClick={() => navigate(`/post/${post.postId}`)}
                      >
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
                            <GridItem
                              colSpan={3}
                              rowSpan={1}
                              alignContent={"center"}
                            >
                              <Flex pl={3}>
                                <Text
                                  display={{ base: "none", lg: "block" }}
                                  mr={1}
                                >
                                  작성자 <FontAwesomeIcon icon={faCaretRight} />
                                </Text>
                                <Text
                                  overflow={"hidden"}
                                  textOverflow={"ellipsis"}
                                >
                                  닉네임 {post.nickName}
                                </Text>
                              </Flex>
                            </GridItem>
                            <GridItem
                              colSpan={2}
                              rowSpan={1}
                              alignContent={"center"}
                            >
                              <Flex pl={3}>
                                <Text
                                  display={{ base: "none", lg: "block" }}
                                  mr={1}
                                >
                                  조회수 <FontAwesomeIcon icon={faCaretRight} />
                                </Text>
                                <Text>{post.view}</Text>
                              </Flex>
                            </GridItem>
                            <GridItem
                              colSpan={2}
                              rowSpan={1}
                              alignContent={"center"}
                            >
                              <Flex pl={3}>
                                <Text
                                  display={{ base: "none", lg: "block" }}
                                  mr={1}
                                >
                                  좋아요 <FontAwesomeIcon icon={faCaretRight} />
                                </Text>
                                <Text>{post.likeCount}</Text>
                              </Flex>
                            </GridItem>
                            <GridItem
                              colSpan={2}
                              rowSpan={1}
                              alignContent={"center"}
                            >
                              <Flex pl={3}>
                                <Text
                                  display={{ base: "none", lg: "block" }}
                                  mr={1}
                                >
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
                                <Text
                                  display={{ base: "none", lg: "block" }}
                                  mr={1}
                                >
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
                                  <Text
                                    display={{ base: "none", lg: "block" }}
                                    mr={1}
                                  >
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
                                <Text
                                  textAlign={"left"}
                                  mt={"1rem"}
                                  color={"lightgray"}
                                >
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
              </CardBody>
            )}

            {nextPosts >= 4 && nextPosts <= 5 && (
              <CardBody>
                <VStack
                  divider={<StackDivider borderColor={"lightgray"} />}
                  my={"2rem"}
                  spacing={"2rem"}
                  w={{ base: "720px", lg: "960px" }}
                >
                  <Box>누르면 검색된 지역으로 가는 배너</Box>
                </VStack>
              </CardBody>
            )}

            <CardFooter></CardFooter>
          </Stack>
        </Card>
        <Button
          onClick={() => {
            if (nextPosts < 5) {
              setNextPosts(nextPosts + 1);
              setPrevPosts(prevPosts + 1);
            }
            if (nextPosts === 5) {
              setNextPosts(1);
              setPrevPosts(0);
            }
          }}
        >
          <FontAwesomeIcon icon={faArrowRight} fontSize="2rem" />
        </Button>
      </Center>
    </>
  );
}
