import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Image,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import defaultImage from "../../assets/img/unknownImage.png";
import HeadingVariant from "../ui/Heading/HeadingVariant.jsx";
import ContentParser from "../../utils/ContentParser.jsx";
import { faComment } from "@fortawesome/free-regular-svg-icons";

function LobbyPostListOfBest(props) {
  const [postListOfBest, setPostListOfBest] = useState([]);
  const navigate = useNavigate();
  const hColor = useColorModeValue(
    "rgba(216, 183, 229, 0.2)",
    "rgba(131, 96, 145, 0.2)",
  );

  useEffect(() => {
    axios.get(`/api/post/list/postListOfBest`).then((res) => {
      setPostListOfBest(res.data);
    });
  }, []);

  return (
    <Box>
      <HeadingVariant
        variant={"large"}
        mb={{ lg: "16px", sm: "8px" }}
        textAlign={"start"}
      >
        회원 인기글
      </HeadingVariant>
      {postListOfBest.map((post, index) => (
        <Card
          key={index}
          onClick={() => navigate(`/post/${post.postId}`)}
          variant="outline"
          cursor="pointer"
          my={"1rem"}
          w={{ base: "720px", lg: "720px", sm: "540px" }}
          sx={{
            "&:hover": {
              backgroundColor: "RGBA(0, 0, 0, 0.02)",
            },
          }}
        >
          <Flex
            key={post.postId}
            onClick={() => navigate(`/post/${post.postId}`)}
            w={{ base: "720px", lg: "720px", sm: "540px" }}
            h={{ base: "200px", lg: "200px", sm: "160px" }}
            cursor={"pointer"}
            py={"1rem"}
            px={"1rem"}
            sx={{
              "&:hover": {
                backgroundColor: hColor,
              },
            }}
          >
            <Flex
              direction={"column"}
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              whiteSpace={"nowrap"}
              w={{ base: "75%", lg: "75%", sm: "70%" }}
              h={"100%"}
            >
              <Flex mb={"8px"}>
                <HeadingVariant overflow={"hidden"} textOverflow={"ellipsis"}>
                  {post.processYn === "P"
                    ? "블라인드 처리된 게시글"
                    : post.title}
                </HeadingVariant>
              </Flex>
              <Flex
                textAlign={"start"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
                display={"-webkit-box"}
                css={{
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                <ContentParser
                  content={
                    post.processYn === "P"
                      ? "블라인드 처리된 게시글"
                      : post.content
                  }
                />
              </Flex>
              <Spacer />
              <Flex w={"100%"} h={"32px"} alignItems={"center"}>
                <Flex w={"45%"}>
                  <Box w={"24px"} h={"24px"} mr={1} borderRadius={"100%"}>
                    <Avatar
                      w={"24px"}
                      h={"24px"}
                      name={" "}
                      bgColor={"white"}
                      src={post.profileName}
                    />
                  </Box>
                  <Box
                    w={"100%"}
                    textAlign={"start"}
                    overflow={"hidden"}
                    textOverflow={"ellipsis"}
                    ml={1}
                  >
                    {post.nickName}
                  </Box>
                </Flex>
                <Spacer />
                <Flex
                  gap={"10px"}
                  w={"50%"}
                  color={"lightgray"}
                  fontSize={"12px"}
                  justify={"end"}
                >
                  <Flex>
                    <Text display={{ base: "none", lg: "block" }} mr={1}>
                      조회
                    </Text>
                    <Text display={{ base: "block", lg: "none" }} mr={1}>
                      <FontAwesomeIcon icon={faEye} size={"lg"} />
                    </Text>
                    <Text>{post.view}</Text>
                  </Flex>
                  <Flex>
                    <Text display={{ base: "none", lg: "block" }} mr={1}>
                      좋아요
                    </Text>
                    <Text display={{ base: "block", lg: "none" }} mr={1}>
                      <FontAwesomeIcon icon={faHeart} size={"lg"} />
                    </Text>
                    <Text>{post.likeCount}</Text>
                  </Flex>
                  <Flex>
                    <Text display={{ base: "none", lg: "block" }} mr={1}>
                      댓글
                    </Text>
                    <Text display={{ base: "block", lg: "none" }} mr={1}>
                      <FontAwesomeIcon icon={faComment} size={"lg"} />
                    </Text>
                    <Text>{post.commentCount}</Text>
                  </Flex>
                  <Flex>{post.createDate}</Flex>
                </Flex>
              </Flex>
            </Flex>
            <Spacer />
            <Flex
              w={{ base: "160px", lg: "160px", sm: "140px" }}
              h={"100%"}
              align={"center"}
            >
              <Image
                src={post.picurl || defaultImage}
                w={{ base: "160px", lg: "160px", sm: "140px" }}
                h={{ base: "160px", lg: "160px", sm: "140px" }}
                objectFit={"cover"}
                borderRadius={"1rem"}
              />
            </Flex>
          </Flex>
        </Card>
      ))}
      <Center>
        <Button
          onClick={() => navigate("/post/list")}
          color={"black.alpha.900"}
        >
          다른 글 더 보기
        </Button>
      </Center>
    </Box>
  );
}

export default LobbyPostListOfBest;
