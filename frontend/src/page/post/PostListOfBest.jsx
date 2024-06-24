// 회원 인기 게시글
import { Box, Flex, Heading, Image, Spacer, Text } from "@chakra-ui/react";
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
    });
  }, []);

  return (
    <Box w={{ base: "960px", lg: "1440px" }}>
      <Box mb={"2rem"}>
        <Heading align={"center"}>회원 인기글</Heading>
      </Box>
      <Flex justify={"center"} gap={6}>
        {/* 사이즈가 lg 이상일 때 */}
        {postListOfBest.map((post, index) => (
          <Flex
            key={index}
            onClick={() => navigate(`/post/${post.postId}`)}
            display={{ base: "none", lg: "flex" }}
            w={"480px"}
            h={"160px"}
            boxSizing={"content-box"}
            alignItems={"center"}
            cursor={"pointer"}
            sx={{
              "&:hover": {
                backgroundColor: "RGBA(0, 0, 0, 0.06)",
              },
            }}
          >
            <Box alignContent={"center"} w={"160px"} h={"160px"}>
              <Image
                src={post.picurl}
                objectFit={"cover"}
                w={"100%"}
                h={"100%"}
              />
            </Box>
            <Flex
              textAlign={"start"}
              alignContent={"center"}
              direction={"column"}
              w={"320px"}
              h={"160px"}
              fontSize={"14px"}
            >
              <Flex>
                <Text
                  fontSize={"16px"}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  display={"-webkit-box"}
                  css={{
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {post.title}
                </Text>
              </Flex>
              <Spacer />
              <Flex justify={"space-between"}>
                <Flex>
                  <Text ml={1}>
                    조회수 <FontAwesomeIcon icon={faCaretRight} />
                  </Text>
                  <Text ml={1}>{post.view}</Text>
                </Flex>
                <Flex>
                  <Text ml={1}>
                    좋아요 <FontAwesomeIcon icon={faCaretRight} />
                  </Text>
                  <Text ml={1}>{post.likeCount}</Text>
                </Flex>
                <Flex>
                  <Text ml={1}>
                    댓글 <FontAwesomeIcon icon={faCaretRight} />
                  </Text>
                  <Text ml={1}>{post.commentCount}</Text>
                </Flex>
              </Flex>
              <Flex justify={"space-between"}>
                <Flex>
                  <Text ml={1}>
                    작성자 <FontAwesomeIcon icon={faCaretRight} />
                  </Text>
                  <Text ml={1}>{post.nickName}</Text>
                </Flex>
                <Flex color={"lightgray"}>
                  <Text ml={1}>
                    <FontAwesomeIcon icon={faCaretRight} />
                  </Text>
                  <Text ml={1}>{post.createDate}</Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        ))}
        {/* 사이즈가 lg 이하일 때 */}
        {postListOfBest.map((post, index) => (
          <Flex
            key={index}
            onClick={() => navigate(`/post/${post.postId}`)}
            display={{ base: "flex", lg: "none" }}
            w={"240px"}
            h={"176px"}
            flexWrap={"wrap"}
            boxSizing={"content-box"}
            cursor={"pointer"}
            sx={{
              "&:hover": {
                backgroundColor: "gray.50",
              },
            }}
          >
            <Box alignContent={"center"} w={"120px"} h={"120px"}>
              <Image
                src={post.picurl}
                objectFit={"cover"}
                w={"100%"}
                h={"100%"}
              />
            </Box>
            <Box
              w={"120px"}
              h={"120px"}
              alignContent={"center"}
              textAlign={"start"}
              fontSize={"13px"}
            >
              <Flex>
                <Text ml={1}>
                  조회 <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.view}</Text>
              </Flex>
              <Flex>
                <Text ml={1}>
                  좋아요 <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.likeCount}</Text>
              </Flex>
              <Flex>
                <Text ml={1}>
                  댓글 <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.commentCount}</Text>
              </Flex>
              <Flex>
                <Text ml={1}>
                  <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.nickName}</Text>
              </Flex>
              <Flex color={"lightgray"}>
                <Text ml={1}>
                  <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.createDate}</Text>
              </Flex>
            </Box>
            <Flex>
              <Text
                overflow={"hidden"}
                textOverflow={"ellipsis"}
                display={"-webkit-box"}
                css={{
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {post.title}
              </Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
