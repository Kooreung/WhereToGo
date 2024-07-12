import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCrown,
  faHeart,
  faLocationDot,
  faPhone,
  faSquareEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export function MemberCertify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/member/tokenCertify?token=${token}`)
      .then((res) => {
        console.log(res.data);

        const accessToken = res.data.accessToken;
        const refreshToken = res.data.refreshToken;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setLoading(false);
      })
      .catch((error) => {
        // 에러 처리
        if (error.response.status === 404) {
          navigate("/expirationToken");
          console.log("API 요청 실패 - 404 에러");
        } else {
          console.error("API 요청 실패:", error);
        }
      });
  }, [token]);

  if (loading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  function handelHome() {
    navigate("/");
  }

  return (
    <Card w={420} h={620} mb={6} boxShadow={"2xl"} borderRadius={"2xl"}>
      <CardBody mt={70}>
        <Center mt={35}>
          <FontAwesomeIcon
            icon={faCircleCheck}
            style={{ color: "#D8B7E5", fontSize: "4.5em" }}
          />
        </Center>
        <Center fontWeight={"bold"} fontSize={"18"} mt={50}>
          <Box>
            <Center>이메일 주소에 대한 본인 확인이</Center>
            <Center>완료되었습니다.</Center>
          </Box>
        </Center>
        <Center>
          <Button
            color="white"
            size={"lg"}
            w={320}
            mt={50}
            onClick={handelHome}
          >
            홈으로 돌아가기
          </Button>
        </Center>
      </CardBody>
    </Card>
  );
}
