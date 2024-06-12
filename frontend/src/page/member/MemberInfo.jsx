import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function MemberInfo(props) {
  const [member, setMember] = useState({});
  const [file, setFile] = useState({});
  const toast = useToast();
  // const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/member/memberinfo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setMember(res.data.member);
        setFile(res.data.profile);
        console.log(res.data.profile.src);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "warning",
            description: "존재하지 않는 회원입니다.",
            position: "top",
          });
          navigate("/");
        } else if (err.response.status === 403) {
          toast({
            status: "error",
            description: "권한이 없습니다.",
            position: "top",
          });
          navigate(-1);
        }
      });
  }, []);

  if (member === null) {
    return <Spinner />;
  }
  return (
    <Flex alignContent="center" justifyContent="center" alignItems="center">
      <Box mt="100">
        <Avatar
          name="defaultProfile"
          src={file.src}
          w="200px" // 원하는 너비 값으로 조정
          h="200px" // 원하는 높이 값으로 조정
        />
        <Text mb="5" fontSize="25" ml="25%" mt={23}>
          이름 : {member.name}
        </Text>
      </Box>
      <Box ml="100" fontSize="25" mt="100">
        <Text mb="5">닉네임 : {member.nickName}</Text>
        <Text mb="5">성별 : {member.gender}</Text>
        <Text mb="5">이메일 : {member.email}</Text>
        <Text mb="5">생일 : {member.birth}</Text>
        <Text mb="5">주소 : {member.address}</Text>
        <Text mb="5">휴대폰 번호 : {member.phoneNumber}</Text>
        <Button
          colorScheme="teal"
          size="xs"
          ml="100%"
          onClick={() => navigate(`/member/edit`)}
        >
          수정
        </Button>
      </Box>
    </Flex>
  );
}

export default MemberInfo;
