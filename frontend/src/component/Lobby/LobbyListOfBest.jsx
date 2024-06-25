import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContentParser from "../ContentParser.jsx";

function LobbyListOfBest(props) {
  const [postListOfBest, setPostListOfBest] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`/api/post/list/postListOfBest`).then((res) => {
      setPostListOfBest(res.data);
    });
  }, []);
  return (
    <Box border={"1px dotted red"}>
      {postListOfBest.map((post, index) => (
        <VStack key={index} p={"1rem"}>
          <Card
            onClick={() => navigate(`/post/${post.postId}`)}
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
            cursor="pointer"
            p={"1rem"}
            sx={{
              "&:hover": {
                backgroundColor: "RGBA(0, 0, 0, 0.02)",
              },
            }}
          >
            <Box w="160px" h="160px">
              <Image
                src={post.picurl}
                objectFit={"cover"}
                w={"100%"}
                h={"100%"}
              />
            </Box>
            <Box w={{ base: "480px", sm: "360px", lg: "480px" }}>
              <CardBody>
                <Heading size="md">{post.title}</Heading>
                <ContentParser py="2" content={post.content} />
              </CardBody>
              <CardFooter>
                <Text>{post.nickName}</Text>
                <Text>
                  조회수 <FontAwesomeIcon icon={faCaretRight} /> {post.view}
                </Text>
                <Text>
                  좋아요 <FontAwesomeIcon icon={faCaretRight} />{" "}
                  {post.likeCount}
                </Text>
                <Text>
                  댓글 <FontAwesomeIcon icon={faCaretRight} />{" "}
                  {post.commentCount}
                </Text>
                <Text>{post.createDate}</Text>
              </CardFooter>
            </Box>
          </Card>
        </VStack>
      ))}
    </Box>
  );
}

export default LobbyListOfBest;
