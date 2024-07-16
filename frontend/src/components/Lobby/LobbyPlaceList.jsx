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
import ButtonCircle from "../ui/Button/ButtonCircle.jsx";
import defaultImage from "../../assets/img/unknownImage.png";
import HeadingVariant from "../ui/Heading/HeadingVariant.jsx";

const seoulCity = [
  {
    name: "서울 전체",
    addressCode: "11000000",
    src: "/src/assets/img/regionImg/00seoul/seoul00.png",
  },
  {
    name: "송파/강동",
    addressCode: "1100000001",
    src: "/src/assets/img/regionImg/00seoul/seoul01.webp",
  },
  {
    name: "강남/서초",
    addressCode: "1100000002",
    src: "/src/assets/img/regionImg/00seoul/seoul02.jpg",
  },
  {
    name: "영등포/동작/관악",
    addressCode: "1100000003",
    src: "/src/assets/img/regionImg/00seoul/seoul03.webp",
  },
  {
    name: "구로/금천구",
    addressCode: "1100000004",
    src: "/src/assets/img/regionImg/00seoul/seoul04.jpg",
  },
  {
    name: "강서/양천구",
    addressCode: "1100000005",
    src: "/src/assets/img/regionImg/00seoul/seoul05.jpeg",
  },
  {
    name: "마포/은평/서대문",
    addressCode: "1100000006",
    src: "/src/assets/img/regionImg/00seoul/seoul06.jpg",
  },
  {
    name: "종로/용산/중구",
    addressCode: "1100000007",
    src: "/src/assets/img/regionImg/00seoul/seoul07.webp",
  },
  {
    name: "성북구/강북",
    addressCode: "1100000008",
    src: "/src/assets/img/regionImg/00seoul/seoul08.jpg",
  },
  {
    name: "도봉구/노원",
    addressCode: "1100000009",
    src: "/src/assets/img/regionImg/00seoul/seoul09.jpg",
  },
  {
    name: "동대문/중랑구",
    addressCode: "1100000010",
    src: "/src/assets/img/regionImg/00seoul/seoul10.webp",
  },
  {
    name: "성동구/광진구",
    addressCode: "1100000011",
    src: "/src/assets/img/regionImg/00seoul/seoul11.jpg",
  },
];

const gyeonggiCity = [
  {
    name: "경기 전체",
    addressCode: "41000000",
    src: "/src/assets/img/regionImg/01gyeonggi/gyeonggi00.svg",
  },
  {
    name: "파주/김포/고양",
    addressCode: "4100000001",
    src: "/src/assets/img/regionImg/01gyeonggi/gyeonggi01.jpeg",
  },
  {
    name: "양주/의정부",
    addressCode: "4100000002",
    src: "/src/assets/img/regionImg/01gyeonggi/gyeonggi02.jpeg",
  },
  {
    name: "연천/동두천/포천",
    addressCode: "4100000003",
    src: "/src/assets/img/regionImg/01gyeonggi/gyeonggi03.jpg",
  },
  {
    name: "남양주/가평",
    addressCode: "4100000004",
    src: "/src/assets/img/regionImg/01gyeonggi/gyeonggi04.jpeg",
  },
  {
    name: "구리/하남",
    addressCode: "4100000005",
    src: "/src/assets/img/regionImg/01gyeonggi/gyeonggi05.jpg",
  },
  {
    name: "양평/광주",
    addressCode: "4100000006",
    src: "/src/assets/img/regionImg/01gyeonggi/gyeonggi06.jpg",
  },
  {
    name: "여주/이천",
    addressCode: "4100000007",
    src: "/src/assets/img/regionImg/01gyeonggi/gyeonggi07.jpg",
  },
  {
    name: "용인/안성",
    addressCode: "4100000008",
    src: "/src/assets/img/regionImg/01gyeonggi/gyeonggi08.webp",
  },
  {
    name: "성남/과천/의왕",
    addressCode: "4100000009",
    src: "/src/assets/img/regionImg/01gyeonggi/gyeonggi09.png",
  },
  {
    name: "수원/화성",
    addressCode: "4100000010",
    src: "/src/assets/img/regionImg/01gyeonggi/gyeonggi10.jpeg",
  },
  {
    name: "오산/평택",
    addressCode: "4100000011",
    src: "/src/assets/img/regionImg/01gyeonggi/gyeonggi11.webp",
  },
  {
    name: "안양/군포/안산",
    addressCode: "4100000012",
    src: "/src/assets/img/regionImg/01gyeonggi/gyeonggi12.jpg",
  },
  {
    name: "부천/광명/시흥",
    addressCode: "4100000013",
    src: "/src/assets/img/regionImg/01gyeonggi/gyeonggi13.jpg",
  },
];

const incheonCity = [
  {
    name: "인천 전체",
    addressCode: "28000000",
    src: "/src/assets/img/regionImg/02incheon/incheon00.png",
  },
  {
    name: "계양구",
    addressCode: "2800000001",
    src: "/src/assets/img/regionImg/02incheon/incheon01.webp",
  },
  {
    name: "부평구",
    addressCode: "2800000002",
    src: "/src/assets/img/regionImg/02incheon/incheon02.jpg",
  },
  {
    name: "미추홀구",
    addressCode: "2800000003",
    src: "/src/assets/img/regionImg/02incheon/incheon03.jpg",
  },
  {
    name: "남동구",
    addressCode: "2800000004",
    src: "/src/assets/img/regionImg/02incheon/incheon04.jpg",
  },
  {
    name: "서구",
    addressCode: "2800000005",
    src: "/src/assets/img/regionImg/02incheon/incheon05.webp",
  },
  {
    name: "동구",
    addressCode: "2800000006",
    src: "/src/assets/img/regionImg/02incheon/incheon06.jpg",
  },
  {
    name: "중구",
    addressCode: "2800000007",
    src: "/src/assets/img/regionImg/02incheon/incheon07.jpg",
  },
  {
    name: "연수구",
    addressCode: "2800000008",
    src: "/src/assets/img/regionImg/02incheon/incheon08.jpg",
  },
  {
    name: "옹진군",
    addressCode: "2800000009",
    src: "/src/assets/img/regionImg/02incheon/incheon09.jpg",
  },
  {
    name: "강화군",
    addressCode: "2800000010",
    src: "/src/assets/img/regionImg/02incheon/incheon10.jpg",
  },
];

export function LobbyPlaceList() {
  const [selectRegion, setSelectRegion] = useState("서울");
  const [positionX, setPositionX] = useState(0);
  const dataRef = useRef(null);
  const navigate = useNavigate();

  const regionCityMap = {
    서울: seoulCity,
    경기: gyeonggiCity,
    인천: incheonCity,
  };
  const places = regionCityMap[selectRegion] || [];

  const buttonStrokeColor = useColorModeValue(
    "rgba(131, 96, 145, 1)",
    "rgba(216, 183, 229, 1)",
  );
  const hColor = useColorModeValue(
    "rgba(216, 183, 229, 0.2)",
    "rgba(131, 96, 145, 0.2)",
  );

  const gradientLeft = useColorModeValue(
    "linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
    "linear-gradient(to right, rgba(26, 32, 44, 1), rgba(0, 0, 0, 0))",
  );

  const gradientRight = useColorModeValue(
    "linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
    "linear-gradient(to left, rgba(26, 32, 44, 1), rgba(0, 0, 0, 0))",
  );

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

  const handleSelectRegion = (region) => {
    setSelectRegion(region);
    setPositionX(0);
  };

  return (
    <Box>
      <Flex mb={{ lg: "16px", sm: "8px" }} alignItems={"center"}>
        <HeadingVariant
          variant={"large"}
          ml={{ lg: "40px", sm: "50px" }}
          mr={"1rem"}
          textAlign={"start"}
        >
          지역 선택
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
            <MenuItem onClick={() => handleSelectRegion("서울")}>서울</MenuItem>
            <MenuItem onClick={() => handleSelectRegion("경기")}>경기</MenuItem>
            <MenuItem onClick={() => handleSelectRegion("인천")}>인천</MenuItem>
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
                          `/post/list?type=all&region=${place.addressCode}`,
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
