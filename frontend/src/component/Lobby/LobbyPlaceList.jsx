import React, { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonCircle from "../../css/Button/ButtonCircle.jsx";
import defaultImage from "../../resource/img/unknownImage.png";
import HeadingVariant from "../../css/Heading/HeadingVariant.jsx";

const seoulCity = [
  {
    name: "서울 전체",
    addressCity: "110000000",
  },
  {
    name: "송파/강동",
    addressCity: "1100000001",
    // src: "https://i.namu.wiki/i/ap0GeiZgqZy9c3NMxQAkqIsvFmDTCe55k8_ne34Dso0epFVP7LCnOiEMHZve7ma8MuOIDGohoXuld6TGsvkYKQ.webp",
  },
  {
    name: "강남/서초",
    addressCity: "1100000002",
    src: "https://www.ydp.go.kr/site/tour/images/main/tripspot_photo1_1.jpg",
  },
  {
    name: "영등포/동작/관악",
    addressCity: "1100000003",
    src: "https://i.namu.wiki/i/DK-BcaE6wDCM-N9UJbeQTn0SD9eWgsX9YKWK827rqjbrzDz0-CxW-JFOCiAsUL3CBZ4zE0UDR-p4sLaYPiUjww.webp",
  },
  {
    name: "구로/금천구",
    addressCity: "1100000004",
    src: "https://botanicpark.seoul.go.kr/upload/seditorMulti/201912051055227163dfdb-9d8b-4d1d-9e63-4592b45c10be.jpg",
  },
  {
    name: "강서/양천구",
    addressCity: "1100000005",
    src: "https://media.timeout.com/images/102767917/750/422/image.jpg",
  },
  {
    name: "마포/은평/서대문",
    addressCity: "1100000006",
    src: "https://cdn.pixabay.com/photo/2019/04/20/11/30/korea-4141530_1280.jpg",
  },
  {
    name: "종로/용산/중구",
    addressCity: "1100000007",
    src: "https://cdn.pixabay.com/photo/2014/08/14/08/34/university-417845_1280.jpg",
  },
  {
    name: "성북구/강북",
    addressCity: "1100000008",
    src: "https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/32d1403a-dc0d-491e-b187-c5aba1d02bab/it14",
  },
  {
    name: "도봉구/노원",
    addressCity: "1100000009",
    src: "https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/a93c789f-a613-496e-a4ca-3690dd479401/it14",
  },
  {
    name: "동대문/중랑구",
    addressCity: "1100000010",
    src: "https://parks.seoul.go.kr/images/egovframework/com/template/df04.jpg",
  },
  {
    name: "성동구/광진구",
    addressCity: "1100000011",
    src: "https://cdn.pixabay.com/photo/2022/12/28/12/31/seoul-7682788_640.jpg",
  },
];

const gyeonggiCity = [
  {
    name: "경기 전체",
    addressCity: "410000000",
  },
  {
    name: "파주/김포/고양",
    addressCity: "4100000001",
  },
  {
    name: "양주/의정부",
    addressCity: "4100000002",
  },
  {
    name: "연천/동두천/포천",
    addressCity: "4100000003",
  },
  {
    name: "남양주/가평",
    addressCity: "4100000004",
  },
  {
    name: "구리/하남",
    addressCity: "4100000005",
  },
  {
    name: "양평/광주",
    addressCity: "4100000006",
  },
  {
    name: "여주/이천",
    addressCity: "4100000007",
  },
  {
    name: "용인/안성",
    addressCity: "4100000008",
  },
  {
    name: "성남/과천/의왕",
    addressCity: "4100000009",
  },
  {
    name: "수원/화성",
    addressCity: "4100000010",
  },
  {
    name: "오산/평택",
    addressCity: "4100000011",
  },
  {
    name: "안양/군포/안산",
    addressCity: "4100000012",
  },
  {
    name: "부천/광명/시흥",
    addressCity: "4100000013",
  },
];

const incheonCity = [
  {
    name: "인천 전체",
    addressCity: "280000000",
  },
  {
    name: "계양구",
    addressCity: "2800000001",
  },
  {
    name: "부평구",
    addressCity: "2800000002",
  },
  {
    name: "미추홀구",
    addressCity: "2800000003",
  },
  {
    name: "남동구",
    addressCity: "2800000004",
  },
  {
    name: "서구",
    addressCity: "2800000005",
  },
  {
    name: "동구",
    addressCity: "2800000006",
  },
  {
    name: "중구",
    addressCity: "2800000007",
  },
  {
    name: "연수구",
    addressCity: "2800000008",
  },
  {
    name: "옹진군",
    addressCity: "2800000009",
  },
];

export function LobbyPlaceList() {
  const [selectRegion, setSelectRegion] = useState("서울");
  const [positionX, setPositionX] = useState(0);
  const places =
    selectRegion === "서울"
      ? seoulCity
      : selectRegion === "경기"
        ? gyeonggiCity
        : selectRegion === "인천"
          ? incheonCity
          : [];
  const buttonStrokeColor = useColorModeValue(
    "rgba(131, 96, 145, 1)",
    "rgba(216, 183, 229, 1)",
  );
  const hColor = useColorModeValue(
    "rgba(216, 183, 229, 0.2)",
    "rgba(131, 96, 145, 0.2)",
  );
  const dataRef = useRef(null);
  const navigate = useNavigate();

  function getScrollDistance() {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1024) {
      return 600; // lg
    } else if (screenWidth >= 768) {
      return 385; // sm
    } else {
      return 600; // base
    }
  }

  function handleMoveRight() {
    const scrollDistance = getScrollDistance();
    const flexWidth = dataRef.current.scrollWidth;
    const containerWidth = dataRef.current.parentElement.offsetWidth;
    setPositionX((prev) =>
      Math.max(prev - scrollDistance, containerWidth - flexWidth),
    );
  }

  function handleMoveLeft() {
    const scrollDistance = getScrollDistance();
    setPositionX((prev) => Math.min(prev + scrollDistance, 0));
  }

  const gradientLeft = useColorModeValue(
    "linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
    "linear-gradient(to right, rgba(26, 32, 44, 1), rgba(0, 0, 0, 0))",
  );

  const gradientRight = useColorModeValue(
    "linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
    "linear-gradient(to left, rgba(26, 32, 44, 1), rgba(0, 0, 0, 0))",
  );

  return (
    <Box>
      <Flex mb={{ lg: "16px", sm: "8px" }} alignItems={"center"}>
        <HeadingVariant
          variant={"large"}
          ml={{ lg: "40px", sm: "50px" }}
          mr={"1rem"}
          textAlign={"start"}
        >
          장소 선택
        </HeadingVariant>
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
            {" "}
            {selectRegion}{" "}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setSelectRegion("서울")}>서울</MenuItem>
            <MenuItem onClick={() => setSelectRegion("경기")}>경기</MenuItem>
            <MenuItem onClick={() => setSelectRegion("인천")}>인천</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Flex
        w={"100%"}
        h={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box mr={"1rem"} zIndex={2}>
          <ButtonCircle onClick={handleMoveLeft}>
            <FontAwesomeIcon icon={faChevronLeft} size={"xl"} />
          </ButtonCircle>
        </Box>
        <Box
          w={{ base: "720px", lg: "720px", sm: "480px" }}
          overflow={"hidden"}
        >
          <Box
            h={{ base: "160px", lg: "160px", sm: "140px" }}
            borderRadius={"12px"}
            py={"1rem"}
          >
            <Flex
              ref={dataRef}
              sx={{
                transform: `translateX(${positionX}px)`,
                transition: "transform 0.5s ease",
              }}
              cursor="pointer"
              align={"center"}
            >
              {places.map((place, index) => (
                <WrapItem
                  key={index}
                  sx={{
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.10)",
                      filter: "brightness(0.5)",
                    },
                  }}
                >
                  <Box
                    w={{ base: "120px", lg: "120px", sm: "96px" }}
                    h={{ base: "120px", lg: "120px", sm: "96px" }}
                  >
                    <Stack
                      align="center"
                      onClick={() =>
                        navigate(
                          `/post/list?type=all&region=${place.addressCity}`,
                        )
                      }
                    >
                      <Avatar
                        w={{ base: "96px", lg: "96px", sm: "80px" }}
                        h={{ base: "96px", lg: "96px", sm: "80px" }}
                        boxShadow={"md"}
                        name={" "}
                        bgColor={"white"}
                        src={place.src || defaultImage}
                      />
                      <Box textAlign="center">{place.name}</Box>
                    </Stack>
                  </Box>
                </WrapItem>
              ))}
            </Flex>
          </Box>
        </Box>
        <Box ml={"1rem"} zIndex={2}>
          <ButtonCircle onClick={handleMoveRight}>
            <FontAwesomeIcon icon={faChevronRight} size={"xl"} />
          </ButtonCircle>
        </Box>
      </Flex>
      <Center h={"0px"}>
        <Box
          position={"relative"}
          left={{ base: "-310px", sm: "-195px", lg: "-310px" }}
          top={{ base: "-50px", sm: "-80px", lg: "-85px" }}
          w={{ base: "50px", sm: "50px", lg: "50px" }}
          h={{ base: "150px", sm: "130px", lg: "150px" }}
          bg={gradientLeft}
          zIndex={1}
        />
        <Box
          position={"relative"}
          left={{ base: "310px", sm: "195px", lg: "310px" }}
          top={{ base: "-50px", sm: "-80px", lg: "-85px" }}
          w={{ base: "50px", sm: "50px", lg: "50px" }}
          h={{ base: "150px", sm: "130px", lg: "150px" }}
          bg={gradientRight}
          zIndex={1}
        />
      </Center>
    </Box>
  );
}
