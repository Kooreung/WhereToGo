import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../LoginProvider.jsx";
import axios from "axios";
import ContentParser from "../ContentParser.jsx";
import ButtonCircle from "../../css/Button/ButtonCircle.jsx";
import HeadingVariant from "../../css/Heading/HeadingVariant.jsx";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";

export function LobbyMdList() {
  const [mdPost, setMdPost] = useState([]);
  const [banner, setBanner] = useState([]);
  const [prevPosts, setPrevPosts] = useState(0);
  const [nextPosts, setNextPosts] = useState(1);
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const hColor = useColorModeValue("beige", "#2D3748");

  useEffect(() => {
    axios
      .get("/api/post/mdPickList")
      .then((res) => {
        setMdPost(res.data.post);
        console.log(res.data);
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
      <HeadingVariant
        variant={"large"}
        mb={{ lg: "16px", sm: "8px" }}
        textAlign={"start"}
      >
        MD 추천 Pick
      </HeadingVariant>
      <Box w={"100%"} h={"100%"}>
        <Box
          w="100%"
          h={{ base: "175px", sm: "175px", lg: "200px" }}
          alignContent={"center"}
        >
          <Box
            w={"100%"}
            h={"100%"}
            borderRadius={"12px"}
            overflow="hidden"
            justifyContent="center"
            align={"center"}
          >
            {nextPosts >= 1 && nextPosts <= mdPost.length && (
              <Box w={"100%"} h={"100%"}>
                {mdPost.slice(prevPosts, nextPosts).map((post) => (
                  <Box
                    key={post.postId}
                    onClick={() => navigate(`/post/${post.postId}`)}
                    w={"100%"}
                    h={"100%"}
                  >
                    <Grid
                      w={"100%"}
                      h={"100%"}
                      templateColumns={"1fr 2fr"}
                      templateRows={"1fr 1fr"}
                      sx={{
                        "&:hover": {
                          backgroundColor: hColor,
                        },
                      }}
                      cursor={"pointer"}
                    >
                      <GridItem>
                        <Box alignContent={"center"} whiteSpace={"nowrap"}>
                          <Flex pl={3}>
                            <Text
                              overflow={"hidden"}
                              textOverflow={"ellipsis"}
                              fontSize={"xl"}
                              fontWeight={"bold"}
                            >
                              타이틀 {post.title}
                            </Text>
                          </Flex>
                        </Box>
                        <Box alignContent={"center"}>
                          <Flex pl={3}>
                            <Text overflow={"hidden"} textOverflow={"ellipsis"}>
                              닉네임 {post.nickName}
                            </Text>
                          </Flex>
                        </Box>
                        <Box
                          alignContent={"center"}
                          overflow={"hidden"}
                          textOverflow={"ellipsis"}
                          whiteSpace={"nowrap"}
                          borderY={"1px solid lightgray"}
                        >
                          <Box pl={3}>
                            <Flex>
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
                          </Box>
                        </Box>
                      </GridItem>

                      <GridItem colSpan={1} rowSpan={3} alignContent={"center"}>
                        <Flex pl={3}>
                          <Image src={post.banner} />
                        </Flex>
                      </GridItem>
                    </Grid>
                  </Box>
                ))}
              </Box>
            )}

            {nextPosts === mdPost.length + 1 && banner.length > 0 && (
              <Box
                key={banner[0].id}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                w={"100%"}
                h={"100%"}
              >
                <Image src={banner[0].bannerSrc} />
              </Box>
            )}
            {nextPosts === mdPost.length + 2 && banner.length > 1 && (
              <Box
                key={banner[1].id}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                w={"100%"}
                h={"100%"}
              >
                <Box>
                  <Image src={banner[1].bannerSrc} />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        <Center>
          <Box
            cursor={"pointer"}
            zIndex={"1"}
            position={"relative"}
            top={{ base: "-100px", lg: "-120px" }}
            left={{ base: "-320px", lg: "-430px" }}
          >
            <ButtonCircle
              onClick={() => {
                if (nextPosts > 1) {
                  setNextPosts(nextPosts - 1);
                  setPrevPosts(prevPosts - 1);
                }
                if (nextPosts === 1) {
                  setNextPosts(mdPost.length + 2);
                  setPrevPosts(mdPost.length + 1);
                }
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} fontSize="2rem" />
            </ButtonCircle>
          </Box>
          <Box
            cursor={"pointer"}
            zIndex={"1"}
            position={"relative"}
            top={{ base: "-100px", lg: "-120px" }}
            left={{ base: "320px", lg: "430px" }}
          >
            <ButtonCircle
              onClick={() => {
                if (nextPosts < mdPost.length + 2) {
                  setNextPosts(nextPosts + 1);
                  setPrevPosts(prevPosts + 1);
                }
                if (nextPosts === mdPost.length + 2) {
                  setNextPosts(1);
                  setPrevPosts(0);
                }
              }}
            >
              <FontAwesomeIcon icon={faArrowRight} fontSize="2rem" />
            </ButtonCircle>
          </Box>
        </Center>
      </Box>
    </Box>
  );
}
