import React from "react";
import { Avatar, Box, Stack, Wrap, WrapItem } from "@chakra-ui/react";
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
  return (
    <Box>
      <Wrap>
        <Box>
          <Stack spacing={2} align="center">
            <WrapItem>
              <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
            </WrapItem>
            <Box>강남</Box>
          </Stack>
        </Box>
        <WrapItem>
          <Avatar
            name="Kola Tioluwani"
            src="https://bit.ly/tioluwani-kolawole"
          />
        </WrapItem>
        <WrapItem>
          <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
        </WrapItem>
        <WrapItem>
          <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
        </WrapItem>
        <WrapItem>
          <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
        </WrapItem>
        <WrapItem>
          <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
        </WrapItem>
        <WrapItem>
          <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
        </WrapItem>
      </Wrap>
    </Box>
  );
}
