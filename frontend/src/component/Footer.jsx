import React, { useContext } from "react";
import { Box, Flex, Spacer, useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginProvider.jsx";
import HeadingVariant from "../css/Heading/HeadingVariant.jsx";

function Footer() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const navColor = useColorModeValue("#D8B7E5", "#836091");
  return (
    <Flex
      w={"100%"}
      roundedTop={"1rem"}
      justify={"center"}
      p={"2rem"}
      mt={"4rem"}
      boxSizing={"border-box"}
      bg={navColor}
    >
      <Flex
        w={{ base: "720px", lg: "720px", sm: "540px" }}
        fontSize={{ base: "1rem", lg: "1rem", sm: "14px" }}
        justify={"space-between"}
      >
        <Flex direction={"column"} h={"100%"}>
          <HeadingVariant variant={"small"}>회사정보</HeadingVariant>
          <Box>상호 : 어디가지</Box>
          <Box>대표 : 고현진</Box>
          <Box>주소 : 서울특별시 마포구 신촌로 176</Box>
          <Spacer />
          {account.isAdmin() && (
            <Box onClick={() => navigate("/memberList")} cursor={"pointer"}>
              회원 관리
            </Box>
          )}
        </Flex>
        <Box>
          <HeadingVariant variant={"small"}>고객센터</HeadingVariant>
          <Box>전화 : 010-0000-0000</Box>
          <Box>FAX : 02-0000-0000</Box>
          <Box>이메일 : </Box>
          <Box>카카오톡 ID : </Box>
          <Box>운영시간 : 09:00 ~ 18:00</Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default Footer;
