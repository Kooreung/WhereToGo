import React from "react";
import {
  Avatar,
  Box,
  Button,
  Center,
  Stack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "/src/css/styles.css"; // CSS 파일을 가져옵니다

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
  // 필요한 만큼 장소 추가
];

export function LobbyPlaceList() {
  const navigate = useNavigate();

  function handleMoveRight() {}

  function handleMoveLeft() {}

  return (
    <Box border={"5px solid green"}>
      <Wrap spacing="20px" border={"5px solid red"}>
        <Center>
          <Button border={"1px solid black"} onClick={handleMoveLeft}>
            옆
          </Button>
        </Center>
        {places.slice(0, 5).map((place, index) => (
          <WrapItem key={index} border={"5px solid blue"}>
            <Box width="100px" border={"5px solid black"}>
              {/* 조정 가능한 너비 */}
              <Stack
                spacing={2}
                align="center"
                onClick={() =>
                  navigate(`/post/list?type=all&keyword=${place.keyword}`)
                }
              >
                <Avatar size="xl" name="Dan Abrahmov" src={place.src} />
                <Box textAlign="center">{place.name}</Box>
              </Stack>
            </Box>
          </WrapItem>
        ))}
        <Center>
          <Button border={"1px solid black"} onClick={handleMoveRight}>
            옆
          </Button>
        </Center>
      </Wrap>
    </Box>
  );
}
