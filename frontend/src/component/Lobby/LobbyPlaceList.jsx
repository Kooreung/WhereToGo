import React, { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Center,
  Flex,
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

const places = [
  {
    name: "강남구",
    keyword: "강남구",
    src: "https://i.namu.wiki/i/ap0GeiZgqZy9c3NMxQAkqIsvFmDTCe55k8_ne34Dso0epFVP7LCnOiEMHZve7ma8MuOIDGohoXuld6TGsvkYKQ.webp",
  },

  {
    name: "영등포구",
    keyword: "영등포구",
    src: "https://www.ydp.go.kr/site/tour/images/main/tripspot_photo1_1.jpg",
  },
  {
    name: "용산구",
    keyword: "용산구",
    src: "https://i.namu.wiki/i/DK-BcaE6wDCM-N9UJbeQTn0SD9eWgsX9YKWK827rqjbrzDz0-CxW-JFOCiAsUL3CBZ4zE0UDR-p4sLaYPiUjww.webp",
  },
  {
    name: "강서구",
    keyword: "강서구",
    src: "https://botanicpark.seoul.go.kr/upload/seditorMulti/201912051055227163dfdb-9d8b-4d1d-9e63-4592b45c10be.jpg",
  },
  {
    name: "마포구",
    keyword: "마포구",
    src: "https://media.timeout.com/images/102767917/750/422/image.jpg",
  },
  {
    name: "종로구",
    keyword: "종로구",
    src: "https://cdn.pixabay.com/photo/2019/04/20/11/30/korea-4141530_1280.jpg",
  },
  {
    name: "서대문구",
    keyword: "서대문구",
    src: "https://cdn.pixabay.com/photo/2014/08/14/08/34/university-417845_1280.jpg",
  },
  {
    name: "성동구",
    keyword: "성동구",
    src: "https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/32d1403a-dc0d-491e-b187-c5aba1d02bab/it14",
  },
  {
    name: "서초구",
    keyword: "서초구",
    src: "https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/a93c789f-a613-496e-a4ca-3690dd479401/it14",
  },
  {
    name: "강북구",
    keyword: "강북구",
    src: "https://parks.seoul.go.kr/images/egovframework/com/template/df04.jpg",
  },
  {
    name: "성북구",
    keyword: "성북구",
    src: "https://cdn.pixabay.com/photo/2022/12/28/12/31/seoul-7682788_640.jpg",
  },
  {
    name: "동대문구",
    keyword: "동대문구",
    src: "https://cdn.pixabay.com/photo/2019/11/26/00/32/korea-4653276_1280.jpg",
  },
  {
    name: "강동구",
    keyword: "강동구",
    src: "https://mediahub.seoul.go.kr/wp-content/uploads/mediahub/2022/08/dxFzYzSWfkbJzGybhaZpRRUwTzbXgjQo.JPG",
  },
  {
    name: "은평구",
    keyword: "은평구",
    src: "https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/1552e1f6-ee34-497d-a6f4-f640710014bd/it14",
  },
  {
    name: "구로구",
    keyword: "구로구",
    src: "https://www.guro.go.kr/site/www/images/contents/cts2990_img1.jpg",
  },
  {
    name: "동작구",
    keyword: "동작구",
    src: "https://korean.visitseoul.net/comm/getImage?srvcId=POST&parentSn=9506&fileTy=POSTTHUMB&fileNo=2",
  },
  {
    name: "중구",
    keyword: "중구",
    src: "https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/220949b2-6fab-4265-850f-cf0393d5e580/it14",
  },
  {
    name: "광진구",
    keyword: "광진구",
    src: "https://www.gwangjin.com/imgdata/gwangjin_com/202004/2020042929118765.jpg",
  },
  {
    name: "송파구",
    keyword: "송파구",
    src: "https://cdn.pixabay.com/photo/2022/11/27/11/23/building-7619502_1280.jpg",
  },

  {
    name: "양천구",
    keyword: "양천구",
    src: "https://mbook.newstool.co.kr/daumeditor/images/2023/08/24/16/40/09_img1.jpg",
  },
  {
    name: "금천구",
    keyword: "금천구",
    src: "https://www.geumcheon.go.kr/site/portal/images/contents/cts957_img05.jpg",
  },
  {
    name: "도봉구",
    keyword: "도봉구",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtWTscoqfa9LPgOeDIAmO2xRCFrmxc9VRItQ&s",
  },
  {
    name: "관악구",
    keyword: "관악구",
    src: "https://www.gwanak.go.kr/images/gwanak/m5/culture/tour/naksung_photo2.jpg",
  },
  {
    name: "노원구",
    keyword: "노원구",
    src: "https://gocamping.or.kr/upload/camp/598/thumb/thumb_720_33147DI31oJk8Kzvz8t964vm.jpg",
  },
  // 필요한 만큼 장소 추가
];

export function LobbyPlaceList() {
  const dataRef = useRef(null);
  const [positionX, setPositionX] = useState(0);
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
      <HeadingVariant
        variant={"large"}
        mb={{ lg: "16px", sm: "8px" }}
        ml={{ lg: "40px", sm: "50px" }}
        textAlign={"start"}
      >
        장소 선택
      </HeadingVariant>
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
                        navigate(`/post/list?type=all&keyword=${place.keyword}`)
                      }
                    >
                      <Avatar
                        w={{ base: "96px", lg: "96px", sm: "80px" }}
                        h={{ base: "96px", lg: "96px", sm: "80px" }}
                        boxShadow={"md"}
                        name={place.src}
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
