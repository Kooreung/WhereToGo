import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import { GuideLineMediumBanner } from "../../CustomStyles.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function PostView() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/post/${postId}`)
      .then((res) => {
        setPost(res.data.post);
      })
      .catch();
  }, []);

  if (post === null || post === undefined) {
    return <Spinner />;
  }

  return (
    <Box>
      <Flex justify={"space-evenly"}>
        <Box>
          <Box {...GuideLineMediumBanner} w={500} h={500}>
            지도
          </Box>
          <Box {...GuideLineMediumBanner} w={500}>
            추가 dsadas
          </Box>
        </Box>
        <Box>
          <Box {...GuideLineMediumBanner} w={500} h={1000} p={10}>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>제목</FormLabel>
                <Input value={post.title} readOnly />
              </FormControl>
            </Box>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>작성자</FormLabel>
                <Input value={post.nickName} readOnly />
              </FormControl>
            </Box>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea h={200} value={post.content} readOnly></Textarea>
              </FormControl>
            </Box>
          </Box>
          <Box>
            <Box align={"left"} my={10}>
              <Button onClick={() => navigate(`/post/${postId}/edit`)}>
                수정
              </Button>
              <Button>취소</Button>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
