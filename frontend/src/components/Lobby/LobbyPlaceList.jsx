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
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Logo_of_Seoul%2C_South_Korea.svg/712px-Logo_of_Seoul%2C_South_Korea.svg.png",
  },
  {
    name: "송파/강동",
    addressCode: "1100000001",
    src: "https://i.namu.wiki/i/HmsdusX8aTnjfrwlTsc-xm6AD1VJupHjCXn_lbZVYWEnd3E3fs-ahmcZBv1YrDDp73qMskzP0VI84crY28g6Hn46a9yxCZoCVQorcPKyqTnPO6w5dkugDEBHCcZr6K1yHYRjz7s9L2-kgerqKQlKvQ.webp",
  },
  {
    name: "강남/서초",
    addressCode: "1100000002",
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a3/%EB%B3%84%EB%A7%88%EB%8B%B9%EB%8F%84%EC%84%9C%EA%B4%803.jpg",
  },
  {
    name: "영등포/동작/관악",
    addressCode: "1100000003",
    src: "https://i.namu.wiki/i/hTYD8VDIrh98LOxCT-mqWkwGTEG02Oy3kvxAoMORw9mHUKqT9ZgXI3nkFkmZqGKmgqS6Clw5r8jMXhJW9tERAxYAeNuoczax7gzt-2rTastEDBHBXYhZLXGyKc_040Pgg8ZduWnbuuXhd24lAZQPSg.webp",
  },
  {
    name: "구로/금천구",
    addressCode: "1100000004",
    src: "https://www.guro.go.kr/site/www/images/contents/cts2973_img1.jpg",
  },
  {
    name: "강서/양천구",
    addressCode: "1100000005",
    src: "https://www.gangseo.seoul.kr/comm/getImage?srvcId=BBSTY3&upperNo=o*h2Fo69jFfA3wvFUQ9XPg%3d%3d&fileTy=ATTACH&fileNo=qvc2xMr4QwDJC1K%5elnz1AQ%3d%3d",
  },
  {
    name: "마포/은평/서대문",
    addressCode: "1100000006",
    src: "https://photo.mapo.go.kr/file/D0739/preview/369224.jpg",
  },
  {
    name: "종로/용산/중구",
    addressCode: "1100000007",
    src: "https://i.namu.wiki/i/WXOdjY45iATXrQTBuWGwjgECPLR_YQTkUQzMz_gQ0FKmniVT0UHkzBQiu_UfpeIn5IgWL9YK3lMF38wVSC8OlvItdQMyKLzDe98Ph7MsOYFjsf0p36eSmFsnV1H6eWEJTxjUj_R6BA3KD-_8gKzdIg.webp",
  },
  {
    name: "성북구/강북",
    addressCode: "1100000008",
    src: "https://mbook.newstool.co.kr/daumeditor/images/2023/10/23/15/17/03_img1.jpg",
  },
  {
    name: "도봉구/노원",
    addressCode: "1100000009",
    src: "https://www.nowon.kr/component/file/ND_fileDownload.do?q_fileSn=232937&q_fileId=ea13c07b-f80b-4b64-b9ce-a08d2841da2e",
  },
  {
    name: "동대문/중랑구",
    addressCode: "1100000010",
    src: "https://mediaim.expedia.com/destination/1/4a88dc8899058c0109a59534c64264b0.jpg",
  },
  {
    name: "성동구/광진구",
    addressCode: "1100000011",
    src: "https://www.sisul.or.kr/open_content/cheonggye/images/visual_mb.jpg",
  },
];

const gyeonggiCity = [
  {
    name: "경기 전체",
    addressCode: "41000000",
    src: "https://i.namu.wiki/i/ZKlTZP53luYjHka5GrSdl7tbsjDpU6j3-AwG9YK1iCz9iC11Rl8_9LAeROn2lCccMMN1QFQUHQDzTJanEPHvzTRso00D5jPUG424zsfPQvtZY91LOny2qMEgVlwq4i3cSJYt8x-sGAuouJXUUs8UOg.svg",
  },
  {
    name: "파주/김포/고양",
    addressCode: "4100000001",
    src: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQy5cfajSRwUR4xTu0Xr575TI4Jp7UTfFveH9B58VMjmJ_pyPiI",
  },
  {
    name: "양주/의정부",
    addressCode: "4100000002",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnkhIGAQUT8LFP566_ujEn6LIJ_mqG2Ug_Pw&s",
  },
  {
    name: "연천/동두천/포천",
    addressCode: "4100000003",
    src: "https://lh5.googleusercontent.com/p/AF1QipP-SsceD0Zwtzl8JFzyi6tlOc_vLDLoqk_e0x9r=w540-h312-n-k-no",
  },
  {
    name: "남양주/가평",
    addressCode: "4100000004",
    src: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTmyfhdycFgsVsuBOpSLmng9NicQzhkKcBU0utwX7novLnUjLvnfj79DSfFIuzKviQzVSxrL3XOYVNGJR-AsyapwlzqBSWsadz4OgBvYg",
  },
  {
    name: "구리/하남",
    addressCode: "4100000005",
    src: "https://lh5.googleusercontent.com/p/AF1QipN799kWyFA1bBo_HmVPhjhT4dRfdYhyzkE4Mpt7=w540-h312-n-k-no",
  },
  {
    name: "양평/광주",
    addressCode: "4100000006",
    src: "https://lh5.googleusercontent.com/p/AF1QipMdzXM2TJGihwi5GAJMjmlHPfYP0NrhOpqOEGoR=w540-h312-n-k-no",
  },
  {
    name: "여주/이천",
    addressCode: "4100000007",
    src: "https://lh5.googleusercontent.com/p/AF1QipOUQnITMXFEjpJSx-q-ZARF8JFqhv3SlYrZuqql=w540-h312-n-k-no",
  },
  {
    name: "용인/안성",
    addressCode: "4100000008",
    src: "https://i.namu.wiki/i/evDLg3BQ8kxeu_tkyTPXknumkgUxfQYCuvbRfu-T-w53Pg2JgOJiHv3lyziG8lNk6GKzWy_JrNGhgxcAhT-d84jQY3sfQu7qP0sa2-Ybqk9DHeRmq680UVHx3kp8CaBAGZjrWz8FfVGwXx1bC8xq6Q.webp",
  },
  {
    name: "성남/과천/의왕",
    addressCode: "4100000009",
    src: "https://grandpark.seoul.go.kr/asset/images/sub/Introduce/7_1_3_Shistory_cover.png",
  },
  {
    name: "수원/화성",
    addressCode: "4100000010",
    src: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcRoKPgmO_0VV7joX2dd6Go7rV7Glt_Nz5Je5gw0w2as8ss_q68m0fCa-vkSfvIqlydsnY9AX43TK2C3l5zB1NhsCtnrwH8MWBZFTvBMzw",
  },
  {
    name: "오산/평택",
    addressCode: "4100000011",
    src: "https://lh5.googleusercontent.com/p/AF1QipNbEmRvI-t9h_tgiNlV7sfp1O2Wn26NNMfh51sa=w480-h300-k-n-rw",
  },
  {
    name: "안양/군포/안산",
    addressCode: "4100000012",
    src: "https://www.anyang.go.kr/site/tour/images/contents/cts1882_img02.jpg",
  },
  {
    name: "부천/광명/시흥",
    addressCode: "4100000013",
    src: "https://lh5.googleusercontent.com/p/AF1QipOlmHN-PM_P7ug32scLsTfKMCksa-LZtRk3xBoP=w540-h312-n-k-no",
  },
];

const incheonCity = [
  {
    name: "인천 전체",
    addressCode: "28000000",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuIgKcIFU8HJ5y0aChkY4fFDoaVvLgvCHWvQ&s",
  },
  {
    name: "계양구",
    addressCode: "2800000001",
    src: "https://i.namu.wiki/i/ow37TUQ1F5n6WozvjD-2GX2wIE6U4u3SOHLmta2FRol2PjA3VfDVuJdchoYR9oiuPrj5G5kihkWHsKmRcaDHng.webp",
  },
  {
    name: "부평구",
    addressCode: "2800000002",
    src: "https://www.insiseol.or.kr/park/incheongrand/img/contents/facility.jpg",
  },
  {
    name: "미추홀구",
    addressCode: "2800000003",
    src: "https://www.insiseol.or.kr/park/songdo/img/contents/michuhol.jpg",
  },
  {
    name: "남동구",
    addressCode: "2800000004",
    src: "https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=11131624&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2RpZ2lfMTExMzE2MjRfMDEyMDE0MTExMzA3&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006",
  },
  {
    name: "서구",
    addressCode: "2800000005",
    src: "https://i.namu.wiki/i/kUqA19NubJnspcgmFUOYLvkioi0Ln8mw6cg1AYobnyr1W5TgAq-88xQjzlucJAUaf2QWejK1H2pJSZ-vq5jMpQ.webp",
  },
  {
    name: "동구",
    addressCode: "2800000006",
    src: "https://www.ito.or.kr/images/bbs/galleryko/2021/hwadojingongwon_(1).jpg",
  },
  {
    name: "중구",
    addressCode: "2800000007",
    src: "https://www.ito.or.kr/images/bbs/galleryko/2021/wolmibadayeolcha_(1)(1).jpg",
  },
  {
    name: "연수구",
    addressCode: "2800000008",
    src: "https://www.ito.or.kr/images/bbs/galleryko/2021/middle/yeonsugu_songdosenteulealpakeu_gongwon_(2).jpg",
  },
  {
    name: "옹진군",
    addressCode: "2800000009",
    src: "https://lh4.googleusercontent.com/proxy/eNMUFAQNalrLHGPj64wlbnnF608C_txRf6nFAiGWBsMHsAQC6_Q88dTxsef6sGuVSPfL4r3qsR3MzsZw4Cheq_8OquCAoZyL4f-henfST_kicdaTgZs",
  },
  {
    name: "강화군",
    addressCode: "2800000010",
    src: "https://www.ganghwa-resort.co.kr/images/contents/intro2.jpg",
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
