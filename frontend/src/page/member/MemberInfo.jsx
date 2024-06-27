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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import Lobby from "../Lobby.jsx";
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
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/member/memberinfo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
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
    <Card maxW="md" mb={20} boxShadow={"2xl"}>
      {account.isAdmin() && (
        <Center>
          <FontAwesomeIcon
            size={"2xl"}
            icon={faCrown}
            style={{ color: "#FFD43B" }}
          />
        </Center>
      )}
      {account.isAdmin() || (
        <Center>
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
        <Box style={{ display: "flex", alignItems: "center" }}>
          <FontAwesomeIcon
            icon={faHeart}
            onClick={() => navigate("/postLike/list")}
            cursor="pointer"
            size="lg"
            style={{ color: "#D8B7E5", marginRight: "8px" }}
          />
          Like
        </Box>
        <ButtonGroup spacing="2">
          <Button
            size={"sm"}
            variant="solid"
            colorScheme="blue"
            onClick={() => navigate(`/member/edit`)}
          >
            수정
          </Button>
          <Button
            size={"sm"}
            variant="solid"
            colorScheme="red"
            ml="100%"
            onClick={onOpen}
          >
            탈퇴
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
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
                <Button onClick={onClose}>취소</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

export default MemberInfo;
