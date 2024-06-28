import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { passwordPattern } from "../../Regex.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { getInputStyles } from "/src/css/styles.js";
import HeadingVariant from "../../css/Heading/HeadingVariant.jsx";

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
  const inputStyles = getInputStyles();

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
          passwordCheck,
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
    <Box>
      <Center mb={30}>
        <HeadingVariant variant={"large"} align={"start"}>
          프로필 수정
        </HeadingVariant>
      </Center>
      <Card w={420} mb={20} boxShadow={"2xl"}>
        {account.isAdmin() && (
          <Center mt={5}>
            <FontAwesomeIcon
              size={"2xl"}
              icon={faCrown}
              style={{ color: "#FFD43B" }}
            />
          </Center>
        )}
        {account.isAdmin() || (
          <Center mt={5}>
            <FontAwesomeIcon
              size={"2xl"}
              icon={faCrown}
              style={{ color: "#D8B7E5" }}
            />
          </Center>
        )}
        <CardBody>
          <label>
            <Center>
              <Avatar
                _hover={{ filter: "brightness(0.7)" }}
                cursor={"pointer"}
                name="defaultProfile"
                src={profile.src}
                w="250px"
                h="250px"
                mb={3}
              />
            </Center>
            <Input
              display={"none"}
              multiple
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>

          <Stack mt="6" spacing="3">
            <Center>
              <Heading size="md" mb={7}>
                {member.nickName}
              </Heading>
            </Center>
            <HeadingVariant>닉네임 변경</HeadingVariant>
            <Box>
              <FormControl mt={3}>닉네임</FormControl>
            </Box>
            <InputGroup>
              <Input
                style={inputStyles}
                onChange={(e) => {
                  const newNickName = e.target.value.trim();
                  setMember({ ...member, nickName: newNickName });
                  setIsCheckedNickName(newNickName === oldNickName);
                }}
                value={member.nickName}
              />
              <InputRightElement w={"75px"} mr={1}>
                <Button
                  mt={2}
                  isDisabled={
                    isCheckedNickName || member.nickName === oldNickName
                  }
                  onClick={handleCheckNickName}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormControl mt={6}>
              <HeadingVariant>비밀번호 변경</HeadingVariant>
              <Box>
                <FormControl mt={6} mb={3}>
                  기존 비밀번호
                </FormControl>
                <Input
                  style={inputStyles}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder={"암호를 변경하려면 입력하세요"}
                />
              </Box>
              <Box>
                <FormControl mt={6} mb={3}>
                  새로운 비밀번호
                </FormControl>
                <Input
                  style={inputStyles}
                  onChange={(e) => {
                    const newPassword = e.target.value;
                    setMember({ ...member, password: newPassword });
                    setIsPasswordValid(isValidPassword(newPassword));
                  }}
                />
                {!isPasswordValid && (
                  <FormHelperText>
                    비밀번호는 8-20자 사이의 영문자와 숫자를 포함해야 합니다.
                  </FormHelperText>
                )}
                <FormControl mt={6} mb={3}>
                  새로운 비밀번호 확인
                </FormControl>
                <Input
                  style={inputStyles}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                />
                {member.password === passwordCheck || (
                  <FormHelperText>암호가 일치하지 않습니다.</FormHelperText>
                )}
              </Box>
            </FormControl>
          </Stack>
        </CardBody>
        <CardFooter display="flex" justifyContent="flex-end">
          <ButtonGroup spacing="2">
            <Button
              isDisabled={isDisableSaveButton}
              onClick={onOpen}
              colorScheme={"blue"}
              size={"sm"}
            >
              저장
            </Button>
            <Button
              colorScheme={"blue"}
              size={"sm"}
              onClick={() => navigate("/memberinfo")}
            >
              취소
            </Button>
          </ButtonGroup>
        </CardFooter>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>프로필 수정</ModalHeader>
            <ModalBody>확인을 누르시면 수정이 완료됩니다.</ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleClickSave}>
                확인
              </Button>
              <Button onClick={onClose}>취소</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    </Box>
  );
}

export default MemberEdit;
