import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Switch,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faMagnifyingGlass,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Lobby from "../Lobby.jsx";
import { LoginContext } from "../../component/LoginProvider.jsx";
import ContentParser from "../../component/ContentParser.jsx";

import ButtonOutline from "../../css/Button/ButtonOutline.jsx";
import ButtonCircle from "../../css/Button/ButtonCircle.jsx";
import { ChevronDownIcon } from "@chakra-ui/icons";
import HeadingVariant from "../../css/Heading/HeadingVariant.jsx";

export function MemberAdminPage() {
  const [memberList, setMemberList] = useState([]);
  const [withdrawnList, setWithdrawnList] = useState([]);
  const [mdPicks, setMdPicks] = useState([]);
  const [mdPosts, setMdPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const account = useContext(LoginContext);
  const [toggleState, setToggleState] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const toast = useToast();
  const [memberId, setMemberId] = useState("");

  //배너 변수
  const [bannerList, setBannerList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bannerLink, setBannerLink] = useState(import.meta.env.VITE_KEY_WORD);
  const [bannerFile, setBannerFile] = useState([]);
  const [city, setCity] = useState("");
  const hColor = useColorModeValue(
    "rgba(216, 183, 229, 0.2)",
    "rgba(131, 96, 145, 0.2)",
  );
  const [visiblePosts, setVisiblePosts] = useState(3);
  const itemsPerRow = useBreakpointValue({ base: 1, md: 4, lg: 3 });

  const {
    isOpen: isModalOpenOfAdd,
    onOpen: onModalOpenOfAdd,
    onClose: onModalCloseOfAdd,
  } = useDisclosure();

  const [selectedPosts, setSelectedPosts] = useState([]);

  const {
    isOpen: isSoftDeleteAccountModalOpen,
    onOpen: onSoftDeleteAccountModalOpen,
    onClose: onSoftDeleteAccountModalClose,
  } = useDisclosure();

  const {
    isOpen: isHardDeleteAccountModalOpen,
    onOpen: onHardDeleteAccountModalOpen,
    onClose: onHardDeleteAccountModalClose,
  } = useDisclosure();

  const {
    isOpen: isMdPostModalOpen,
    onOpen: onMdPostModalOpen,
    onClose: onMdPostModalClose,
  } = useDisclosure();

  const [deletePostId, setDeletePostId] = useState(null);

  const {
    isOpen: isBannerModalOpen,
    onOpen: onBannerModalOpen,
    onClose: onBannerModalClose,
  } = useDisclosure();

  const [selectedMemberId, setSelectedMemberId] = useState(null);

  // 삭제하려는 사용자의 ID를 설정하고 모달을 열기 위한 함수
  const softDelete = (memberId) => {
    setSelectedMemberId(memberId); // 선택된 사용자의 ID를 상태에 저장
    onSoftDeleteAccountModalOpen(); // 모달을 엽니다.
  };

  const hardDelete = (memberId) => {
    setSelectedMemberId(memberId); // 선택된 사용자의 ID를 상태에 저장
    onHardDeleteAccountModalOpen(); // 모달을 엽니다.
  };

  function authTypeChange(authType, memberId) {
    // memberId를 인자로 받아 사용합니다.
    axios
      .put(`/api/member/auth/${memberId}?authType=${authType}`)
      .then((response) => {
        // 성공적인 응답 처리
        console.log(response.data);
        setMemberList((currentMembers) =>
          currentMembers.map((member) => {
            if (member.memberId === memberId) {
              return { ...member, authType: authType };
            }
            return member;
          }),
        );
      })
      .catch((error) => {
        // 오류 처리
        console.error("Error:", error);
      });
  }

  function handleSoftDeleteUser() {
    axios
      .delete(`/api/member/delete`, {
        data: { memberId: selectedMemberId, password: "admin" },
      })
      .then(() => {
        toast({
          status: "success",
          description: "회원이 탈퇴 되었습니다.",
          position: "bottom",
        });
        setMemberList((prevMemberList) =>
          prevMemberList.filter(
            (member) => member.memberId !== selectedMemberId,
          ),
        );
        onSoftDeleteAccountModalClose();
      })
      .catch(() => {
        toast({
          status: "error",
          description: "탈퇴 중 문제가 생겼습니다.",
          position: "bottom",
        });
      });
  }

  function handleHardDeleteUser() {
    axios
      .delete(`/api/member/hardDelete/${selectedMemberId}`)
      .then(() => {
        toast({
          status: "success",
          description: "회원이 탈퇴 되었습니다.",
          position: "bottom",
        });
        setWithdrawnList((prevMemberList) =>
          prevMemberList.filter(
            (member) => member.memberId !== selectedMemberId,
          ),
        );
        onHardDeleteAccountModalClose();
      })
      .catch(() => {
        toast({
          status: "error",
          description: "탈퇴 중 문제가 생겼습니다.",
          position: "bottom",
        });
      });
  }

  const handleMdSwitchChange = (postId) => {
    setToggleState((prevToggleState) => ({
      ...prevToggleState,
      [postId]: !prevToggleState[postId],
    }));
    if (selectedPosts.length < 3 || selectedPosts.includes(postId)) {
      setSelectedPosts((prevSelectedPosts) =>
        prevSelectedPosts.includes(postId)
          ? prevSelectedPosts.filter((id) => id !== postId)
          : [...prevSelectedPosts, postId],
      );
    }
  };

  const handleAddClick = () => {
    onModalOpenOfAdd();
    if (selectedPosts.length >= 3) {
      // 이미 3개의 포스트가 선택되었을 때 토스트 알림을 표시합니다.
      toast({
        title: "알림",
        description:
          "이미 3개의 포스트가 선택되었습니다. 포스트를 삭제해주세요.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    } else {
      // 3개 미만일 때 모달을 열어 추가 선택을 할 수 있도록 합니다.
      onModalOpenOfAdd();
    }
  };

  // city 상태가 변경될 때마다 호출되는 useEffect 훅
  useEffect(() => {
    // city 값이 비어있지 않다면 bannerLink 업데이트
    if (city) {
      setBannerLink(import.meta.env.VITE_KEY_WORD + `${city}`);
    }
  }, [city]); // city 상태가 변경될 때만 이 효과를 재실행

  //-----------------------------------이미지 관련 변수

  const [previewUrls, setPreviewUrls] = useState({}); // previewUrl 상태를 객체로 관리합니다.

  const handleFileChange = (event, postId) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 파일 읽기가 완료되면 해당 postId의 미리보기 URL을 상태에 저장합니다.
        setPreviewUrls((prevPreviewUrls) => ({
          ...prevPreviewUrls,
          [postId]: reader.result, // 각 postId에 대한 미리보기 URL을 저장합니다.
        }));
      };
      reader.readAsDataURL(file);
    }
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [postId]: file, // 여러 파일 중 첫 번째 파일만 저장합니다.
    }));
  };

  const prevSelectedPostsRef = useRef();
  const prevToggleStateRef = useRef();

  useEffect(() => {
    // 현재 상태를 ref에 저장합니다.
    prevSelectedPostsRef.current = selectedPosts;
    prevToggleStateRef.current = toggleState;
  }, [selectedPosts, toggleState]); // selectedPosts 또는 toggleState가 변경될 때마다 실행됩니다.

  useEffect(() => {
    // mdPicks 상태가 변경될 때마다 selectedPosts 상태를 업데이트합니다.
    setSelectedPosts(mdPicks.map((mdPick) => mdPick.postId));
  }, [mdPicks]);

  useEffect(() => {
    axios.get(`/api/member/list?${searchParams}`).then((res) => {
      setMemberList(res.data.memberList);
      setPageInfo(res.data.pageInfo);
    });
    axios.get(`/api/member/withdrawnmember`).then((res) => {
      setWithdrawnList(res.data.withdrawnMembers);
    });
    axios.get("/api/post/mdPickList").then((res) => {
      setMdPicks(res.data.post);
      setSelectedPosts(res.data.post);
    });
    axios.get("/api/post/bannerList").then((res) => setBannerList(res.data));
    axios.get("/api/post/mdList").then((res) => {
      setMdPosts(res.data.post);
    });
    setSearchType("all");
    setSearchKeyword("");

    const typeParam = searchParams.get("type");
    const keywordParam = searchParams.get("keyword");

    if (typeParam) {
      setSearchType(typeParam);
    }
    if (keywordParam) {
      setSearchKeyword(keywordParam);
    }
  }, [searchParams, memberId]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handleMdpostSearchClick() {
    axios
      .get(`/api/post/mdList?type=${searchType}&keyword=${searchKeyword}`)
      .then((res) => {
        setMdPosts(res.data.post);
      });
  }

  function handleSearchClick() {
    navigate(`/memberAdminPage/?type=${searchType}&keyword=${searchKeyword}`);
  }

  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    navigate(`/memberAdminPage/?${searchParams}`);
  }

  const handleDelete = async (postId) => {
    try {
      // 서버로 DELETE 요청을 보냅니다.
      await axios.post(`/api/post/${postId}/pop`);
      // 요청이 성공하면, 클라이언트 상태를 업데이트합니다.
      setMdPicks((prevMdPicks) =>
        prevMdPicks.filter((mdPick) => mdPick.postId !== postId),
      );
      // 스위치 상태도 초기화합니다.
      setToggleState((prevToggleState) => ({
        ...prevToggleState,
        [postId]: false, // 삭제된 포스트의 스위치 상태를 false로 설정합니다.
      }));
    } catch (error) {
      console.error("Error deleting mdPick", error);
      // 오류 처리 로직을 추가합니다.
    }
  };
  const handleDeleteConfirm = () => {
    handleDelete(deletePostId);
    onMdPostModalClose();
  };

  const openDeleteModal = (postId) => {
    setDeletePostId(postId);
    onMdPostModalOpen();
  };

  async function handleModalClose() {
    // // 상태 업데이트를 비동기적으로 처리합니다.
    // await new Promise((resolve) => {
    //
    //   resolve();
    // });
    setPreviewUrls({});
    setSelectedPosts([]);
    setToggleState({});
    // 상태 업데이트가 완료된 후에 필요한 작업을 수행합니다.
    onModalCloseOfAdd();
  }

  const handleSendMdPicks = async () => {
    // 성공적으로 전송된 postId를 추적하기 위한 배열입니다.
    const successfullySentPostIds = [];

    if (selectedPosts.length > 0) {
      for (const postId of selectedPosts) {
        // 스위치가 켜져 있지만 파일이 선택되지 않은 경우 경고를 표시합니다.
        if (!!toggleState[postId] && !selectedFiles[postId]) {
          toast({
            title: "사진을 등록해주세요",
            description: "선택된 게시물에 대한 사진을 등록해야 합니다.",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
          continue; // 다음 postId로 넘어갑니다.
        }

        const file = selectedFiles[postId];
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("postId", postId);

          try {
            const response = await axios.post("/api/post/push", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            console.log(
              `MdPick with postId ${postId} successfully sent`,
              response.data,
            );
            // 성공적으로 전송된 postId를 배열에 추가합니다.
            successfullySentPostIds.push(postId);
          } catch (error) {
            console.error(`Error sending MdPick with postId ${postId}`, error);
          }
        }
      }

      // 모달 닫는 함수를 호출합니다.
      onModalCloseOfAdd();
      // mdPick 리스트를 불러오는 함수를 호출합니다.
      await fetchMdPicks();

      // 모든 요청이 완료된 후, 성공적으로 전송된 postId를 기반으로 selectedPosts 상태를 업데이트합니다.
      setSelectedPosts((prevSelectedPosts) =>
        prevSelectedPosts.filter(
          (postId) => !successfullySentPostIds.includes(postId),
        ),
      );
    } else {
      // 선택된 게시물이 없으면 모달을 닫고 상태를 초기화합니다.
      setPreviewUrls({});
      setSelectedFiles({});
      setToggleState({});
      setSelectedPosts([]);
    }

    // 스위치 상태와 관련된 상태들을 초기화합니다.
    setPreviewUrls({});
    setSelectedFiles({});
    setToggleState({});
    setSelectedPosts([]);
  };

  // mdPick 리스트를 불러오는 함수입니다.
  const fetchMdPicks = async () => {
    try {
      const response = await axios.get("/api/post/mdPickList");
      setMdPicks(response.data.post);
    } catch (error) {
      console.error("Error fetching mdPicks", error);
    }
  };

  // mdPicks에 있는 postId들을 추적합니다.
  const selectedPostIds = mdPicks.map((pick) => pick.postId);

  // allPosts에서 mdPicks에 있는 postId를 제외한 게시물만 필터링합니다.
  const postsToShow = mdPosts.filter(
    (post) => !selectedPostIds.includes(post.postId),
  );

  //--------------------------------------------배너모달
  const [selectedBannerId, setSelectedBannerId] = useState(null);

  const handleBannerDelete = async (bannerId) => {
    try {
      await axios.delete(`/api/post/banner/remove/${bannerId}`);
      setBannerList((prevBannerList) =>
        prevBannerList.filter((banner) => banner.bannerId !== bannerId),
      );
      onBannerModalClose();
    } catch (error) {
      console.error("배너 삭제 중 오류 발생:", error);
    }
  };
  const handleBannerDeleteClick = (bannerId) => {
    setSelectedBannerId(bannerId);
    onBannerModalOpen();
  };

  const handleBannerDeleteConfirm = () => {
    if (selectedBannerId !== null) {
      handleBannerDelete(selectedBannerId);
    }
  };

  function fetchBannerList() {
    // 배너 리스트를 불러오는 로직
    axios
      .get("/api/post/bannerList")
      .then((response) => {
        // 상태 업데이트로 리스트를 다시 렌더링
        setBannerList(response.data);
      })
      .catch((error) => {
        // 오류 처리
        console.error("배너 리스트 불러오기 실패:", error);
      });
  }

  function handleOpenModal() {
    if (bannerList.length >= 2) {
      // 이미 2개의 배너가 있을 경우 경고 메시지를 표시합니다.
      toast({
        title: "알림",
        description:
          "이미 2개의 배너가 선택되었습니다. 배너를 삭제후 추가해주세요.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    } else {
      // 2개 미만일 경우 모달을 엽니다.
      onOpen();
    }
  }

  const handleBannerFileChange = (e) => {
    setBannerFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (city.length <= 0 || bannerLink.length <= 0) {
      toast({
        title: "알림",
        description: "제목과 링크를 꼭 입력 해주세요.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    // 새 배너 객체를 생성합니다.
    const formData = new FormData();
    formData.append("city", city);
    formData.append("link", bannerLink);
    formData.append("file", bannerFile);

    try {
      // 서버로 POST 요청을 보냅니다.
      const response = await axios.post("/api/post/banner/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(
        `배너가 성공적으로 전송되었습니다: ${city}, ${bannerLink}`,
        response.data,
      );

      // // 성공적으로 전송된 배너 정보를 bannerList에 추가합니다.
      // setBannerList((prevBannerList) => [
      //   ...prevBannerList,
      //   { city, link: bannerLink, file: bannerFile },
      // ]);
    } catch (error) {
      console.error(`Error sending banner for ${city}`, error);
    }

    // 입력 필드를 초기화합니다.
    setCity("");
    setBannerLink("");
    setBannerFile(null); // 파일은 null로 초기화합니다.

    onClose(); // 모달 닫는 함수를 호출합니다.
    fetchBannerList();
    // 배너 리스트를 불러오는 함수를 호출합니다.
  };

  if (!account.isAdmin()) {
    return (
      <Box>
        <Lobby />;
      </Box>
    );
  }

  function handleSearchKeyDown(e) {
    if (e.key === "Enter") {
      navigate(`/memberAdminPage/?type=${searchType}&keyword=${searchKeyword}`);
    }
  }

  const tdCellStyle = {
    maxWidth: "100px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  function handleLoadMore() {
    setVisiblePosts(
      (prevVisiblePosts) => prevVisiblePosts + (itemsPerRow || 3),
    );
  }

  return (
    <Box>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>회원관리</Tab>
          <Tab>탈퇴한 회원</Tab>
          <Tab>배너 등록</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box mb={"2rem"}>
              <HeadingVariant variant={"large"}>회원 목록</HeadingVariant>
            </Box>
            {memberList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
            {memberList.length > 0 && (
              <TableContainer
                w={{ base: "720px", sm: "720px", lg: "960px" }}
                mb={"1rem"}
              >
                <Table>
                  <Thead>
                    <Tr>
                      <Th w={"40%"}>이메일</Th>
                      <Th w={"30%"}>닉네임</Th>
                      <Th w={"10%"}>가입일시</Th>
                      <Th w={"10%"}>관리</Th>
                      <Th w={"10%"}>권한</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {memberList.map((member) => (
                      <Tr
                        cursor={"pointer"}
                        sx={{
                          "&:hover": {
                            backgroundColor: hColor,
                          },
                        }}
                        onClick={() => navigate(`/member/${member.memberId}`)}
                        key={member.memberId}
                      >
                        <Td w={"40%"}>{member.email}</Td>
                        <Td w={"30%"}>{member.nickName}</Td>
                        <Td w={"10%"}>{member.inserted}</Td>
                        <Td w={"10%"}>
                          <ButtonCircle
                            onClick={(e) => {
                              e.stopPropagation(); // 이벤트 버블링 방지
                              softDelete(member.memberId);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </ButtonCircle>
                        </Td>
                        <Td w={"10%"} onClick={(e) => e.stopPropagation()}>
                          <Menu>
                            <MenuButton
                              as={Button}
                              rightIcon={<ChevronDownIcon />}
                              w={"100px"}
                              color={"black.alpha.900"}
                            >
                              {member.authType}
                            </MenuButton>
                            <MenuList>
                              {member.authType === "user" ? (
                                <MenuItem
                                  onClick={(e) => {
                                    e.stopPropagation(); // 이벤트 버블링 방지
                                    authTypeChange("admin", member.memberId);
                                  }}
                                >
                                  admin
                                </MenuItem>
                              ) : (
                                <MenuItem
                                  onClick={(e) => {
                                    e.stopPropagation(); // 이벤트 버블링 방지
                                    authTypeChange("user", member.memberId);
                                  }}
                                >
                                  user
                                </MenuItem>
                              )}
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
            <Center>
              <Flex>
                <Box>
                  <Select onChange={(e) => setSearchType(e.target.value)}>
                    <option value="all">전체</option>
                    <option value="email">이메일</option>
                    <option value="nickName">닉네임</option>
                  </Select>
                </Box>
                <Box ml={2}>
                  <Input
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="검색어"
                    onKeyDown={handleSearchKeyDown}
                  />
                </Box>
                <Box ml={2}>
                  <ButtonCircle onClick={handleSearchClick}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </ButtonCircle>
                </Box>
              </Flex>
            </Center>

            <Center mt={4}>
              <Box>
                {pageInfo.prevPageNumber && (
                  <>
                    <ButtonOutline
                      onClick={() => handlePageButtonClick(1)}
                      colorScheme={"gray"}
                    >
                      <FontAwesomeIcon icon={faAnglesLeft} />
                    </ButtonOutline>
                    <ButtonOutline
                      onClick={() =>
                        handlePageButtonClick(pageInfo.prevPageNumber)
                      }
                      colorScheme={"gray"}
                    >
                      <FontAwesomeIcon icon={faAngleLeft} />
                    </ButtonOutline>
                  </>
                )}
                {pageNumbers.map((pageNumber) => (
                  <ButtonOutline
                    onClick={() => handlePageButtonClick(pageNumber)}
                    key={pageNumber}
                    colorScheme={
                      pageNumber === pageInfo.currentPageNumber
                        ? "blue"
                        : "gray"
                    }
                  >
                    {pageNumber}
                  </ButtonOutline>
                ))}
                {pageInfo.nextPageNumber && (
                  <>
                    <ButtonOutline
                      onClick={() =>
                        handlePageButtonClick(pageInfo.nextPageNumber)
                      }
                      colorScheme={"gray"}
                    >
                      <FontAwesomeIcon icon={faAngleRight} />
                    </ButtonOutline>
                    <ButtonOutline
                      onClick={() =>
                        handlePageButtonClick(pageInfo.lastPageNumber)
                      }
                      colorScheme={"gray"}
                    >
                      <FontAwesomeIcon icon={faAnglesRight} />
                    </ButtonOutline>
                  </>
                )}
              </Box>
            </Center>
          </TabPanel>
          <TabPanel>
            <Box mb={"2rem"}>
              <HeadingVariant variant={"large"}>탈퇴 회원 목록</HeadingVariant>
            </Box>
            {Array.isArray(withdrawnList) && withdrawnList.length === 0 && (
              <Center>조회 결과가 없습니다.</Center>
            )}
            {Array.isArray(withdrawnList) && withdrawnList.length > 0 && (
              <TableContainer
                w={{ base: "720px", sm: "720px", lg: "960px" }}
                mb={"1rem"}
              >
                <Table>
                  <Thead>
                    <Tr>
                      <Th w={"20%"}>#</Th>
                      <Th w={"20%"}>이메일</Th>
                      <Th w={"30%"}>닉네임</Th>
                      <Th w={"15%"}>가입일시</Th>
                      <Th w={"10%"}>관리</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {withdrawnList.map((member) => (
                      <Tr
                        cursor={"pointer"}
                        sx={{
                          "&:hover": {
                            backgroundColor: hColor,
                          },
                        }}
                        onClick={() => navigate(`/member/${member.memberId}`)}
                        key={member.memberId}
                      >
                        <Td>{member.memberId}</Td>
                        <Td>{member.email}</Td>
                        <Td>{member.nickName}</Td>
                        <Td>{member.inserted}</Td>

                        <Td>
                          <ButtonCircle
                            onClick={(e) => {
                              e.stopPropagation();
                              hardDelete(member.memberId);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </ButtonCircle>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
          <TabPanel>
            <Box mb={"2rem"}>
              <HeadingVariant variant={"large"}>배너 등록</HeadingVariant>
            </Box>
            <Box w={{ base: "720px", sm: "720px", lg: "960px" }} mb={"1rem"}>
              <Wrap mb={"1rem"}>
                <WrapItem>
                  <Button onClick={handleAddClick}>MD 게시글 선택</Button>
                </WrapItem>
                <WrapItem>
                  <Button onClick={handleOpenModal}>지역 배너 선택</Button>
                </WrapItem>
              </Wrap>
              <Card w={{ base: "720px", lg: "960px" }}>
                <CardBody>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th width={"25%"}>게시물 아이디</Th>
                        <Th width={"25%"}>제목</Th>
                        <Th width={"50%"}>내용</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mdPicks.map((mdpick) => (
                        <Tr
                          cursor={"pointer"}
                          sx={{
                            "&:hover": {
                              backgroundColor: hColor,
                            },
                          }}
                          key={mdpick.postId}
                        >
                          <Td sx={tdCellStyle}>{mdpick.postId}</Td>
                          <Td sx={tdCellStyle}>{mdpick.title}</Td>
                          <Td sx={tdCellStyle}>
                            <ContentParser content={mdpick.content} />{" "}
                          </Td>
                          <Td>
                            <ButtonCircle
                              onClick={() => openDeleteModal(mdpick.postId)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </ButtonCircle>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
              <Modal isOpen={isMdPostModalOpen} onClose={onMdPostModalClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>삭제 확인</ModalHeader>
                  <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
                  <ModalFooter>
                    <Button onClick={handleDeleteConfirm}>확인</Button>
                    <Button onClick={onMdPostModalClose}>취소</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              {/*여기*/}
              <Card mt={10} w={{ base: "720px", lg: "100%" }}>
                <CardBody>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th width={"150px"}>배너 아이디</Th>
                        <Th width={"200px"}>지역이름</Th>
                        <Th width={"500px"}>링크</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {bannerList.map((banner) => (
                        <Tr
                          cursor={"pointer"}
                          sx={{
                            "&:hover": {
                              backgroundColor: hColor,
                            },
                          }}
                          key={banner.bannerId}
                        >
                          <Td sx={tdCellStyle}>{banner.bannerId}</Td>
                          <Td sx={tdCellStyle}>{banner.city}</Td>
                          <Td sx={tdCellStyle}>{banner.link}</Td>
                          <Td>
                            <ButtonCircle
                              onClick={() =>
                                handleBannerDeleteClick(banner.bannerId)
                              }
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </ButtonCircle>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
              <Modal isOpen={isBannerModalOpen} onClose={onBannerModalClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>삭제 확인</ModalHeader>
                  <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
                  <ModalFooter>
                    <Button onClick={handleBannerDeleteConfirm}>확인</Button>
                    <Button onClick={onBannerModalClose}>취소</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal isOpen={isModalOpenOfAdd} onClose={onModalCloseOfAdd}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>MD 리스트</ModalHeader>
          <ModalBody>배너에 등록할 게시글을 선택 해주세요.</ModalBody>
          <Center mb={5}>
            <Box>
              <Select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                }}
              >
                <option value={"all"}>전체</option>
                <option value={"titleAndContent"}>제목+내용</option>
                <option value={"nickName"}>닉네임</option>
                <option value={"placeName"}>장소명</option>
                <option value={"address"}>지역명</option>
              </Select>
            </Box>
            <Box ml={1}>
              <Input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="검색어"
              />
            </Box>
            <Box ml={2}>
              <ButtonCircle onClick={handleMdpostSearchClick}>
                <FontAwesomeIcon icon={faMagnifyingGlass} fontSize="small" />
              </ButtonCircle>
            </Box>
          </Center>
          {postsToShow.slice(0, visiblePosts).map((mdPost) => (
            <Center key={mdPost.postId} mb={4}>
              <Card border="1px ligtgray" mb="3px" width={"400px"}>
                <CardHeader>
                  <Flex
                    justify="space-between"
                    textAlign="center"
                    alignItems="center"
                  >
                    <Heading size="md">{mdPost.title}</Heading>
                    <Switch
                      isChecked={!!toggleState[mdPost.postId]}
                      onChange={() => handleMdSwitchChange(mdPost.postId)}
                      disabled={
                        selectedPosts.length >= 3 &&
                        !selectedPosts.includes(mdPost.postId)
                      }
                    />
                  </Flex>
                </CardHeader>

                <CardBody>
                  <Flex
                    justify="space-between"
                    overflow={"hidden"}
                    textOverflow={"ellipsis"}
                    display={"-webkit-box"}
                    css={{
                      WebkitLineClamp: "3",
                      WebkitBoxOrient: "vertical",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <ContentParser content={mdPost.content} />
                  </Flex>
                  {toggleState[mdPost.postId] && (
                    <>
                      {previewUrls[mdPost.postId] ? (
                        <Box mb={7} w="100%" h="200px" overflow="hidden">
                          <img
                            src={previewUrls[mdPost.postId]}
                            alt="Preview"
                            style={{ width: "100%", height: "auto" }}
                          />
                        </Box>
                      ) : (
                        <Box mb={7} w="100%" h="100px" bg="gray.200"></Box>
                      )}
                      <Box mb={7}>
                        <FormControl>
                          <FormLabel>배너사진 선택</FormLabel>
                          <Input
                            alignContent={"center"}
                            multiple
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              handleFileChange(event, mdPost.postId)
                            }
                          />
                          <FormHelperText>
                            총 용량은 10MB, 한 파일은 1MB를 초과할 수 없습니다.
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    </>
                  )}
                </CardBody>
              </Card>
            </Center>
          ))}
          <Center mt={5}>
            {visiblePosts < mdPosts.length - 1 && (
              <Button onClick={handleLoadMore} color={"black.alpha.900"}>
                더보기
              </Button>
            )}
          </Center>
          <ModalFooter>
            <Button mr={3} onClick={handleSendMdPicks}>
              추가
            </Button>
            <Button onClick={handleModalClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>지역배너 추가</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              mt={2}
              type="text"
              placeholder="지역 이름을 적어주세요"
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              mt={2}
              type="file"
              onChange={handleBannerFileChange}
              alignContent={"center"}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              추가
            </Button>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isSoftDeleteAccountModalOpen}
        onClose={onSoftDeleteAccountModalClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>회원 탈퇴확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>정말 탈퇴 시키겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={handleSoftDeleteUser}>확인</Button>
            <Button onClick={onSoftDeleteAccountModalClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isHardDeleteAccountModalOpen}
        onClose={onHardDeleteAccountModalClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>회원 탈퇴확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            회원의 모든 정보, 게시물 등이 삭제됩니다. 삭제 하시겠습니까?
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleHardDeleteUser}>확인</Button>
            <Button onClick={onHardDeleteAccountModalClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default MemberAdminPage;
