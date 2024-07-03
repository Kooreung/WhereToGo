import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Image,
  Input,
  Select,
  Spacer,
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEye,
  faHeart,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import ContentParser from "../../component/ContentParser.jsx";
import defaultImage from "../../resource/img/unknownImage.png";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import HeadingVariant from "../../css/Heading/HeadingVariant.jsx";
import ButtonCircle from "../../css/Button/ButtonCircle.jsx";

export function PostMdList(props) {
  const [mdPost, setMdPost] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const hColor = useColorModeValue(
    "rgba(216, 183, 229, 0.2)",
    "rgba(131, 96, 145, 0.2)",
  );
  const [showFirstScreen, setShowFirstScreen] = useState(true);
  // 화면 크기에 따라 항목 수 결정
  const itemsPerRow = useBreakpointValue({ base: 1, md: 4, lg: 3 });
  useEffect(() => {
    axios.get(`/api/post/mdList?${searchParams}`).then((res) => {
      setMdPost(res.data.post);
      console.log(res.data);
    });

    setSearchType("all");
    setSearchKeyword("");

    const typeParam = searchParams.get("type");
    const keywordParam = searchParams.get("keyword");
    if (typeParam) {
      setSearchType(typeParam);
    }
    if (keywordParam) {
      setSearchKeyword(keywordParam);
    }
  }, [searchParams]);

  function handleLoadMore() {
    setVisiblePosts(
      (prevVisiblePosts) => prevVisiblePosts + (itemsPerRow || 3),
    );
  }

  function handleSearchClick() {
    if (!searchKeyword.trim()) {
      return;
    }
    navigate(`/post/mdList?type=${searchType}&keyword=${searchKeyword}`);
  }

  function handleSearchKeyDown(e) {
    if (e.key === "Enter") {
      if (!searchKeyword.trim()) {
        return;
      }
      navigate(`/post/mdList?type=${searchType}&keyword=${searchKeyword}`);
    }
  }

  const handleListButtonClick = () => {
    setShowFirstScreen(!showFirstScreen); // 화면 전환
  };

  // 목록 버튼 누르기 전 화면
  const FirstScreen = () => (
    <Box align="center" justify="center" overflowX={"hidden"}>
      {mdPost.length === 0 && <Center>조회 결과가 없습니다.</Center>}
      {mdPost.length > 0 && (
        <Box mt={"2rem"}>
          {Array.from({
            length: Math.ceil(visiblePosts / (itemsPerRow || 3)),
          }).map((_, rowIndex) => (
            <Stack
              key={rowIndex}
              divider={<StackDivider borderColor={"blue"} />}
              w={{ base: "630px", lg: "940px", sm: "630px" }}
            >
              <Flex wrap="wrap" border={"1px dotted red"}>
                {mdPost
                  .slice(
                    rowIndex * (itemsPerRow || 3),
                    rowIndex * (itemsPerRow || 3) + (itemsPerRow || 3),
                  )
                  .map((post, index) => (
                    <Box
                      key={index}
                      onClick={() => navigate(`/post/${post.postId}`)}
                      overflow={"hidden"}
                      borderWidth="1px"
                      borderRadius="1rem"
                      boxShadow={"md"}
                      cursor="pointer"
                      w="280px"
                      h="390px"
                      m={"1rem"}
                      sx={{
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <Box w={"240px"} h={"320px"}>
                        <Box mt={"1rem"}>
                          <Image
                            w={"240px"}
                            h={"240px"}
                            objectFit={"cover"}
                            boxShadow={"md"}
                            src={post.picurl || defaultImage}
                            borderRadius="1rem"
                          />
                        </Box>
                        <Box
                          alignContent={"center"}
                          mt={"8px"}
                          textAlign={"start"}
                          overflow={"hidden"}
                          textOverflow={"ellipsis"}
                          whiteSpace={"nowrap"}
                        >
                          <HeadingVariant
                            overflow={"hidden"}
                            textOverflow={"ellipsis"}
                            whiteSpace={"nowrap"}
                          >
                            {post.title}
                          </HeadingVariant>
                        </Box>
                        <Flex justifyContent={"space-between"} mt={"1rem"}>
                          <Box>{post.nickName}</Box>
                          <Box>{post.createDate}</Box>
                        </Flex>
                      </Box>
                      <Divider />
                      <Center
                        mt={"1rem"}
                        gap={"8px"}
                        style={{ color: "#D8B7E5" }}
                      >
                        <Box>
                          <FontAwesomeIcon icon={faHeart} size={"lg"} />{" "}
                          {post.likeCount}
                        </Box>
                        <Box>
                          <FontAwesomeIcon icon={faComment} size={"lg"} />{" "}
                          {post.commentCount}
                        </Box>
                        <Box>
                          <FontAwesomeIcon icon={faEye} size="lg" /> {post.view}
                        </Box>
                      </Center>
                    </Box>
                  ))}
              </Flex>
            </Stack>
          ))}
        </Box>
      )}
    </Box>
  );

  // 목록버튼 누른후 화면
  const SecondScreen = () => (
    <Box align="center" justify="center" overflowX={"hidden"}>
      {mdPost.length === 0 && <Center>조회 결과가 없습니다.</Center>}
      {mdPost.length > 0 && (
        <VStack
          divider={<StackDivider />}
          my={"2rem"}
          spacing={{ base: "2rem", lg: "2rem", sm: "1rem" }}
          w={{ base: "720px", lg: "720px", sm: "660px" }}
        >
          {mdPost.slice(0, visiblePosts).map((post) => (
            <Flex
              key={post.postId}
              onClick={() => navigate(`/post/${post.postId}`)}
              w={{ base: "720px", lg: "720px", sm: "660px" }}
              h={{ base: "240px", lg: "240px", sm: "200px" }}
              cursor={"pointer"}
              boxShadow={"base"}
              borderRadius={"1rem"}
              py={"1rem"}
              px={"1rem"}
              sx={{
                "&:hover": {
                  backgroundColor: hColor,
                },
              }}
            >
              <Flex
                direction={"column"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
                whiteSpace={"nowrap"}
                w={"75%"}
                h={"100%"}
                pr={"1rem"}
              >
                <Flex mb={"8px"}>
                  <HeadingVariant overflow={"hidden"} textOverflow={"ellipsis"}>
                    {post.title}
                  </HeadingVariant>
                </Flex>
                <Flex
                  textAlign={"start"}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  display={"-webkit-box"}
                  css={{
                    WebkitLineClamp: "3",
                    WebkitBoxOrient: "vertical",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <ContentParser content={post.content} />
                </Flex>
                <Spacer />
                <Flex w={"100%"} h={"32px"} alignItems={"center"}>
                  <Flex w={"50%"}>
                    <Flex overflow={"hidden"} textOverflow={"ellipsis"}>
                      <Avatar
                        w={"24px"}
                        h={"24px"}
                        name={" "}
                        bgColor={"white"}
                        src={post.profileName}
                      />
                      <Box
                        ml={1}
                        textAlign={"start"}
                        overflow={"hidden"}
                        textOverflow={"ellipsis"}
                      >
                        {post.nickName}
                      </Box>
                    </Flex>
                  </Flex>
                  <Spacer />
                  <Flex
                    gap={"10px"}
                    w={"50%"}
                    color={"lightgray"}
                    fontSize={"12px"}
                    justify={"end"}
                  >
                    <Flex>
                      <Text display={{ base: "none", lg: "block" }} mr={1}>
                        조회
                      </Text>
                      <Text display={{ base: "block", lg: "none" }} mr={1}>
                        <FontAwesomeIcon icon={faEye} size={"lg"} />
                      </Text>
                      <Text>{post.view}</Text>
                    </Flex>
                    <Flex>
                      <Text display={{ base: "none", lg: "block" }} mr={1}>
                        좋아요
                      </Text>
                      <Text display={{ base: "block", lg: "none" }} mr={1}>
                        <FontAwesomeIcon icon={faHeart} size={"lg"} />
                      </Text>
                      <Text>{post.likeCount}</Text>
                    </Flex>
                    <Flex>
                      <Text display={{ base: "none", lg: "block" }} mr={1}>
                        댓글
                      </Text>
                      <Text display={{ base: "block", lg: "none" }} mr={1}>
                        <FontAwesomeIcon icon={faComment} size={"lg"} />
                      </Text>
                      <Text>{post.commentCount}</Text>
                    </Flex>
                    <Flex>{post.createDate}</Flex>
                  </Flex>
                </Flex>
              </Flex>
              <Spacer />
              <Flex
                w={{ base: "200px", lg: "200px", sm: "160px" }}
                h={"100%"}
                align={"center"}
              >
                <Image
                  src={post.picurl || defaultImage}
                  w={{ base: "200px", lg: "200px", sm: "160px" }}
                  h={{ base: "200px", lg: "200px", sm: "160px" }}
                  objectFit={"cover"}
                  borderRadius={"1rem"}
                />
              </Flex>
            </Flex>
          ))}
        </VStack>
      )}
    </Box>
  );

  return (
    <Box align="center" justify="center">
      <Box mb={"2rem"}>
        <HeadingVariant variant={"xlarge"} align={"center"} mb={"1rem"}>
          MD'S PICK
        </HeadingVariant>
        <Flex justify={"space-between"}>
          <Box w={"80px"} />
          <Flex justify={"center"} align={"center"}>
            <Box>
              <Select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                }}
              >
                <option value={"all"}>전체</option>
                <option value={"titleAndContent"}>제목+내용</option>
                <option value={"nickName"}>닉네임</option>
                <option value={"placeName"}>장소명</option>
                <option value={"address"}>지역명</option>
              </Select>
            </Box>
            <Box ml={1}>
              <Input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="검색어"
                onKeyDown={handleSearchKeyDown}
              />
            </Box>
            <Box ml={2}>
              <ButtonCircle onClick={handleSearchClick}>
                <FontAwesomeIcon icon={faMagnifyingGlass} fontSize="small" />
              </ButtonCircle>
            </Box>
            <Box ml={1}>
              <ButtonCircle onClick={handleListButtonClick}>
                <FontAwesomeIcon icon={faBars} fontSize="small" />
              </ButtonCircle>
            </Box>
          </Flex>
          <Box ml={1}>
            {account.isAdmin() && (
              <Button
                onClick={() => navigate(`/post/write`)}
                color={"black.alpha.900"}
              >
                글쓰기
              </Button>
            )}
          </Box>
        </Flex>
      </Box>
      {/*검색기능 */}
      <Divider
        border={"1px solid lightGray"}
        w={{ base: "720px", lg: "960px" }}
      />
      {/*게시물 시작*/}
      <Box align="center" justify="center" overflowX={"hidden"}>
        {showFirstScreen ? <FirstScreen /> : <SecondScreen />}
      </Box>
      <Box mt={5}>
        {visiblePosts < mdPost.length - 1 && (
          <Button onClick={handleLoadMore}>더보기</Button>
        )}
      </Box>
    </Box>
  );
}

export default PostMdList;
