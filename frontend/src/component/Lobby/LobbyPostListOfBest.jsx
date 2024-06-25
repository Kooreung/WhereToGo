import React, { useEffect, useState } from "react";
import { Box, Card, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LobbyPostListOfBest(props) {
  const [postListOfBest, setPostListOfBest] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`/api/post/list/postListOfBest`).then((res) => {
      setPostListOfBest(res.data);
    });
  }, []);
  return (
    <Box px={"1rem"}>
      {postListOfBest.map((post, index) => (
        <Card
          key={index}
          onClick={() => navigate(`/post/${post.postId}`)}
          direction={"row"}
          variant="outline"
          cursor="pointer"
          p={"1rem"}
          my={"2rem"}
          sx={{
            "&:hover": {
              backgroundColor: "RGBA(0, 0, 0, 0.02)",
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
            w={"480px"}
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
                  작성일자 <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.createDate}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      ))}
    </Box>
  );
}

export default LobbyPostListOfBest;
