import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Avatar, Box, Flex, Spinner, Text } from "@chakra-ui/react";
import Lobby from "../Lobby.jsx";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function MemberInfoAdmin() {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [profile, setProfile] = useState(null);
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/member/${memberId}`)
      .then((res) => {
        setMember(res.data.member);
        setProfile(res.data.profile);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!account.isAdmin()) {
    return (
      <Box>
        <Lobby />;
      </Box>
    );
  }

  if (member === null) {
    return <Spinner />;
  }

  return (
    <Flex alignContent="center" justifyContent="center" alignItems="center">
      <Box mt="100">
        <Avatar
          name="defaultProfile"
          src={profile.src}
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
      </Box>
    </Flex>
  );
}

export default MemberInfoAdmin;
