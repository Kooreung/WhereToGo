import {
  Box,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { faArrowRight, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../LoginProvider.jsx";
import axios from "axios";
import ContentParser from "../ContentParser.jsx";
import ButtonCircle from "../../css/Button/ButtonCircle.jsx";
import HeadingLarge from "../../css/Heading/HeadingLarge.jsx";

export function LobbyMdList() {
  const [mdPost, setMdPost] = useState([]);
  const [banner, setBanner] = useState([]);
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

    axios
      .get("/api/post/bannerList")
      .then((response) => {
        // 상태 업데이트로 리스트를 다시 렌더링
        setBanner(response.data);
      })
      .catch((error) => {
        // 오류 처리
        console.error("배너 리스트 불러오기 실패:", error);
      });
  }, []);

  return (
    <Box align={"center"}>
      <HeadingLarge
        w={{ base: "720px", sm: "600px", lg: "720px" }}
        mb={"1rem"}
        textAlign={"start"}
        border={"1px dotted red"}
      >
        MD 추천 Pick
      </HeadingLarge>
      <Flex alignContent={"center"} alignItems={"center"} justify={"center"}>
        <Box
          w={"60px"}
          h={"60px"}
          position={"relative"}
          left={"70px"}
          zIndex={"1"}
          cursor={"pointer"}
        >
          <ButtonCircle
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
          </ButtonCircle>
        </Box>

        <Box
          w={{ base: "720px", sm: "720px", lg: "960px" }}
          h={{ base: "150px", sm: "150px", lg: "175px" }}
          border={"1px dotted red"}
        >
          <Card
            overflow="hidden"
            maxW="100%"
            maxH={"100%"}
            justifyContent="center"
            align={"center"}
          >
            <Stack>
              {nextPosts >= 1 && nextPosts <= 3 && (
                <CardBody>
                  {mdPost.slice(prevPosts, nextPosts).map((post) => (
                    <Box
                      key={post.postId}
                      onClick={() => navigate(`/post/${post.postId}`)}
                    >
                      <Grid
                        w={"100%"}
                        h={"100%"}
                        templateColumns={"repeat(9, 1fr)"}
                        templateRows={"1fr 1fr 5fr"}
                        _hover={{ bgColor: "beige" }}
                        cursor={"pointer"}
                      >
                        <GridItem
                          colSpan={5}
                          rowSpan={1}
                          alignContent={"center"}
                          whiteSpace={"nowrap"}
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
                          colSpan={4}
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
                            <Text overflow={"hidden"} textOverflow={"ellipsis"}>
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
                          colSpan={3}
                          rowSpan={1}
                          alignContent={"center"}
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
                  ))}
                </CardBody>
              )}

            {nextPosts === 4 && banner.length > 0 && (
              <CardBody key={banner[0].id}>
                <Box>{banner[0].city}</Box>
              </CardBody>
            )}
            {nextPosts === 5 && banner.length > 1 && (
              <CardBody key={banner[1].id}>
                <Box>{banner[1].city}</Box>
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
    </Box>
  );
}
