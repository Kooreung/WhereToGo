import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  FormControl,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

export function MemberFindPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const toast = useToast();
  const { onClose, onOpen, isOpen } = useDisclosure();

  function handleFindPassword() {
    axios
      .post("/api/member/sendEmail", { email })
      .then(() => {
        toast({
          status: "success",
          description: "임시 비밀번호가 발급되었습니다.",
          position: "bottom",
        });
      })
      .catch(() => {
        toast({
          status: "error",
          description: "해당 이메일이 존재하지 않습니다.",
          position: "bottom",
        });
      });
  }

  function handleCode() {
    axios
      .post("/api/member/sendCode", { email })
      .then((response) => {
        setCode(response.data.toString()); // code를 문자열로 변환하여 저장
        setIsCodeValid(false); // 인증 코드가 발송되면 isCodeValid를 false로 설정
        toast({
          status: "success",
          description: "인증 코드가 발송되었습니다.",
          position: "bottom",
        });
        onOpen(); // 모달 열기는 이메일이 정상적으로 처리된 후에만 실행
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          toast({
            status: "error",
            description: "해당 이메일이 존재하지 않습니다.",
            position: "bottom",
          });
        } else {
          toast({
            status: "error",
            description: "서버 오류가 발생했습니다.",
            position: "bottom",
          });
        }
      });
  }

  function handleVerifyCode() {
    if (inputCode === code) {
      setIsCodeValid(true);
      toast({
        status: "success",
        description: "인증 코드가 확인되었습니다.",
        position: "bottom",
      });
    } else {
      setIsCodeValid(false);
      toast({
        status: "error",
        description: "인증 코드가 잘못되었습니다.",
        position: "bottom",
      });
    }
  }

  return (
    <Center>
      <Box w={500}>
        <Box>
          <Box>
            <Heading>비밀번호 찾기</Heading>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>이메일</FormLabel>
              <Input onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
          </Box>
          <Button onClick={handleCode}>인증코드 보내기</Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                인증하기
                <Button onClick={onClose}>✖</Button>
              </ModalHeader>
              <ModalBody>
                <InputGroup>
                  <Input
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                  />
                  <InputRightElement w={"75px"} mr={1}>
                    <Button onClick={handleVerifyCode}>인증</Button>
                  </InputRightElement>
                </InputGroup>
              </ModalBody>
              <ModalFooter>
                {isCodeValid && (
                  <Button onClick={handleFindPassword}>
                    임시 비밀번호 발급
                  </Button>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </Center>
  );
}
