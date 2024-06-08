import React from "react";
import { Box, Button, Flex, Input, Textarea } from "@chakra-ui/react";
import { GuideLineMediumBanner } from "../../CustomStyles.jsx";

function PostWrite(props) {
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
              <Box>제목</Box>
              <Input value={"제목"}></Input>
            </Box>
            <Box align={"left"} my={10}>
              <Box>작성자</Box>
              <Input value={"작성자"}></Input>
            </Box>
            <Box align={"left"} my={10}>
              <Box>내용</Box>
              <Textarea h={200} defaultValue={"내용"}></Textarea>
            </Box>
          </Box>
          <Box>
            <Box align={"left"} my={10}>
              <Button>등록</Button>
              <Button>취소</Button>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default PostWrite;
