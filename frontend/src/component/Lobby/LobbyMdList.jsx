import { Box, Center, Flex, Image, useColorModeValue } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../LoginProvider.jsx";
import axios from "axios";
import ButtonCircle from "../../css/Button/ButtonCircle.jsx";
import HeadingVariant from "../../css/Heading/HeadingVariant.jsx";

export function LobbyMdList() {
  const [mdPost, setMdPost] = useState([]);
  const [banner, setBanner] = useState([]);
  const [prevPosts, setPrevPosts] = useState(0);
  const [nextPosts, setNextPosts] = useState(1);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const hColor = useColorModeValue("beige", "#2D3748");

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setNextPosts((prev) => {
        if (prev < mdPost.length + banner.length) {
          setPrevPosts((prev) => (prev + 1) % (mdPost.length + banner.length));
          return prev + 1;
        } else {
          setPrevPosts(0);
          return 1;
        }
      });
    }, 3000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [mdPost.length, banner.length]);

  useEffect(() => {
    axios
      .get("/api/post/mdPickList")
      .then((res) => {
        setMdPost(res.data.post);
      })
      .catch((err) => console.log(err));

    axios
      .get("/api/post/bannerList")
      .then((response) => {
        // 상태 업데이트로 리스트를 다시 렌더링
        setBanner(response.data);
      })
      .catch((error) => {
        // 오류 처리
        console.error("배너 리스트 불러오기 실패:", error);
      });
  }, []);

  const handleButtonClick = (index) => {
    setNextPosts(index);
    setPrevPosts(index - 1);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNextPosts((prev) => {
        if (prev < mdPost.length + banner.length) {
          setPrevPosts((prev) => (prev + 1) % (mdPost.length + banner.length));
          return prev + 1;
        } else {
          setPrevPosts(0);
          return 1;
        }
      });
    }, 3000);
  };

  return (
    <Box align={"center"}>
      <HeadingVariant
        variant={"large"}
        mb={{ lg: "16px", sm: "8px" }}
        textAlign={"start"}
      >
        MD 추천 Pick
      </HeadingVariant>

      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        w={{ base: "720px", sm: "720px", lg: "960px" }}
        h={{ base: "200px", sm: "200px", lg: "250px" }}
      >
        {nextPosts >= 1 && nextPosts <= mdPost.length && (
          <Box>
            {mdPost.slice(nextPosts - 1, nextPosts).map((post) => (
              <Box
                key={post.postId}
                onClick={() => navigate(`/post/${post.postId}`)}
                cursor={"pointer"}
                w={{ base: "720px", sm: "720px", lg: "960px" }}
                h={{ base: "200px", sm: "200px", lg: "250px" }}
                sx={{
                  "&:hover": {
                    backgroundColor: hColor,
                  },
                }}
              >
                <Image
                  src={post.banner}
                  w={"100%"}
                  h={"100%"}
                  objectFit={"cover"}
                />
              </Box>
            ))}
          </Box>
        )}

        {nextPosts === mdPost.length + 1 && banner.length > 0 && (
          <Box
            key={banner[0].id}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            w={{ base: "720px", sm: "720px", lg: "960px" }}
            h={{ base: "200px", sm: "200px", lg: "250px" }}
            overflow={"hidden"}
          >
            <a href={banner[0].link}>
              <Image src={banner[0].bannerSrc} />
            </a>
          </Box>
        )}
        {nextPosts === mdPost.length + 2 && banner.length > 1 && (
          <Box
            key={banner[1].id}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            w={{ base: "720px", sm: "720px", lg: "960px" }}
            h={{ base: "200px", sm: "200px", lg: "250px" }}
            overflow={"hidden"}
          >
            <a href={banner[1].link}>
              <Image src={banner[1].bannerSrc} />
            </a>
          </Box>
        )}
      </Box>
      <Center h={"0px"}>
        <Box
          cursor={"pointer"}
          zIndex={"1"}
          position={"relative"}
          top={{ base: "-90px", lg: "-125px" }}
          left={{ base: "-320px", lg: "-430px" }}
        >
          <ButtonCircle
            onClick={() => {
              if (nextPosts > 1) {
                setNextPosts(nextPosts - 1);
                setPrevPosts(prevPosts - 1);
              }
              if (nextPosts === 1) {
                setNextPosts(mdPost.length + banner.length);
                setPrevPosts(mdPost.length + banner.length - 1);
              }
            }}
            bgColor={"rgba(216, 183, 229, 0.25)"}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(216, 183, 229, 0.75)",
              },
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} fontSize="2rem" />
          </ButtonCircle>
        </Box>
        <Box
          cursor={"pointer"}
          zIndex={"1"}
          position={"relative"}
          top={{ base: "-90px", lg: "-125px" }}
          left={{ base: "320px", lg: "430px" }}
        >
          <ButtonCircle
            onClick={() => {
              if (nextPosts < mdPost.length + banner.length) {
                setNextPosts(nextPosts + 1);
                setPrevPosts(prevPosts + 1);
              }
              if (nextPosts === mdPost.length + banner.length) {
                setNextPosts(1);
                setPrevPosts(0);
              }
            }}
            bgColor={"rgba(216, 183, 229, 0.25)"}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(216, 183, 229, 0.75)",
              },
            }}
          >
            <FontAwesomeIcon icon={faChevronRight} fontSize="2rem" />
          </ButtonCircle>
        </Box>
      </Center>
      <Center h={"0px"} w={"100%"}>
        <Flex position={"relative"} top={"-25px"}>
          {[...Array(mdPost.length + banner.length)].map((_, index) => (
            <ButtonCircle
              variant={"small"}
              key={index}
              onClick={() => handleButtonClick(index + 1)}
              boxShadow={"md"}
              bgColor={index === nextPosts - 1 ? "#D8B7E5" : "gray"}
              sx={{
                "&:hover": {
                  backgroundColor: "#836091",
                },
              }}
            />
          ))}
        </Flex>
      </Center>
    </Box>
  );
}
