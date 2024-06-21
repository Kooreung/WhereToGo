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
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
            sx={{
              "&:hover": {
                backgroundColor: "gray.50",
              },
            }}
          >
            <Image
              objectFit="cover"
              maxW={{ base: "100%", sm: "200px" }}
              src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
              alt="Caffe Latte"
            />
            <Stack>
              <CardBody onClick={() => navigate(`/post/${post.postId}`)}>
                <Heading size="md">{post.title}</Heading>
                <Text py="2">{post.content}</Text>
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
                {/*todo 위치 잡기*/}
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
