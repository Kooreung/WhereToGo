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
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function PostEdit() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/post/${postId}`).then((res) => {
      setPost(res.data.post);
    });
  }, []);

  if (post === null || post === undefined) {
    return <Spinner />;
  }

  function handleClickSave() {
    setLoading(true);
    axios
      .putForm(`/api/post/edit`, {
        postId: post.postId,
        title: post.title,
        content: post.content,
      })
      .then(() => {
        navigate(`/post/${postId}`);
      })
      .catch()
      .finally(() => setLoading(false));
  }

  let disableSaveButton = false;
  if (post.title.trim().length === 0) {
    disableSaveButton = true;
  }
  if (post.content.trim().length === 0) {
    disableSaveButton = true;
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
                <Input
                  defaultValue={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                ></Input>
              </FormControl>
            </Box>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>작성자</FormLabel>
                <Input defaultValue={post.nickName} readOnly></Input>
              </FormControl>
            </Box>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea
                  h={200}
                  defaultValue={post.content}
                  onChange={(e) =>
                    setPost({ ...post, content: e.target.value })
                  }
                ></Textarea>
              </FormControl>
            </Box>
          </Box>
          <Box>
            <Box align={"left"} my={10}>
              <Button
                onClick={handleClickSave}
                isLoading={loading}
                isDisabled={disableSaveButton}
              >
                저장
              </Button>
              <Button>취소</Button>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
