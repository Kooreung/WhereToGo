import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../components/ui/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Lobby from "../lobby/Lobby.jsx";
import { getInputStyles } from "/src/styles/styles.js";
import HeadingVariant from "../../components/ui/Heading/HeadingVariant.jsx";

export function MemberLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAndPassword, setShowAndPassword] = useState(false);
  const toast = useToast();
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  const inputStyles = getInputStyles();

  function handleLogin() {
    axios
      .post("/api/member/login", { email, password })
      .then((res) => {
        // localStorage 에 토큰 정보 저장
        account.login(res.data);
        toast({
          status: "success",
          description: "로그인 되었습니다.",
          position: "bottom",
        });
        navigate("/");
      })
      .catch(() => {
        // localStorage 에서 토큰 정보 삭제
        account.logout();
        toast({
          status: "error",
          description: "이메일과 패스워드를 확인해주세요.",
          position: "bottom",
        });
      })
      .finally(() => {});
  }

  if (account.isLoggedIn()) {
    return (
      <Box>
        <Lobby />;
      </Box>
    );
  }

  function handleSubmitKeyDown(e) {
    if (e.key === "Enter") {
      handleLogin();
    }
  }

  return (
    <Center>
      <Box w={500}>
        <Center mb={10}>
          <HeadingVariant variant={"large"}>로그인</HeadingVariant>
        </Center>
        <Box>
          <Box>
            <FormControl>
              <FormLabel>이메일</FormLabel>
              <Input
                style={inputStyles}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel mt={6}>비밀번호</FormLabel>
              <InputGroup onKeyDown={handleSubmitKeyDown}>
                <Input
                  style={inputStyles}
                  type={showAndPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement
                  h="48px"
                  cursor="pointer"
                  onClick={() => setShowAndPassword(!showAndPassword)}
                >
                  <FontAwesomeIcon
                    icon={showAndPassword ? faEyeSlash : faEye}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
          <Box mb={6} mt={6} style={{ textAlign: "right" }}>
            <Link
              to="/findPassword"
              style={{ textDecoration: "underline", color: "dodgerblue" }}
            >
              비밀번호 찾기
            </Link>
          </Box>
          <Box mb={6}>
            <Button h={12} w={500} onClick={handleLogin}>
              로그인
            </Button>
          </Box>
          <Center>
            아직 회원이 아니신가요? &nbsp;
            <Link
              to="/signup"
              style={{ textDecoration: "underline", color: "dodgerblue" }}
            >
              회원가입
            </Link>
          </Center>
        </Box>
      </Box>
    </Center>
  );
}
