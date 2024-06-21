import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function MemberInfo(props) {
  const [member, setMember] = useState({});
  const [file, setFile] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

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
        setId(res.data.member.memberId);
        console.log(res.data.profile.src);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: "존재하지 않는 회원입니다.",
            position: "bottom",
          });
          navigate("/");
        } else if (err.response.status === 403) {
          toast({
            status: "error",
            description: "권한이 없습니다.",
            position: "bottom",
          });
          navigate(-1);
        }
      });
  }, []);

  function test() {
    axios.get("/api/name/create").then((res) => {
      console.log(res.data);
    });
  }

  function handleCLickDelete() {
    console.log(id);
    axios
      .delete(`/api/member/delete`, {
        data: { memberId: id, password },
      })
      .then(() => {
        toast({
          status: "success",
          description: "회원 탈퇴하였습니다.",
          position: "bottom",
        });
        account.logout();
        navigate("/");
      })
      .catch(() => {
        toast({
          status: "error",
          description: "탈퇴중 문제가 생겼습니다.",
          position: "bottom",
        });
      });
  }

  if (member === null) {
    return <Spinner />;
  }
  return (
    <Flex alignContent="center" justifyContent="center" alignItems="center">
      <Box>
        <Button onClick={test}>국어사전 테스트 버튼</Button>
      </Box>
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
        <Text
          mb="5"
          fontSize="20"
          ml="25%"
          mt={23}
          onClick={() => navigate("/postLike/list")}
        >
          내가 좋아요한 목록
        </Text>
      </Box>
      <Box ml="100" fontSize="25" mt="100">
        <Text mb="5">닉네임 : {member.nickName}</Text>
        <Text mb="5">성별 : {member.gender}</Text>
        <Text mb="5">이메일 : {member.email}</Text>
        <Text mb="5">생일 : {member.birth}</Text>
        <Text mb="5">주소 : {member.address}</Text>
        <Text mb="5">휴대폰 번호 : {member.phoneNumber}</Text>
        <Button colorScheme="teal" size="xs" ml="100%" onClick={onOpen}>
          탈퇴
        </Button>
        <Button
          colorScheme="teal"
          size="xs"
          ml="100%"
          onClick={() => navigate(`/member/edit`)}
        >
          수정
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>탈퇴 확인</ModalHeader>
            <ModalBody>
              <FormControl>
                <FormLabel>비밀번호를 입력 해주세요</FormLabel>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={isLoading}
                colorScheme={"red"}
                onClick={handleCLickDelete}
              >
                확인
              </Button>
              <Button onClick={onClose}>취소</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
}

export default MemberInfo;
