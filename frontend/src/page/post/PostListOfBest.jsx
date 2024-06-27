// 회원 인기 게시글
import {
  Box,
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../resource/img/unknownImage.png";
import ContentParser from "../../component/ContentParser.jsx";
import { faComment } from "@fortawesome/free-regular-svg-icons";

export function PostListOfBest() {
  const [postListOfBest, setPostListOfBest] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/post/list/postListOfBest`).then((res) => {
      setPostListOfBest(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <Box w={{ base: "960px", sm: "720px", lg: "960px" }}>
      <Box mb={"2rem"}>
        <Heading align={"center"}>회원 인기글</Heading>
      </Box>
      <Flex justify={"center"} gap={3}>
        {/* 사이즈가 lg 이상일 때 */}
        {postListOfBest.map((post, index) => (
          <Box
            key={index}
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            w="280px"
            h="380px"
            m="1rem"
            boxShadow={"md"}
            direction={"row"}
            onClick={() => navigate(`/post/${post.postId}`)}
            cursor="pointer"
            display={{ base: "block", lg: "block", sm: "none" }}
            sx={{
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Box>
              <Image
                mt={3}
                boxSize="230px"
                objectFit={"cover"}
                boxShadow={"md"}
                src={post.picurl || defaultImage}
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />
            </Box>
            <Box
              colSpan={7}
              rowSpan={1}
              alignContent={"center"}
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              whiteSpace={"nowrap"}
              mt={3}
            >
              <Stack
                ml="6"
                mr={"6"}
                spacing="3"
                textAlign={"start"}
                noOfLines={2}
              >
                <Heading color="#33664F" fontSize="2xl">
                  {post.title}
                </Heading>
                <ContentParser content={post.content}></ContentParser>
              </Stack>
            </Box>
            <Flex
              justifyContent={"space-between"}
              ml="6"
              mr={"6"}
              fontSize="xs"
            >
              <Box>{post.nickName}</Box>
              <Box>{post.createDate}</Box>
            </Flex>
            <Divider />
            <ButtonGroup spacing="4" mt={3}>
              <Box>
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{ color: "#D8B7E5" }}
                  size={"lg"}
                />{" "}
                {post.likeCount}
              </Box>
              <Box>
                <FontAwesomeIcon
                  icon={faComment}
                  style={{ color: "#33664F" }}
                  size={"lg"}
                />
                {post.commentCount}
              </Box>
              <Box>
                <FontAwesomeIcon
                  icon={faEye}
                  size="lg"
                  style={{ color: "#836091" }}
                />
                {""}
                {post.view}
              </Box>
            </ButtonGroup>
          </Box>
        ))}
        {/* 사이즈가 lg 이하일 때 */}
        {postListOfBest.map((post, index) => (
          <Box
            key={index}
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            w="280px"
            h="380px"
            m="1rem"
            boxShadow={"md"}
            onClick={() => navigate(`/post/${post.postId}`)}
            cursor="pointer"
            display={{ base: "none", lg: "none", sm: "block" }}
            sx={{
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Box>
              <Image
                mt={3}
                boxSize="230px"
                objectFit={"cover"}
                boxShadow={"md"}
                src={post.picurl || defaultImage}
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />
            </Box>
            <Box
              colSpan={7}
              rowSpan={1}
              alignContent={"center"}
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              whiteSpace={"nowrap"}
              mt={3}
            >
              <Stack
                ml="6"
                mr={"6"}
                spacing="3"
                textAlign={"start"}
                noOfLines={2}
              >
                <Heading color="#33664F" fontSize="2xl">
                  {post.title}
                </Heading>
              </Stack>
            </Box>
            <Flex
              justifyContent={"space-between"}
              ml="6"
              mr={"6"}
              fontSize="xs"
            >
              <Box>{post.nickName}</Box>
              <Box>{post.createDate}</Box>
            </Flex>
            <Divider />
            <ButtonGroup spacing="4" mt={3}>
              <Box>
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{ color: "#D8B7E5" }}
                  size={"lg"}
                />{" "}
                {post.likeCount}
              </Box>
              <Box>
                <FontAwesomeIcon
                  icon={faComment}
                  style={{ color: "#33664F" }}
                  size={"lg"}
                />
                {post.commentCount}
              </Box>
              <Box>
                <FontAwesomeIcon
                  icon={faEye}
                  size="lg"
                  style={{ color: "#836091" }}
                />
                {""}
                {post.view}
              </Box>
            </ButtonGroup>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
