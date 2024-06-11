import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function MemberLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const account = useContext(LoginContext);

  function handleLogin() {
    axios
      .post("/api/member/login", { email, password })
      .then((res) => {
        // localStorage 에 토큰 정보 저장
        account.login(res.data.token);
        toast({
          status: "success",
          description: "로그인 되었습니다.",
          position: "top",
        });
      })
      .catch(() => {
        // localStorage 에서 토큰 정보 삭제
        account.logout();
        toast({
          status: "warning",
          description: "이메일과 패스워드를 확인해주세요.",
          position: "top",
        });
      })
      .finally(() => {});
  }

  return (
    <Box>
      <Box>로그인</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>비밀번호</FormLabel>
            <Input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box>
          <Button onClick={handleLogin}>로그인</Button>
        </Box>
      </Box>
    </Box>
  );
}
