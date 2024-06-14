import React, { useContext, useEffect, useState } from "react";
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
import { LoginContext } from "../../component/LoginProvider.jsx";

function MemberEdit(props) {
  const [member, setMember] = useState(null);
  const [profile, setProfile] = useState(null);
  const [oldProfile, setOldProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isCheckedNickName, setIsCheckedNickName] = useState(true);
  const [oldNickName, setOldNickName] = useState("");
  const account = useContext(LoginContext);
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
        console.log("member", member);
        console.log("member1", member1);
        setMember({ ...member1, password: "" });
        setOldProfile(res.data.profile);
        setProfile(res.data.profile);
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
          position: "top",
        });
        console.log("token", res.data.token);
        account.login(res.data.token);
        navigate(`/memberinfo`);
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
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      // 파일이 선택되었는지 확인
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ src: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      // 파일 선택이 취소되었을 때
      setProfile({ src: oldProfile.src }); // 원래 사진으로 되돌림
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
            src={profile.src}
            w="200px" // 원하는 너비 값으로 조정
            h="200px" // 원하는 높이 값으로 조정
            mb={30}
          />
          <Box mb={7}>
            <FormControl>
              <FormLabel>프로필 사진 선택</FormLabel>
              {/* TODO 수정 시 사진 적용 안됨 */}
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
              {/* TODO 비밀번호 수정 로직 가입 할 때랑 동일하게 설정 필요 */}
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
