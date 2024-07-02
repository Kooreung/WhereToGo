import { Box, ButtonGroup, Divider, Flex, Image, Text } from "@chakra-ui/react";
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
      <Flex justify={"center"}>
        {/* 사이즈가 lg 이상일 때 */}
        {postListOfBest.map((post, index) => (
          <Box
            key={index}
            onClick={() => navigate(`/post/${post.postId}`)}
            borderWidth="1px"
            borderRadius="1rem"
            boxShadow={"md"}
            cursor="pointer"
            w="280px"
            h="390px"
            mx={"1rem"}
            display={{ base: "block", lg: "block", sm: "none" }}
            sx={{
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Box w={"240px"} h={"320px"}>
              <Box mt={"1rem"}>
                <Image
                  w={"240px"}
                  h={"240px"}
                  objectFit={"cover"}
                  boxShadow={"md"}
                  src={post.picurl || defaultImage}
                  borderRadius="1rem"
                />
              </Box>
              <Box
                alignContent={"center"}
                mt={"8px"}
                textAlign={"start"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
                whiteSpace={"nowrap"}
              >
                <HeadingVariant
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  whiteSpace={"nowrap"}
                >
                  {post.title}
                </HeadingVariant>
              </Box>
              <Flex justifyContent={"space-between"} mt={"1rem"}>
                <Box>{post.nickName}</Box>
                <Box>{post.createDate}</Box>
              </Flex>
            </Box>
            <Divider />
            <ButtonGroup spacing="4" mt={"1rem"} style={{ color: "#D8B7E5" }}>
              <Box>
                <FontAwesomeIcon icon={faHeart} size={"lg"} /> {post.likeCount}
              </Box>
              <Box>
                <FontAwesomeIcon icon={faComment} size={"lg"} />{" "}
                {post.commentCount}
              </Box>
              <Box>
                <FontAwesomeIcon icon={faEye} size="lg" /> {post.view}
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
            h="310px"
            mx={"4px"}
            display={{ base: "none", lg: "none", sm: "block" }}
            sx={{
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Box w={"220px"} h={"230px"}>
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
                mt={"8px"}
                mx={"16px"}
                textAlign={"start"}
              >
                <HeadingVariant
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  whiteSpace={"nowrap"}
                >
                  {post.title}
                </HeadingVariant>
              </Box>
            </Box>
            <Flex
              justifyContent={"space-between"}
              mx={"1rem"}
              fontSize="xs"
              mb={"8px"}
            >
              <Box>{post.nickName}</Box>
              <Box>{post.createDate}</Box>
            </Flex>
            <Divider />
            <Flex
              justify={"space-evenly"}
              w={"65%"}
              mt={"8px"}
              style={{ color: "#D8B7E5" }}
            >
              <Flex>
                <Text mr={"4px"}>
                  <FontAwesomeIcon icon={faHeart} size="lg" />
                </Text>
                <Text>{post.likeCount}</Text>
              </Flex>
              <Flex>
                <Text mr={"4px"}>
                  <FontAwesomeIcon icon={faComment} size="lg" />
                </Text>
                <Text>{post.commentCount}</Text>
              </Flex>
              <Flex>
                <Text mr={"4px"}>
                  <FontAwesomeIcon icon={faEye} size="lg" />
                </Text>
                <Text>{post.view}</Text>
              </Flex>
            </Flex>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
