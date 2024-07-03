import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  Flex,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../component/LoginProvider.jsx";
import Lobby from "../Lobby.jsx";

export function MemberInfoAdmin() {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [profile, setProfile] = useState(null);
  const [post, setPost] = useState([]);
  const [count, setCount] = useState([]);
  const [postLikeList, setPostLikeList] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const account = useContext(LoginContext);
  const [pagePost, setPagePost] = useState(1); // Separate page state for posts
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("post");

  // 멤버 정보 및 탭 초기 데이터 로드
  useEffect(() => {
    // 멤버 정보 및 프로필 로드
    axios
      .get(`/api/member/${memberId}`)
      .then((res) => {
        setMember(res.data.member);
        setProfile(res.data.profile);
      })
      .catch((err) => {
        console.log(err);
      });

    // 탭에 따른 데이터 로드
    if (activeTab === "post") {
      loadPostData();
    } else {
      loadPostLikeList();
    }
  }, [memberId, activeTab]); // memberId나 activeTab이 변경될 때마다 다시 로드

  // 게시물 데이터 로드
  const loadPostData = () => {
    axios
      .get(`/api/post/myList/${memberId}?page=${pagePost}&${searchParams}`)
      .then((res) => {
        if (res.data.post.length > 0) {
          setPost((prevPost) => [...prevPost, ...res.data.post]);
          setCount(res.data.count);
          setPagePost((prevPage) => prevPage + 1);
          setHasMore(true); // 데이터 추가 로딩 가능 상태로 변경
        } else {
          setHasMore(false); // 더 이상 데이터가 없음을 표시
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingMore(false); // 로딩 상태 종료
      });
  };

  // 좋아요 목록 데이터 로드
  const loadPostLikeList = () => {
    axios
      .get(`/api/post/likeList/${memberId}?page=${pagePost}&${searchParams}`)
      .then((res) => {
        if (res.data.postList.length > 0) {
          setPostLikeList((prevPostList) => [
            ...prevPostList,
            ...res.data.postList,
          ]);
          setPagePost((prevPage) => prevPage + 1);
          setHasMore(true); // 데이터 추가 로딩 가능 상태로 변경
        } else {
          setHasMore(false); // 더 이상 데이터가 없음을 표시
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingMore(false); // 로딩 상태 종료
      });
  };

  // 스크롤 이벤트 처리
  const handleScroll = () => {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    const scrolledToBottom =
      Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom) {
      if (!loadingMore && hasMore && activeTab === "post") {
        setLoadingMore(true); // 로딩 상태 설정
        loadPostData();
      }

      if (!loadingMore && hasMore && activeTab === "like") {
        setLoadingMore(true); // 로딩 상태 설정
        loadPostLikeList();
      }
    }
  };

  // 스크롤 이벤트 리스너 등록 및 해제
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // 탭 변경 처리
  const handleTabChange = (index) => {
    if (index === 0) {
      setPost([]);
      setPagePost(1); // 페이지 초기화
      setHasMore(true); // 추가 데이터 로딩 가능 상태 설정
      setLoadingMore(false); // 로딩 상태 초기화
    } else if (index === 1) {
      setPostLikeList([]);
      setPagePost(1); // 페이지 초기화
      setHasMore(true); // 추가 데이터 로딩 가능 상태 설정
      setLoadingMore(false); // 로딩 상태 초기화
    }
    setActiveTab(index === 0 ? "post" : "like");
  };

  // 멤버 데이터 로딩 중일 때 스피너 표시
  if (member === null) {
    return <Lobby />;
  }

  // 전체 좋아요 수 계산
  let likeCountAll = 0;
  count.forEach((p) => {
    likeCountAll += p.likeCount;
  });

  return (
    <Box w={720}>
      <Card w={720} mb={20} boxShadow={"2xl"}>
        <CardBody>
          <Flex>
            <Flex>
              <Avatar
                name={" "}
                bgColor={"white"}
                src={profile.src}
                w="75px"
                h="75px"
              />
            </Flex>
            <Flex
              pl={"1.5rem"}
              w={"100%"}
              flexDirection="column"
              justifyContent="center"
            >
              <Flex alignItems={"center"}>
                <Text fontSize="25px" mr={3}>
                  {member.nickName}{" "}
                </Text>
                <Text mr={2}>
                  <FontAwesomeIcon
                    icon={faReceipt}
                    style={{ color: "#D8B7E5" }}
                  />{" "}
                  {count.length}
                </Text>
                <Text mr={"1"}>
                  <FontAwesomeIcon
                    icon={faHeart}
                    style={{ color: "#D8B7E5" }}
                  />
                </Text>
                <Text>{likeCountAll}</Text>
              </Flex>
              <Text>가입일자 : {member.inserted}</Text>
            </Flex>
          </Flex>
        </CardBody>
        <Box>
          <Divider />
        </Box>
        <CardFooter>
          <Tabs
            w="100%"
            variant="soft-rounded"
            colorScheme="purple"
            onChange={handleTabChange}
          >
            <TabList mb={5}>
              <Tab>작성한 게시물</Tab>
              <Tab>좋아요를 누른 게시물</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {post.map((post) => (
                  <Box key={post.postId} mb={9}>
                    <Flex w={"100%"} justify={"space-between"}>
                      <Flex
                        fontWeight={"bolder"}
                        onClick={() => navigate(`/post/${post.postId}`)}
                        cursor={"pointer"}
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {post.title.length > 35
                          ? `${post.title.slice(0, 35)}...`
                          : post.title}
                      </Flex>
                      <Flex>{post.createDate}</Flex>
                    </Flex>
                    <Divider />
                  </Box>
                ))}
                {loadingMore && <Spinner />}
                {!loadingMore && !hasMore && (
                  <Center my={4}>
                    <Text>마지막 게시물입니다.</Text>
                  </Center>
                )}
              </TabPanel>
              <TabPanel>
                {postLikeList.map((post) => (
                  <Box key={post.postId} mb={9}>
                    <Flex w={"100%"} justify={"space-between"}>
                      <Flex
                        fontWeight={"bolder"}
                        onClick={() => navigate(`/post/${post.postId}`)}
                        cursor={"pointer"}
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {post.title.length > 35
                          ? `${post.title.slice(0, 35)}...`
                          : post.title}
                      </Flex>
                      <Flex>{post.createDate}</Flex>
                    </Flex>
                    <Divider />
                  </Box>
                ))}
                {loadingMore && <Spinner />}
                {!loadingMore && !hasMore && (
                  <Center my={4}>
                    <Text>마지막 게시물입니다.</Text>
                  </Center>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardFooter>
      </Card>
    </Box>
  );
}

export default MemberInfoAdmin;
