import React from "react";
import { Box, Center, Divider, Flex } from "@chakra-ui/react";
import {
  GuideLineLargeBanner,
  GuideLineMediumBanner,
} from "../../CustomStyles.jsx";

function PostList(props) {
  return (
    <Center>
      <Flex w={{ base: 700, lg: 1000 }} direction="column">
        <Box>
          <Divider orientation={"horizontal"} my={3} />
          <Box {...GuideLineMediumBanner} h={50} fontSize={"lg"} my={3}>
            회원 인기글
          </Box>
          <Flex direction={"row"} justify={"space-evenly"}>
            <Box {...GuideLineMediumBanner} w={150} h={150}>
              aa
            </Box>
            <Box {...GuideLineMediumBanner} w={150} h={150}>
              bb
            </Box>
            <Box {...GuideLineMediumBanner} w={150} h={150}>
              cc
            </Box>
          </Flex>
          <Divider orientation={"horizontal"} my={3} />
        </Box>
        <Box {...GuideLineLargeBanner} h={{ base: 700 }}>
          <Box {...GuideLineMediumBanner} w={"700"}>
            게시글1
          </Box>
          <Divider orientation={"horizontal"} my={3} />
        </Box>
      </Flex>
    </Center>
  );
}

export default PostList;
