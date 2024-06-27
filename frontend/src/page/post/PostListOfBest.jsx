// 회원 인기 게시글
import { Box, ButtonGroup, Divider, Flex, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../resource/img/unknownImage.png";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import HeadingVariant from "../../css/Heading/HeadingVariant.jsx";

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
        <HeadingVariant variant={"xlarge"} align={"center"}>
          회원 인기글
        </HeadingVariant>
      </Box>
      <Flex justify={"center"} gap={3}>
        {/* 사이즈가 lg 이상일 때 */}
        {postListOfBest.map((post, index) => (
          <Box
            key={index}
            onClick={() => navigate(`/post/${post.postId}`)}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow={"md"}
            cursor="pointer"
            w="300px"
            h="400px"
            display={{ base: "block", lg: "block", sm: "none" }}
            sx={{
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Box w={"240px"} h={"330px"}>
              <Box mt={"1rem"}>
                <Image
                  w={"240px"}
                  h={"240px"}
                  objectFit={"cover"}
                  boxShadow={"md"}
                  src={post.picurl || defaultImage}
                  borderRadius="lg"
                />
              </Box>
              <Box
                alignContent={"center"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
                whiteSpace={"nowrap"}
                mt={"8px"}
                textAlign={"start"}
              >
                <HeadingVariant>{post.title}</HeadingVariant>
              </Box>
              <Flex justifyContent={"space-between"} mt={"1.5rem"}>
                <Box>{post.nickName}</Box>
                <Box>{post.createDate}</Box>
              </Flex>
            </Box>
            <Divider />
            <ButtonGroup spacing="4" mt={"1rem"}>
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
                />{" "}
                {post.commentCount}
              </Box>
              <Box>
                <FontAwesomeIcon
                  icon={faEye}
                  size="lg"
                  style={{ color: "#836091" }}
                />{" "}
                {post.view}
              </Box>
            </ButtonGroup>
          </Box>
        ))}
        {/* 사이즈가 lg 이하일 때 */}
        {postListOfBest.map((post, index) => (
          <Box
            key={index}
            onClick={() => navigate(`/post/${post.postId}`)}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow={"md"}
            cursor="pointer"
            w="220px"
            h="320px"
            display={{ base: "none", lg: "none", sm: "block" }}
            sx={{
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Box w={"220px"} h={"240px"}>
              <Box mt={"1rem"}>
                <Image
                  w={"180px"}
                  h={"180px"}
                  objectFit={"cover"}
                  boxShadow={"md"}
                  src={post.picurl || defaultImage}
                  borderRadius="lg"
                />
              </Box>
              <Box
                alignContent={"center"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
                whiteSpace={"nowrap"}
                mt={"8px"}
                mx={"16px"}
                textAlign={"start"}
              >
                <HeadingVariant>{post.title}</HeadingVariant>
              </Box>
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
                />{" "}
                {post.commentCount}
              </Box>
              <Box>
                <FontAwesomeIcon
                  icon={faEye}
                  size="lg"
                  style={{ color: "#836091" }}
                />{" "}
                {post.view}
              </Box>
            </ButtonGroup>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
