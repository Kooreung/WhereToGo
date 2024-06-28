import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Image,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import defaultImage from "../../resource/img/unknownImage.png";
import HeadingVariant from "../../css/Heading/HeadingVariant.jsx";
import ContentParser from "../ContentParser.jsx";
import { faComment } from "@fortawesome/free-regular-svg-icons";

function LobbyPostListOfBest(props) {
  const [postListOfBest, setPostListOfBest] = useState([]);
  const navigate = useNavigate();
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
                backgroundColor: "beige",
              },
            }}
          >
            <Flex
              direction={"column"}
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              whiteSpace={"nowrap"}
              w={"70%"}
              h={"100%"}
              pr={"1rem"}
            >
              <Flex mb={"8px"}>
                <HeadingVariant overflow={"hidden"} textOverflow={"ellipsis"}>
                  {post.title}
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
                <ContentParser content={post.content} />
              </Flex>
              <Spacer />
              <Flex fontSize={{ base: "16px", lg: "16px", sm: "14px" }}>
                <Flex>
                  <Image src={post.profileName} />
                  <Text overflow={"hidden"} textOverflow={"ellipsis"}>
                    {post.nickName}
                  </Text>
                </Flex>
                <Flex pl={"1rem"} color={"lightgray"}>
                  <Text display={{ base: "none", lg: "block" }} mr={1}>
                    조회
                  </Text>
                  <Text display={{ base: "block", lg: "none" }} mr={1}>
                    <FontAwesomeIcon icon={faEye} size={"lg"} />
                  </Text>
                  <Text>{post.view}</Text>
                </Flex>
                <Flex pl={"1rem"} color={"lightgray"}>
                  <Text display={{ base: "none", lg: "block" }} mr={1}>
                    좋아요
                  </Text>
                  <Text display={{ base: "block", lg: "none" }} mr={1}>
                    <FontAwesomeIcon icon={faHeart} size={"lg"} />
                  </Text>
                  <Text>{post.likeCount}</Text>
                </Flex>
                <Flex pl={"1rem"} color={"lightgray"}>
                  <Text display={{ base: "none", lg: "block" }} mr={1}>
                    댓글
                  </Text>
                  <Text display={{ base: "block", lg: "none" }} mr={1}>
                    <FontAwesomeIcon icon={faComment} size={"lg"} />
                  </Text>
                  <Text>{post.commentCount}</Text>
                </Flex>
                <Flex pl={"1rem"} color={"lightgray"}>
                  {post.createDate}
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
        <Button onClick={() => navigate("/post/list")}>다른 글 더 보기</Button>
      </Center>
    </Box>
  );
}

export default LobbyPostListOfBest;
