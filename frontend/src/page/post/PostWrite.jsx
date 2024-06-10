import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { GuideLineMediumBanner } from "../../CustomStyles.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PostWrite(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleClickSave() {
    setLoading(true);
    axios
      .postForm("/post/add", { title, content })
      .then(navigate("/"))
      .catch()
      .finally(() => setLoading(false));
  }

  let disableSaveButton = false;
  // if (title.trim().length === 0) {
  //   disableSaveButton = true;
  // }
  // if (content.trim().length === 0) {
  //   disableSaveButton = true;
  // }

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
                  defaultValue={"제목"}
                  onChange={(e) => setTitle(e.target.value)}
                ></Input>
              </FormControl>
            </Box>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>작성자</FormLabel>
                <Input value={"작성자"} readOnly></Input>
              </FormControl>
            </Box>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea
                  h={200}
                  defaultValue={"내용을 작성해주세요."}
                  onChange={(e) => setContent(e.target.value)}
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
                등록
              </Button>
              <Button>취소</Button>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default PostWrite;
