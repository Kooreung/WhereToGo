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
  useToast,
} from "@chakra-ui/react";

export function MemberFindPassword() {
  const [email, setEmail] = useState("");
  const toast = useToast();

  function handleFindPassword() {
    axios
      .post("/api/member/sendEmail", { email })
      .then(() => {
        toast({
          status: "success",
          description: "임시 비밀번호가 발급되었습니다.",
          position: "top",
        });
      })
      .catch(() => {
        toast({
          status: "warning",
          description: "해당 이메일이 존재하지 않습니다.",
          position: "top",
        });
      })
      .finally(() => {});
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
          <Button onClick={handleFindPassword}>임시 비밀번호 발급</Button>
        </Box>
      </Box>
    </Center>
  );
}
