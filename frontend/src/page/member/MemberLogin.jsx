import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export function MemberLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const account = useContext(LoginContext);
  const [showAndPassword, setShowAndPassword] = useState(false);

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
            <InputGroup>
              <Input
                type={showAndPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement
                cursor="pointer"
                onClick={() => setShowAndPassword(!showAndPassword)}
              >
                <FontAwesomeIcon icon={showAndPassword ? faEyeSlash : faEye} />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </Box>
        <Box>
          <Button onClick={handleLogin}>로그인</Button>
        </Box>
      </Box>
    </Box>
  );
}
