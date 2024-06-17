// 회원 인기 게시글
import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

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
    <Box w={{ base: "960px", lg: "1440px" }}>
      <Box mb={"2rem"}>
        <Heading align={"center"}>회원 인기글</Heading>
      </Box>
      <Flex justify={"space-evenly"}>
        {postListOfBest.map((post, index) => (
          <Flex
            key={index}
            onClick={() => navigate(`/post/${post.postId}`)}
            border={"1px solid gray"}
            display={{ base: "none", lg: "flex" }}
            w={"320px"}
            alignItems={"center"}
            cursor={"pointer"}
            _hover={{ bgColor: "gray.50" }}
          >
            <Box
              border={"1px dotted red"}
              alignContent={"center"}
              w={"120px"}
              h={"120px"}
            >
              썸네일
            </Box>
            <Box textAlign={"start"} alignContent={"center"} ml={"1"}>
              <Box>{post.title}</Box>
              <Box>{post.nickName}</Box>
              <Box>{post.view}</Box>
              <Box>{post.likeCount}</Box>
              <Box>{post.commentCount}</Box>
            </Box>
          </Flex>
        ))}
        {postListOfBest.map((post, index) => (
          <Flex
            key={index}
            onClick={() => navigate(`/post/${post.postId}`)}
            display={{ base: "flex", lg: "none" }}
            w={"240px"}
            h={"240px"}
            flexWrap={"wrap"}
            boxSizing={"content-box"}
            cursor={"pointer"}
            _hover={{ bgColor: "gray.50" }}
          >
            <Box
              border={"1px dotted red"}
              alignContent={"center"}
              w={"120px"}
              h={"120px"}
            >
              썸네일
            </Box>
            <Box h={"120px"} alignContent={"center"} textAlign={"start"}>
              <Flex>
                <Text ml={1}>
                  좋아요 <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.likeCount}</Text>
              </Flex>
              <Flex>
                <Text ml={1}>
                  조회 <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.view}</Text>
              </Flex>
              <Flex>
                <Text ml={1}>
                  댓글 <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.commentCount}</Text>
              </Flex>
            </Box>
            <Flex w={"100%"} h={"120px"} direction={"column"}>
              <Flex fontSize={"lg"} ml={1}>
                {post.title}
              </Flex>
              <Spacer />
              <Flex>
                <Text ml={1}>
                  작성자 <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.nickName}</Text>
              </Flex>
              <Flex color={"lightgray"}>
                <Text ml={1}>
                  작성일자 <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.createDate}</Text>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
