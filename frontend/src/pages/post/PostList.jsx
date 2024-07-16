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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Spacer,
  StackDivider,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faEye,
  faHeart,
  faMagnifyingGlass,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../components/ui/LoginProvider.jsx";
import axios from "axios";
import { PostListOfBest } from "./PostListOfBest.jsx";
import defaultImage from "../../assets/img/unknownImage.png";
import HeadingVariant from "../../components/ui/Heading/HeadingVariant.jsx";
import ContentParser from "../../utils/ContentParser.jsx";
import ButtonCircle from "../../components/ui/Button/ButtonCircle.jsx";
import ButtonOutline from "../../components/ui/Button/ButtonOutline.jsx";
import { faComment } from "@fortawesome/free-regular-svg-icons";

function PostList() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const [postList, setPostList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchRegion, setSearchRegion] = useState("");

  const buttonStrokeColor = useColorModeValue(
    "rgba(131, 96, 145, 1)",
    "rgba(216, 183, 229, 1)",
  );
  const hColor = useColorModeValue(
    "rgba(216, 183, 229, 0.2)",
    "rgba(131, 96, 145, 0.2)",
  );

  const fetchPosts = async (latitude, longitude) => {
    try {
      const response = await axios.get(`/api/post/list`, {
        params: {
          page: searchParams.get("page") || 1,
          listSlider: searchParams.get("listSlider") || "closely",
          type: searchParams.get("type") || "all",
          keyword: searchParams.get("keyword") || "",
          region: searchParams.get("region") || "",
          lat: latitude,
          lng: longitude,
        },
      });
      // 서버에서 받은 데이터 설정
      setPostList(response.data.postList);
      setPageInfo(response.data.pageInfo);
    } catch (error) {
      console.error("요청 오류 발생", error);
    }
  };

  const updateSearchSettings = () => {
    setSearchType(searchParams.get("type") || "all");
    setSearchKeyword(searchParams.get("keyword") || "");
    setSearchRegion(searchParams.get("region") || "");
  };

  useEffect(() => {
    // 위치 정보 가져오기
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        fetchPosts(latitude, longitude);
      },
      () => {
        const defaultLatitude = 37.52499981233085;
        const defaultLongitude = 126.70531779795746;
        fetchPosts(defaultLatitude, defaultLongitude);
      },
    );

    updateSearchSettings();
  }, [searchParams, setCurrentPage]);

  // 페이지 수
  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  // 검색 클릭 시 URL
  function handleSearchClick() {
    if (!searchKeyword.trim()) {
      return;
    }
    navigateToSearchResults();
  }

  // 검색 창 Enter 시 URL
  function handleSearchKeyDown(e) {
    if (e.key === "Enter" && searchKeyword.trim()) {
      navigateToSearchResults();
    }
  }

  // 페이지 버튼 클릭 시
  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    navigateWithSearchParams();
  }

  // 슬라이더 선택 시
  function handleSelectList(selectListStyle) {
    searchParams.set("listSlider", selectListStyle);
    navigateWithSearchParams();
  }

  // 검색 결과로 이동
  function navigateToSearchResults() {
    navigate(`/post/list?type=${searchType}&keyword=${searchKeyword}`);
  }

  // searchParams를 사용하여 페이지 이동
  function navigateWithSearchParams() {
    navigate(`/post/list?${searchParams.toString()}`);
  }

  return (
    <Box align="center" justify="center">
      <PostListOfBest />
      <Divider
        border={"1px solid lightGray"}
        w={{ base: "960px", lg: "960px", sm: "660px" }}
        my={"2rem"}
      ></Divider>
      <Flex mx={"1rem"}>
        <HeadingVariant variant={"xlarge"} align={"start"}>
          회원 게시글
        </HeadingVariant>
        <Spacer />
        <Menu>
          <MenuButton
            as={Button}
            border={`1px solid ${buttonStrokeColor}`}
            backgroundColor={"white"}
            sx={{
              "&:hover": {
                backgroundColor: hColor,
              },
            }}
          >
            <FontAwesomeIcon icon={faSliders} />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleSelectList("closely")}>
              가까운 순
            </MenuItem>
            <MenuItem onClick={() => handleSelectList("recently")}>
              최신 순
            </MenuItem>
          </MenuList>
        </Menu>
        {account.isLoggedIn() && (
          <Button
            onClick={() => navigate(`/post/write`)}
            ml={{ base: "8px", lg: "1rem", sm: "8px" }}
            color={"black.alpha.900"}
          >
            글쓰기
          </Button>
        )}
      </Flex>
      {/* 회원 게시글 페이지 */}
      {postList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
      {postList.length > 0 && (
        <VStack
          divider={<StackDivider />}
          my={"2rem"}
          spacing={{ base: "2rem", lg: "2rem", sm: "1rem" }}
          w={{ base: "720px", lg: "720px", sm: "660px" }}
        >
          {postList.map((post) => (
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
                    {post.processYn === "P"
                      ? "블라인드 처리된 게시글"
                      : post.title}
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
                  <ContentParser
                    content={
                      post.processYn === "P"
                        ? "블라인드 처리된 게시글"
                        : post.content
                    }
                  />
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
      <Divider
        border={"1px solid lightGray"}
        w={{ base: "720px", lg: "960px" }}
        my={"2rem"}
      ></Divider>
      {/* 게시글 검색 */}
      <Box my={"2rem"}>
        <Flex align={"center"} justify={"center"} gap={10}>
          <Center>
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
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder={"검색어"}
              />
            </Box>
            <Box ml={2}>
              <ButtonCircle onClick={handleSearchClick}>
                <FontAwesomeIcon icon={faMagnifyingGlass} fontSize="small" />
              </ButtonCircle>
            </Box>
          </Center>
        </Flex>
      </Box>

      {/* 페이징 */}
      <Box>
        <Center>
          {pageInfo.prevPageNumber && (
            <>
              <ButtonOutline onClick={() => handlePageButtonClick(1)}>
                <FontAwesomeIcon icon={faAnglesLeft} />
              </ButtonOutline>
              <ButtonOutline
                onClick={() => handlePageButtonClick(pageInfo.prevPageNumber)}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </ButtonOutline>
            </>
          )}

          {pageNumbers.map((pageNumber) => (
            <ButtonOutline
              key={pageNumber}
              onClick={() => handlePageButtonClick(pageNumber)}
              colorScheme={
                pageNumber === pageInfo.currentPageNumber ? "purple" : "gray"
              }
            >
              {pageNumber}
            </ButtonOutline>
          ))}
          {pageInfo.nextPageNumber && (
            <>
              <ButtonOutline
                onClick={() => handlePageButtonClick(pageInfo.nextPageNumber)}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </ButtonOutline>
              <ButtonOutline
                onClick={() => handlePageButtonClick(pageInfo.lastPageNumber)}
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </ButtonOutline>
            </>
          )}
        </Center>
      </Box>
    </Box>
  );
}

export default PostList;
