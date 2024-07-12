import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../components/ui/LoginProvider.jsx";
import Lobby from "../lobby/Lobby.jsx";
import {
  faCrown,
  faHeart,
  faLocationDot,
  faPhone,
  faSquareEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function MemberInfo(props) {
  const [member, setMember] = useState({});
  const [file, setFile] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isCertifyOpen,
    onOpen: onCertifyOpen,
    onClose: onCertifyClose,
  } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/member/memberinfo`)
      .then((res) => {
        setMember(res.data.member);
        setFile(res.data.profile);
        setId(res.data.member.memberId);
        console.log(res.data.profile);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: "존재하지 않는 회원입니다.",
            position: "bottom",
          });
          navigate("/");
        } else if (err.response.status === 403) {
          toast({
            status: "error",
            description: "권한이 없습니다.",
            position: "bottom",
          });
          navigate(-1);
        }
      });
  }, []);

  function handleCLickDelete() {
    console.log(id);
    axios
      .delete(`/api/member/delete`, {
        data: { memberId: id, password },
      })
      .then(() => {
        toast({
          status: "success",
          description: "회원 탈퇴하였습니다.",
          position: "bottom",
        });
        account.logout();
        navigate("/");
      })
      .catch(() => {
        toast({
          status: "error",
          description: "탈퇴중 문제가 생겼습니다.",
          position: "bottom",
        });
      });
  }

  function handleCertify() {
    console.log(member);
    axios
      .post("/api/member/certify", member)
      .then(() => {
        toast({
          status: "success",
          description: "이메일을 확인하여 인증을 진행해 주세요.",
          position: "bottom",
        });
        onCertifyClose();
      })
      .catch(() => {
        toast({
          status: "error",
          description: "이메일 전송에 실패했습니다.",
          position: "bottom",
        });
      });
  }

  if (!account.isLoggedIn()) {
    return (
      <Box>
        <Lobby />;
      </Box>
    );
  }

  if (member === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Card w={420} mb={7} boxShadow={"2xl"}>
        {account.isAdmin() && (
          <Center mt={5}>
            <FontAwesomeIcon
              size={"2xl"}
              icon={faCrown}
              style={{ color: "#FFD43B" }}
            />
          </Center>
        )}
        {account.isAdmin() || (
          <Center mt={5}>
            <FontAwesomeIcon
              size={"2xl"}
              icon={faCrown}
              style={{ color: "#D8B7E5" }}
            />
          </Center>
        )}
        <CardBody>
          <label>
            <Center>
              <Avatar
                _hover={{ filter: "brightness(0.7)" }}
                src={file.src}
                w="250px"
                h="250px"
                cursor="pointer"
                mb={3}
              />
            </Center>
            <Button
              style={{ display: "none" }}
              onClick={() => navigate(`/member/edit`)}
            ></Button>
          </label>
          <Stack mt="6" spacing="3">
            <Center>
              <Heading size="md" mb={7}>
                {member.nickName}
              </Heading>
            </Center>
            <Box mb={2}>
              <FontAwesomeIcon
                icon={faSquareEnvelope}
                style={{ color: "#D8B7E5" }}
              />{" "}
              {member.email}
            </Box>
            <Box mb={2}>
              <FontAwesomeIcon
                icon={faLocationDot}
                style={{ color: "#D8B7E5" }}
              />{" "}
              {member.address}
            </Box>
            <Box mb={2}>
              <FontAwesomeIcon icon={faPhone} style={{ color: "#D8B7E5" }} />{" "}
              {member.phoneNumber}
            </Box>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter display="flex" justifyContent="space-between">
          <Box
            cursor={"pointer"}
            onClick={() => navigate(`/member/${member.memberId}`)}
            style={{ display: "flex", alignItems: "center" }}
          >
            <FontAwesomeIcon
              icon={faHeart}
              size="lg"
              style={{ color: "#D8B7E5", marginRight: "8px" }}
            />
            <Text>활동 내역</Text>
          </Box>
          <ButtonGroup>
            <Button
              onClick={() => navigate(`/member/edit`)}
              color={"black.alpha.900"}
            >
              수정
            </Button>
            <Button onClick={onDeleteOpen} color={"black.alpha.900"}>
              탈퇴
            </Button>
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>탈퇴 확인</ModalHeader>
                <ModalBody>
                  <FormControl>
                    <FormLabel>비밀번호를 입력해 주세요.</FormLabel>
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button
                    isLoading={isLoading}
                    colorScheme={"red"}
                    onClick={handleCLickDelete}
                  >
                    확인
                  </Button>
                  <Button onClick={onDeleteClose}>취소</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </ButtonGroup>
        </CardFooter>
      </Card>
      <Text
        onClick={onCertifyOpen}
        cursor={"pointer"}
        style={{
          textDecoration: "underline",
          color: "dodgerblue",
          textAlign: "right",
        }}
      >
        이메일로 본인인증 하기
        <Modal isOpen={isCertifyOpen} onClose={onCertifyClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>2차 인증</ModalHeader>
            <ModalBody>
              <FormControl>
                <FormLabel>2차 인증을 위한 이메일을 보내시겠습니까?</FormLabel>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={isLoading}
                colorScheme={"red"}
                onClick={handleCertify}
              >
                확인
              </Button>
              <Button onClick={onCertifyClose}>취소</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Text>
    </Box>
  );
}

export default MemberInfo;
