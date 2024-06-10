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
import {
  emailPattern,
  passwordPattern,
  phoneNumberPattern,
} from "../../Regex.jsx";

const isValidEmail = (email) => emailPattern.test(email);
const isValidPassword = (password) => passwordPattern.test(password);
const isValidPhoneNumber = (phoneNumber) =>
  phoneNumberPattern.test(phoneNumber);

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
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (email && isValidEmail(email)) {
        setIsEmailValid(true);
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
      } else if (email) {
        setIsEmailValid(false);
        setIsCheckEmail(false);
        setIsEmailDuplicate(false);
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
    }, 500); // 500ms 디바운싱

    return () => clearTimeout(timer);
  }, [email, nickName]);

  function handleClick() {
    setIsEmailValid(isValidEmail(email));
    setIsPasswordValid(isValidPassword(password));
    setIsPhoneNumberValid(isValidPhoneNumber(phoneNumber));

    if (
      !isValidEmail(email) ||
      !isValidPassword(password) ||
      !isValidPhoneNumber(phoneNumber) ||
      isEmailDuplicate ||
      isNickNameDuplicate
    ) {
      toast({
        description: "입력값을 확인해 주세요.",
        status: "error",
        position: "top",
      });
      return;
    }

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
          description: "회원가입이 완료되었습니다.",
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
              <Input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsEmailValid(isValidEmail(e.target.value));
                }}
              />
            </InputGroup>
            {!isEmailValid && (
              <FormHelperText color="red">
                올바른 이메일 형식이 아닙니다.
              </FormHelperText>
            )}
            {isEmailDuplicate && (
              <FormHelperText color="red">
                사용할 수 없는 이메일입니다. 다른 이메일을 입력해 주세요.
              </FormHelperText>
            )}
            {!isEmailDuplicate && isCheckEmail && isEmailValid && (
              <FormHelperText color="green">
                사용 가능한 이메일입니다.
              </FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>비밀번호</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsPasswordValid(isValidPassword(e.target.value));
              }}
            />
            {!isPasswordValid && (
              <FormHelperText color="red">
                비밀번호는 8-20자 사이의 영문자와 숫자를 포함해야 합니다.
              </FormHelperText>
            )}
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
                사용할 수 없는 닉네임입니다. 다른 닉네임을 입력해 주세요.
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
            <Input
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setIsPhoneNumberValid(isValidPhoneNumber(e.target.value));
              }}
            />
            {!isPhoneNumberValid && (
              <FormHelperText color="red">
                올바른 전화번호 형식이 아닙니다.
              </FormHelperText>
            )}
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
