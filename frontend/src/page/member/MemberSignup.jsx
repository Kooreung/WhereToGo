import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  Radio,
  RadioGroup,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

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
  const [isCheckEmail, setIsCheckEmail] = useState(false);
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
  const [isCheckNickName, setIsCheckNickName] = useState(false);
  const [isNickNameDuplicate, setIsNickNameDuplicate] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (email) {
        axios
          .get(`/api/member/check?email=${email}`)
          .then(() => {
            setIsEmailDuplicate(true);
            setIsCheckEmail(false);
          })
          .catch((err) => {
            if (err.response.status === 404) {
              setIsCheckEmail(true);
              setIsEmailDuplicate(false);
            }
          });
      }

      if (nickName) {
        axios
          .get(`/api/member/check?nickName=${nickName}`)
          .then(() => {
            setIsNickNameDuplicate(true);
            setIsCheckNickName(false);
          })
          .catch((err) => {
            if (err.response.status === 404) {
              setIsCheckNickName(true);
              setIsNickNameDuplicate(false);
            }
          });
      }
    }, 500); // 500ms 디바운싱 // 나중에 100~150정도로 바꿀 예정

    return () => clearTimeout(timer);
  }, [email, nickName]);

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
      .then(() => {
        toast({
          description: "회원가입이 성공적으로 완료되었습니다.",
          status: "success",
          position: "top",
        });
      })
      .catch(() => {
        toast({
          description: "입력값을 확인해 주세요.",
          status: "error",
          position: "top",
        });
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <Box>
      <Box>회원 가입</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <InputGroup>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </InputGroup>
            {isEmailDuplicate && (
              <FormHelperText color="red">
                이메일이 중복되었습니다.
              </FormHelperText>
            )}
            {!isEmailDuplicate && isCheckEmail && (
              <FormHelperText color="green">
                사용 가능한 이메일입니다.
              </FormHelperText>
            )}
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
            <InputGroup>
              <Input
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
              />
            </InputGroup>
            {isNickNameDuplicate && (
              <FormHelperText color="red">
                닉네임이 중복되었습니다.
              </FormHelperText>
            )}
            {!isNickNameDuplicate && isCheckNickName && (
              <FormHelperText color="green">
                사용 가능한 닉네임입니다.
              </FormHelperText>
            )}
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
