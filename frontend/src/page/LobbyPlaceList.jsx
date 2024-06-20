import React, { useState } from "react";
import { Avatar, Box, Button, Wrap, WrapItem } from "@chakra-ui/react";
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
  const [startIndex, setStartIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setStartIndex((prevIndex) => (prevIndex + 1) % places.length);
      setAnimating(false);
    }, 500);
  };

  const visiblePlaces = [];
  for (let i = 0; i < 5; i++) {
    visiblePlaces.push(places[(startIndex + i) % places.length]);
  }

  return (
    <>
      <Box className="slide-container">
        {visiblePlaces.map((place, index) => (
          <Wrap>
            <WrapItem
              key={index}
              className={`slide-item ${animating ? "slide-enter" : ""}`}
              textAlign={"center"}
              fontWeight={"bolder"}
            >
              <Avatar size="xl" name="Dan Abrahmov" src={place.src} />
            </WrapItem>
          </Wrap>
        ))}
      </Box>
      <Button onClick={handleNext}>옆으로</Button>
    </>
  );
}
