import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { GuideLineMediumBanner } from "../../CustomStyles.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function PostList() {
  const [postList, setPostList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    axios.get(`/api/post/list`).then((res) => {
      setPostList(res.data.postList);
      setPageInfo(res.data.pageInfo);
      console.log(res.data);
    });
  }, []);

  // const pageNumbers = [];
  // for (let i = pageInfo.leftpageNumber; i < pageInfo.rightPageNumber; i++) {
  //   pageNumbers.push(i);
  // }

  return (
    <Center>
      <Flex w={{ base: 700, lg: 1000 }} direction="column">
        {/* 상단 회원 인기글 페이지 */}
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

        {/* 회원 게시글 페이지 */}
        <Box>
          <Table>
            <Thead></Thead>
            <Tbody>
              {postList.map((post) => (
                <Tr
                  key={post.postId}
                  onClick={() => navigate(`/post/${postId}`)}
                  cursor={"pointer"}
                >
                  <Td>
                    <Grid
                      {...GuideLineMediumBanner}
                      w={"700"}
                      h={"200"}
                      templateColumns={"repeat(6, 1fr)"}
                      templateRows={"repeat(4, 1fr)"}
                    >
                      <GridItem
                        colSpan={2}
                        rowSpan={1}
                        border={"1px dotted yellow"}
                      >
                        {post.title}
                      </GridItem>
                      <GridItem
                        colSpan={2}
                        rowSpan={1}
                        border={"1px dotted yellow"}
                      >
                        {post.nickName}
                      </GridItem>
                      <GridItem
                        colSpan={1}
                        rowSpan={1}
                        border={"1px dotted yellow"}
                      >
                        {post.view}
                      </GridItem>
                      <GridItem
                        colSpan={1}
                        rowSpan={2}
                        border={"1px dotted yellow"}
                      >
                        {post.like}
                      </GridItem>
                      <GridItem
                        colSpan={2}
                        rowSpan={3}
                        border={"1px dotted yellow"}
                      >
                        {post.thumbnail}
                      </GridItem>
                      <GridItem
                        colSpan={3}
                        rowSpan={3}
                        border={"1px dotted yellow"}
                      >
                        {post.content}
                      </GridItem>
                      <GridItem
                        colSpan={1}
                        rowSpan={2}
                        border={"1px dotted yellow"}
                      >
                        {post.comment}
                      </GridItem>
                    </Grid>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* 페이지 */}
      </Flex>
    </Center>
  );
}

export default PostList;
