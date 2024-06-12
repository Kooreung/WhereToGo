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
  Select,
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

// 현재 연도를 가져와서 동적으로 배열에 추가하기
const generateYears = () => {
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let year = 1900; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
};

// 1~12월 배열에 추가하기
const generateMonths = () => {
  const months = [];
  for (let month = 1; month <= 12; month++) {
    months.push(month);
  }
  return months;
};

// 주어진 연도와 월을 이용해서 월의 마지막 날짜 구하기, 여기서 0은 월의 마지막 날짜를 구하기 위한 방법
const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

export function MemberSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [gender, setGender] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [daysInMonth, setDaysInMonth] = useState([]);
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

  // 연도, 월을 변경할 때마다 해당 월의 일 수를 계산
  useEffect(() => {
    if (birthYear && birthMonth) {
      const days = [];
      const daysInMonth = getDaysInMonth(birthYear, birthMonth);
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
      }
      setDaysInMonth(days);
    }
  }, [birthYear, birthMonth]);

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
        // 연도, 월, 일 세 개의 변수로 생년월일 형식으로 문자열 표현
        birth: `${birthYear}-${birthMonth.toString().padStart(2, "0")}-${birthDay.toString().padStart(2, "0")}`,
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
                  setEmail(e.target.value.trim());
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
                setPassword(e.target.value.trim());
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
            <Input
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>닉네임</FormLabel>
            <InputGroup>
              <Input
                value={nickName}
                onChange={(e) => setNickName(e.target.value.trim())}
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
              <Radio value="남자">남자</Radio>
              <Radio value="여자">여자</Radio>
            </RadioGroup>
          </FormControl>
        </Box>
        {/* 생년월일 form 변경, 유효성 판단 */}
        {/* ***************현재보다 뒤인 생년월일 사용불가하도록 짜기*************** 아직 안했음 */}
        <Box>
          <FormControl>
            <FormLabel>생년월일</FormLabel>
            <Box display="flex" justifyContent="space-between">
              <Select
                placeholder="출생 연도"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                maxW="30%"
              >
                {generateYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="월"
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                maxW="30%"
              >
                {generateMonths().map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="일"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                maxW="30%"
              >
                {daysInMonth.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </Select>
            </Box>
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>전화번호</FormLabel>
            <Input
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value.trim());
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
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value.trim())}
            />
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
