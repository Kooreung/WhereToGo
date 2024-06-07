import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export function MemberSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleClick() {
    setIsLoading(true);

    axios
      .post("/api/member/signup", {
        email,
        password,
        name,
        nickName,
        gender,
        birth,
        phoneNumber,
        address,
      })
      .then(() => {})
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }

  return (
    <Box>
      <Box>회원 가입</Box>
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
            <Input onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>이름</FormLabel>
            <Input onChange={(e) => setName(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>닉네임</FormLabel>
            <Input onChange={(e) => setNickName(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>성별</FormLabel>
            <RadioGroup value={gender} onChange={(e) => setGender(e)}>
              <Radio value="남성">남성</Radio>
              <Radio value="여성">여성</Radio>
            </RadioGroup>
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>생년월일</FormLabel>
            <Input type="date" onChange={(e) => setBirth(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>전화번호</FormLabel>
            <Input onChange={(e) => setPhoneNumber(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>주소</FormLabel>
            <Input onChange={(e) => setAddress(e.target.value)} />
          </FormControl>
        </Box>
      </Box>
      <Box>
        <Button onClick={handleClick} isLoading={isLoading}>
          회원가입
        </Button>
      </Box>
    </Box>
  );
}
