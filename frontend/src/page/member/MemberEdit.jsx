import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
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
  Stack,
  StackDivider,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { passwordPattern } from "../../Regex.jsx";

function MemberEdit(props) {
  const [member, setMember] = useState(null);
  const [profile, setProfile] = useState(null);
  const [oldProfile, setOldProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isCheckedNickName, setIsCheckedNickName] = useState(false);
  const [oldNickName, setOldNickName] = useState("");
  const account = useContext(LoginContext);
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isDisableSaveButton, setIsDisableSaveButton] = useState(true);

  const isValidPassword = (password) => passwordPattern.test(password);

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
        setOldProfile(res.data.profile);
        setProfile(res.data.profile);
        setOldNickName(member1.nickName);
      })
      .catch(() => {
        toast({
          status: "error",
          description: "회원 정보 조회 중 문제가 발생하였습니다.",
          position: "bottom",
        });
        navigate("/");
      });
  }, []);

  useEffect(() => {
    if (
      member &&
      (member.nickName !== oldNickName ||
        member.password !== "" ||
        profile.src !== oldProfile.src) &&
      (member.nickName === oldNickName || isCheckedNickName) &&
      (member.password === "" ||
        (isValidPassword(member.password) && member.password === passwordCheck))
    ) {
      setIsDisableSaveButton(false);
    } else {
      setIsDisableSaveButton(true);
    }
  }, [
    member,
    profile,
    oldNickName,
    oldProfile,
    isCheckedNickName,
    passwordCheck,
  ]);

  function handleClickSave() {
    axios
      .putForm(
        "/api/member/edit",
        {
          ...member,
          oldPassword,
          file,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => {
        toast({
          status: "success",
          description: "회원 정보가 수정되었습니다.",
          position: "bottom",
        });
        console.log("token", res.data.token);
        account.login(res.data.token);
        navigate(`/memberinfo`);
      })
      .catch(() => {
        toast({
          status: "error",
          description: "회원 정보가 수정되지 않았습니다.",
          position: "bottom",
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

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ src: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setProfile({ src: oldProfile.src });
    }
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
            position: "bottom",
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
            src={profile.src}
            w="200px"
            h="200px"
            mb={30}
          />
          <Box mb={7}>
            <FormControl>
              <FormLabel>프로필 사진 선택</FormLabel>
              <Input
                multiple
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <FormHelperText>
                총 용량은 10MB, 한 파일은 1MB를 초과할 수 없습니다.
              </FormHelperText>
            </FormControl>
          </Box>
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
                  isDisabled={
                    isCheckedNickName || member.nickName === oldNickName
                  }
                  size={"sm"}
                  onClick={handleCheckNickName}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormControl>
              <Card mt={10}>
                <CardHeader>
                  <Heading size="md">비밀번호 변경</Heading>
                </CardHeader>
                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    <Box>
                      <Heading size="xs" textTransform="uppercase" mb="2">
                        기존 비밀번호
                      </Heading>
                      <Input onChange={(e) => setOldPassword(e.target.value)} />
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase" mb="2">
                        새로운 비밀번호
                      </Heading>
                      <Input
                        onChange={(e) => {
                          const newPassword = e.target.value;
                          setMember({ ...member, password: newPassword });
                          setIsPasswordValid(isValidPassword(newPassword));
                        }}
                        placeholder={"암호를 변경하려면 입력하세요"}
                      />
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        mb="2"
                        mt="3"
                      >
                        새로운 비밀번호 확인
                      </Heading>
                      <Input
                        onChange={(e) => setPasswordCheck(e.target.value)}
                      />
                      {member.password === passwordCheck || (
                        <FormHelperText>
                          암호가 일치하지 않습니다.
                        </FormHelperText>
                      )}
                    </Box>
                    <Box></Box>
                  </Stack>
                </CardBody>
              </Card>
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
            <Button colorScheme="blue" onClick={handleClickSave}>
              확인
            </Button>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default MemberEdit;
