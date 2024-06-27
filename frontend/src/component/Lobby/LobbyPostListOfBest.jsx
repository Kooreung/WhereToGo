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
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import defaultImage from "../../resource/img/unknownImage.png";
import HeadingVariant from "../../css/Heading/HeadingVariant.jsx";

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
          direction={"row"}
          variant="outline"
          cursor="pointer"
          p={"1rem"}
          my={"1rem"}
          sx={{
            "&:hover": {
              backgroundColor: "RGBA(0, 0, 0, 0.02)",
            },
          }}
        >
          <Flex>
            <Box w={"160px"} h={"160px"}>
              <Image
                src={post.picurl || defaultImage}
                objectFit={"cover"}
                w={"100%"}
                h={"100%"}
              />
            </Box>
          </Flex>
          <Flex
            textAlign={"start"}
            alignContent={"center"}
            direction={"column"}
            w={"560px"}
            h={"160px"}
            ml={"1rem"}
          >
            <Flex>
              <HeadingVariant
                variant={"medium"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
                display={"-webkit-box"}
                w={"100%"}
                css={{
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {post.title}
              </HeadingVariant>
            </Flex>
            <Spacer />
            <Flex justify={"space-between"} fontSize={"14px"}>
              <Flex>
                <Text>
                  조회수 <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.view}</Text>
              </Flex>
              <Flex>
                <Text>
                  좋아요 <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.likeCount}</Text>
              </Flex>
              <Flex>
                <Text>
                  댓글 <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.commentCount}</Text>
              </Flex>
            </Flex>
            <Flex justify={"space-between"} fontSize={"14px"}>
              <Flex>
                <Text>
                  작성자 <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.nickName}</Text>
              </Flex>
              <Flex color={"lightgray"}>
                <Text>
                  작성일자 <FontAwesomeIcon icon={faCaretRight} />
                </Text>
                <Text ml={1}>{post.createDate}</Text>
              </Flex>
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
