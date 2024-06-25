import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Stack,
  Text,
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
    <Box>
      {postListOfBest.map((post, index) => (
        <Stack key={index} mt={2} spacing={2} cursor="pointer">
          <Card
            w={{ base: "720px", lg: "960px" }}
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
            p={"1rem"}
            sx={{
              "&:hover": {
                backgroundColor: "RGBA(0, 0, 0, 0.06)",
              },
            }}
          >
            <Box w={"160px"} h={"160px"}>
              <Image
                src={post.picurl}
                objectFit={"cover"}
                w={"100%"}
                h={"100%"}
              />
            </Box>
            <Stack>
              <CardBody onClick={() => navigate(`/post/${post.postId}`)}>
                <Heading size="md">{post.title}</Heading>
                <ContentParser py="2" content={post.content} />
              </CardBody>

              <CardFooter>
                <Text ml={2}>{post.nickName}</Text>
                <Text ml={2}>
                  조회수 <FontAwesomeIcon icon={faCaretRight} /> {post.view}
                </Text>
                <Text ml={2}>
                  좋아요 <FontAwesomeIcon icon={faCaretRight} />{" "}
                  {post.likeCount}
                </Text>
                <Text ml={2}>
                  댓글 <FontAwesomeIcon icon={faCaretRight} />{" "}
                  {post.commentCount}
                </Text>
                <Text ml={2}>{post.createDate}</Text>
              </CardFooter>
            </Stack>
          </Card>
        </Stack>
      ))}
    </Box>
  );
}

export default LobbyListOfBest;
