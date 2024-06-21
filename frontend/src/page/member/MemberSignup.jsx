import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  emailPattern,
  passwordPattern,
  phoneNumberPattern,
} from "../../Regex.jsx";
import DaumPostcodeEmbed from "react-daum-postcode";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import Lobby from "../Lobby.jsx";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function MemberSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
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
  const [file, setFiles] = useState(null);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const account = useContext(LoginContext);

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

  // 다음 주소 api 사용
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setAddress(fullAddress);

    onClose();
  };

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
        position: "bottom",
      });
      return;
    }

    setIsLoading(true);

    axios
      .postForm("/api/member/signup", {
        email,
        password,
        name,
        nickName,
        gender,
        // 연도, 월, 일 세 개의 변수로 생년월일 형식으로 문자열 표현
        birth: `${birthYear}-${birthMonth.toString().padStart(2, "0")}-${birthDay.toString().padStart(2, "0")}`,
        phoneNumber,
        address,
        file,
      })
      .then(() => {
        toast({
          description: "회원가입이 완료되었습니다.",
          status: "success",
          position: "bottom",
        });
        navigate("/login");
      })
      .catch(() => {
        toast({
          description: "입력값을 확인해 주세요.",
          status: "error",
          position: "bottom",
        });
      })
      .finally(() => setIsLoading(false));
  }

  // 비밀번호 일치하는지?
  const isCheckedPassword = password === passwordCheck;

  // 버튼 활성화 여부 결정
  let isDisabled = false;

  // 비밀번호 일치 여부에 따라 버튼 비활성화
  if (!isCheckedPassword) {
    isDisabled = true;
  }

  // 하나라도 공백일 경우 비활성화
  if (
    !(
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      name.trim().length > 0 &&
      nickName.trim().length > 0 &&
      gender.length > 0 &&
      birthYear &&
      birthMonth &&
      birthDay &&
      phoneNumber.trim().length > 0 &&
      address.trim().length > 0
    )
  ) {
    isDisabled = true;
  }

  // 이메일, 비밀번호, 전화번호 정규식 패턴에 따라 버튼 비활성화
  if (!isEmailValid || !isPasswordValid || !isPhoneNumberValid) {
    isDisabled = true;
  }

  // 이메일, 닉네임 중복에 따라 버튼 비활성화
  if (isEmailDuplicate || isNickNameDuplicate) {
    isDisabled = true;
  }

  if (account.isLoggedIn()) {
    return (
      <Box>
        <Lobby />;
      </Box>
    );
  }

  return (
    <Center>
      <Box w={500}>
        <Box>
          <Heading>회원 가입</Heading>
        </Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>파일</FormLabel>
            <Input
              multiple
              type="file"
              accept="image/*"
              onChange={(e) => setFiles(e.target.files[0])}
            />
            <FormHelperText>
              총 용량은 10MB, 한 파일은 1MB를 초과할 수 없습니다.
            </FormHelperText>
          </FormControl>
        </Box>
        <Box>
          <Box>
            <FormControl>
              <FormLabel>이메일</FormLabel>
              <Input
                maxLength="25"
                placeholder="project@naver.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value.trim());
                  setIsEmailValid(isValidEmail(e.target.value));
                }}
              />
              {!isEmailValid && (
                <FormHelperText color="red">
                  유효한 이메일 주소를 입력해주세요.
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
                maxLength="50"
                placeholder="최소 8자 이상(알파벳, 숫자 필수)"
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
              <FormLabel>비밀번호 확인</FormLabel>
              <Input
                maxLength="50"
                placeholder="비밀번호를 한번 더 입력해 주세요."
                type="password"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value.trim())}
              />
              {isCheckedPassword || (
                <FormHelperText color="red">
                  비밀번호가 일치하지 않습니다.
                </FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>이름</FormLabel>
              <Input
                maxLength="30"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value.trim())}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>닉네임</FormLabel>
              <Input
                maxLength="20"
                placeholder="별명"
                value={nickName}
                onChange={(e) => setNickName(e.target.value.trim())}
              />
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
                maxLength="30"
                placeholder="숫자만 입력해 주세요."
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
              <InputGroup>
                <Input
                  maxLength="100"
                  placeholder="주소를 검색하거나 직접 입력해 주세요."
                  value={address}
                  onChange={(e) => setAddress(e.target.value.trim())}
                />
                <InputRightElement w={"75px"} mr={1}>
                  <Button onClick={onOpen}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    검색
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                주소 입력
                <Button onClick={onClose}>✖</Button>
              </ModalHeader>
              <ModalBody>
                <DaumPostcodeEmbed onComplete={handleComplete} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
        <Box>
          <Button
            w={500}
            onClick={handleClick}
            isLoading={isLoading}
            isDisabled={isDisabled}
          >
            회원가입
          </Button>
        </Box>
        <Box>
          이미 회원이신가요? &nbsp;
          <Link
            to="/login"
            style={{ textDecoration: "underline", color: "dodgerblue" }}
          >
            로그인
          </Link>
        </Box>
      </Box>
    </Center>
  );
}
