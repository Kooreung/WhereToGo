import React, { useRef, useState } from "react";
import { Avatar, Box, Center, Flex, Stack, WrapItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonCircle from "../../css/Button/ButtonCircle.jsx";

const places = [
  {
    name: "강남구",
    keyword: "강남구",
    src: "https://kooreungsbucket.s3.ap-northeast-2.amazonaws.com/prj3/defaultProfile.png",
  },
  {
    name: "강서구",
    keyword: "강서구",
    src: "https://kooreungsbucket.s3.ap-northeast-2.amazonaws.com/prj3/defaultProfile.png",
  },
  {
    name: "강북구",
    keyword: "강북구",
    src: "https://kooreungsbucket.s3.ap-northeast-2.amazonaws.com/prj3/defaultProfile.png",
  },
  {
    name: "강동구",
    keyword: "강동구",
    src: "https://kooreungsbucket.s3.ap-northeast-2.amazonaws.com/prj3/defaultProfile.png",
  },
  {
    name: "서초구",
    keyword: "서초구",
    src: "https://kooreungsbucket.s3.ap-northeast-2.amazonaws.com/prj3/defaultProfile.png",
  },
  {
    name: "마포구",
    keyword: "마포구",
    src: "https://kooreungsbucket.s3.ap-northeast-2.amazonaws.com/prj3/defaultProfile.png",
  },
  {
    name: "송파구",
    keyword: "송파구",
    src: "https://kooreungsbucket.s3.ap-northeast-2.amazonaws.com/prj3/defaultProfile.png",
  },
  {
    name: "종로구",
    keyword: "종로구",
    src: "https://kooreungsbucket.s3.ap-northeast-2.amazonaws.com/prj3/defaultProfile.png",
  },
  {
    name: "양천구",
    keyword: "양천구",
    src: "https://kooreungsbucket.s3.ap-northeast-2.amazonaws.com/prj3/defaultProfile.png",
  },
  {
    name: "도봉구",
    keyword: "도봉구",
    src: "https://kooreungsbucket.s3.ap-northeast-2.amazonaws.com/prj3/defaultProfile.png",
  },
  // 필요한 만큼 장소 추가
];

export function LobbyPlaceList() {
  const dataRef = useRef(null);
  const [positionX, setPositionX] = useState(0);
  const navigate = useNavigate();

  function handleMoveRight() {
    const flexWidth = dataRef.current.scrollWidth;
    const containerWidth = dataRef.current.parentElement.offsetWidth;
    setPositionX((prev) => Math.max(prev - 250, containerWidth - flexWidth));
  }

  function handleMoveLeft() {
    setPositionX((prev) => Math.min(prev + 250, 0));
  }

  return (
    <Box>
      <Flex alignItems={"center"} justifyContent={"center"}>
        <Box>
          <ButtonCircle onClick={handleMoveLeft}>
            <FontAwesomeIcon icon={faChevronLeft} size={"2xl"} />
          </ButtonCircle>
        </Box>
        <Box w={"720px"} overflow={"hidden"}>
          <Flex
            ref={dataRef}
            sx={{
              transform: `translateX(${positionX}px)`,
              transition: "transform 0.5s ease",
            }}
            cursor="pointer"
          >
            {places.map((place, index) => (
              <WrapItem key={index}>
                <Box w={"120px"}>
                  <Stack
                    align="center"
                    onClick={() =>
                      navigate(`/post/list?type=all&keyword=${place.keyword}`)
                    }
                  >
                    <Avatar
                      size="xl"
                      boxShadow={"md"}
                      name={place.src}
                      src={place.src}
                    />
                    <Box textAlign="center">{place.name}</Box>
                  </Stack>
                </Box>
              </WrapItem>
            ))}
          </Flex>
        </Box>
        <Center>
          <ButtonCircle onClick={handleMoveRight}>
            <FontAwesomeIcon icon={faChevronRight} size={"2xl"} />
          </ButtonCircle>
        </Center>
      </Flex>
    </Box>
  );
}
