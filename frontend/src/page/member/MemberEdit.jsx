import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function MemberEdit(props) {
  const [member, setMember] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isCheckedNickName, setIsCheckedNickName] = useState(true);
  const [oldNickName, setOldNickName] = useState("");
  // const account = useContext(LoginContext);
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  useEffect(() => {
    axios
      .get(`/api/member/memberinfo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const member1 = res.data.member;
        setMember({ ...member1, password: "" });
        setOldNickName(member1.nickName);
      })
      .catch(() => {
        toast({
          status: "warning",
          description: "회원 정보 조회 중 문제가 발생하였습니다.",
          position: "top",
        });
        navigate("/");
      });
  }, []);

  function handleClickSave() {
    axios
      .put("/api/member/edit", { ...member, oldPassword })
      .then((res) => {
        toast({
          status: "success",
          description: "회원 정보가 수정되었습니다.",
          position: "top",
        });
        account.login(res.data.token);
        navigate(`/member/${id}`);
      })
      .catch(() => {
        toast({
          status: "error",
          description: "회원 정보가 수정되지 않았습니다.",
          position: "top",
        });
      })
      .finally(() => {
        onClose();
        setOldPassword("");
      });
  }
  if (member === null) {
    return <Spinner />;
  }

  let isDisableNickNameCheckButton = false;

  if (member.nickName === oldNickName) {
    isDisableNickNameCheckButton = true;
  }

  if (member.nickName.length == 0) {
    isDisableNickNameCheckButton = true;
  }

  if (isCheckedNickName) {
    isDisableNickNameCheckButton = true;
  }

  let isDisableSaveButton = false;

  if (member.password !== passwordCheck) {
    isDisableSaveButton = true;
  }

  if (member.nickName.trim().length === 0) {
    isDisableSaveButton = true;
  }

  if (!isCheckedNickName) {
    isDisableSaveButton = true;
  }

  function handleCheckNickName() {
    axios
      .get(`/api/member/check?nickName=${member.nickName}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "사용할 수 없는 별명입니다.",
          position: "top",
        });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "사용할 수 있는 별명입니다.",
            position: "top",
          });
          setIsCheckedNickName(true);
        }
      })
      .finally();
  }

  return (
    <Flex justify="center" h="100vh">
      <Box>
        <Box>
          <Avatar
            name="defaultProfile"
            src="https://study9990924.s3.ap-northeast-2.amazonaws.com/prj2/15/Desktop Wallpaper Full HD Laptop Backgrounds Creation.jpeg"
            w="200px" // 원하는 너비 값으로 조정
            h="200px" // 원하는 높이 값으로 조정
            mb={30}
          />
          <Box>
            <FormControl>별명</FormControl>
            <InputGroup>
              <Input
                onChange={(e) => {
                  const newNickName = e.target.value.trim();
                  setMember({ ...member, nickName: newNickName });
                  setIsCheckedNickName(newNickName === oldNickName);
                }}
                value={member.nickName}
              />
              <InputRightElement w={"75px"} mr={1}>
                <Button
                  isDisabled={isDisableNickNameCheckButton}
                  size={"sm"}
                  onClick={handleCheckNickName}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormControl>
              <FormLabel>기존 비밀번호</FormLabel>
              <Input onChange={(e) => setOldPassword(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>새로운 비밀번호</FormLabel>
              <Input
                onChange={(e) =>
                  setMember({ ...member, password: e.target.value })
                }
                placeholder={"암호를 변경하려면 입력하세요"}
              />
              <FormHelperText>
                입력하지 않으면 기존 암호를 변경하지 않습니다.
              </FormHelperText>
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>새로운 비밀번호 확인</FormLabel>
              <Input onChange={(e) => setPasswordCheck(e.target.value)} />
              {member.password === passwordCheck || (
                <FormHelperText>암호가 일치하지 않습니다.</FormHelperText>
              )}
            </FormControl>
          </Box>
        </Box>
      </Box>
      <Button
        isDisabled={isDisableSaveButton}
        onClick={onOpen}
        colorScheme={"blue"}
      >
        저장
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>기존 암호 확인</ModalHeader>
          <ModalBody>수정하시겠습니까</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button colorScheme="blue" onClick={handleClickSave}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default MemberEdit;
