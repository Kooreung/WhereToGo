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
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardFast,
  faBackwardStep,
  faForwardFast,
  faForwardStep,
  faMagnifyingGlass,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Lobby from "../Lobby.jsx";
import { LoginContext } from "../../component/LoginProvider.jsx";
import ContentParser from "../../component/ContentParser.jsx";
import ButtonNumber from "../../css/Button/ButtonNumber.jsx";
import ButtonCircle from "../../css/Button/ButtonCircle.jsx";

export function AdminPage() {
  const [memberList, setMemberList] = useState([]);
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

  //배너 변수
  const [bannerList, setBannerList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bannerLink, setBannerLink] = useState("");
  const [bannerFile, setBannerFile] = useState([]);
  const [city, setCity] = useState("");

  const {
    isOpen: isModalOpenOfAdd,
    onOpen: onModalOpenOfAdd,
    onClose: onModalCloseOfAdd,
  } = useDisclosure();
  const [selectedPosts, setSelectedPosts] = useState([]);

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
    console.log(selectedPosts);
  };

  const handleAddClick = () => {
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
    axios.get("/api/post/mdPickList").then((res) => {
      setMdPicks(res.data.post);
      setSelectedPosts(res.data.post);
    });
    axios.get("/api/post/bannerList").then((res) => setBannerList(res.data));

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
  }, [searchParams]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handleBanner() {
    axios.get("/api/post/mdList").then((res) => {
      setMdPosts(res.data.post);
      console.log(res.data);
    });
  }

  function handleSearchClick() {
    navigate(`/memberList/?type=${searchType}&keyword=${searchKeyword}`);
  }

  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    navigate(`/memberList/?${searchParams}`);
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

  async function handleModalClose() {
    // // 상태 업데이트를 비동기적으로 처리합니다.
    // await new Promise((resolve) => {
    //
    //   resolve();
    // });
    setSelectedPosts([]);
    setToggleState({});
    // 상태 업데이트가 완료된 후에 필요한 작업을 수행합니다.
    onModalCloseOfAdd();
  }

  const handleSendMdPicks = async () => {
    // 성공적으로 전송된 postId를 추적하기 위한 배열입니다.
    const successfullySentPostIds = [];

    for (const postId of selectedPosts) {
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
      onModalCloseOfAdd(); // 모달 닫는 함수를 호출합니다.
      await fetchMdPicks(); // mdPick 리스트를 불러오는 함수를 호출합니다.
    }

    // 모든 요청이 완료된 후, 성공적으로 전송된 postId를 기반으로 selectedPosts 상태를 업데이트합니다.
    setSelectedPosts((prevSelectedPosts) =>
      prevSelectedPosts.filter(
        (postId) => !successfullySentPostIds.includes(postId),
      ),
    );
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

  async function handleBannerDelete(bannerId) {
    try {
      // `axios.delete` 요청을 기다립니다.
      await axios.delete(`/api/post/banner/remove/${bannerId}`);
      // 요청이 성공하면 배너 리스트 상태를 업데이트합니다.
      setBannerList((prevBannerList) =>
        prevBannerList.filter((banner) => banner.bannerId !== bannerId),
      );
    } catch (error) {
      // 오류 처리
      console.error("배너 삭제 중 오류 발생:", error);
    }
  }

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

  const handleLinkChange = (e) => {
    setBannerLink(e.target.value);
  };

  const handleBannerFileChange = (e) => {
    setBannerFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
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

  const tdCellStyle = {
    maxWidth: "300px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <Box>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>회원관리</Tab>
          <Tab onClick={handleBanner}>배너 등록</Tab>
        </TabList>
        <TabPanels w={{ base: "720px", lg: "960px" }}>
          <TabPanel>
            <Box mb={10}>
              <Heading>회원 목록</Heading>
            </Box>
            {memberList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
            {memberList.length > 0 && (
              <Box mb={10}>
                <Table>
                  <Thead>
                    <Tr>
                      <Th w={20}>#</Th>
                      <Th>이메일</Th>
                      <Th w={"150px"}>별명</Th>
                      <Th w={96}>가입일시</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {memberList.map((member) => (
                      <Tr
                        cursor={"pointer"}
                        sx={{
                          "&:hover": {
                            backgroundColor: "RGBA(0, 0, 0, 0.06)",
                          },
                        }}
                        onClick={() => navigate(`/member/${member.memberId}`)}
                        key={member.memberId}
                      >
                        <Td>{member.memberId}</Td>
                        <Td>{member.email}</Td>
                        <Td>{member.nickName}</Td>
                        <Td>{member.inserted}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
            <Center>
              <Flex>
                <Box>
                  <Select onChange={(e) => setSearchType(e.target.value)}>
                    <option value="all">전체</option>
                    <option value="email">이메일</option>
                    <option value="nickName">작성자</option>
                  </Select>
                </Box>
                <Box ml={2}>
                  <Input
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="검색어"
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
                    <ButtonNumber onClick={() => handlePageButtonClick(1)}>
                      <FontAwesomeIcon icon={faBackwardFast} />
                    </ButtonNumber>
                    <ButtonNumber
                      onClick={() =>
                        handlePageButtonClick(pageInfo.prevPageNumber)
                      }
                    >
                      <FontAwesomeIcon icon={faBackwardStep} />
                    </ButtonNumber>
                  </>
                )}
                {pageNumbers.map((pageNumber) => (
                  <ButtonNumber
                    onClick={() => handlePageButtonClick(pageNumber)}
                    key={pageNumber}
                    colorScheme={
                      pageNumber === pageInfo.currentPageNumber
                        ? "blue"
                        : "gray"
                    }
                  >
                    {pageNumber}
                  </ButtonNumber>
                ))}
                {pageInfo.nextPageNumber && (
                  <>
                    <ButtonNumber
                      onClick={() =>
                        handlePageButtonClick(pageInfo.nextPageNumber)
                      }
                    >
                      <FontAwesomeIcon icon={faForwardStep} />
                    </ButtonNumber>
                    <ButtonNumber
                      onClick={() =>
                        handlePageButtonClick(pageInfo.lastPageNumber)
                      }
                    >
                      <FontAwesomeIcon icon={faForwardFast} />
                    </ButtonNumber>
                  </>
                )}
              </Box>
            </Center>
          </TabPanel>
          <TabPanel w={{ base: "720px", lg: "960px" }}>
            <Wrap spacing={4} mb={6}>
              <WrapItem>
                <Button colorScheme="orange" onClick={handleAddClick}>
                  MDpost선택
                </Button>
              </WrapItem>
              <WrapItem>
                <Button colorScheme="yellow" onClick={handleOpenModal}>
                  지역배너 선택
                </Button>
              </WrapItem>
            </Wrap>
            <Card w={{ base: "720px", lg: "960px" }}>
              <CardBody>
                <Table>
                  <Thead>
                    <Tr>
                      <Th width={"150px"}>게시물 아이디</Th>
                      <Th width={"200px"}>제목</Th>
                      <Th width={"500px"}>내용</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {mdPicks.map((mdpick) => (
                      <Tr
                        cursor={"pointer"}
                        sx={{
                          "&:hover": {
                            backgroundColor: "RGBA(0, 0, 0, 0.06)",
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
                            onClick={() => handleDelete(mdpick.postId)}
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
            {/*여기*/}
            <Card mt={10} w={{ base: "720px", lg: "960px" }}>
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
                            backgroundColor: "RGBA(0, 0, 0, 0.06)",
                          },
                        }}
                        key={banner.bannerId}
                      >
                        <Td sx={tdCellStyle}>{banner.bannerId}</Td>
                        <Td sx={tdCellStyle}>{banner.city}</Td>
                        <Td sx={tdCellStyle}>{banner.link}</Td>
                        <Td>
                          <ButtonCircle
                            onClick={() => handleBannerDelete(banner.bannerId)}
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
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal isOpen={isModalOpenOfAdd} onClose={onModalCloseOfAdd}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>MD 리스트</ModalHeader>
          <ModalBody>ㅇ 배너에 등록할 게시글을 선택 해주세요.</ModalBody>
          {postsToShow.map((mdPost) => (
            <Center key={mdPost.postId} mb={4}>
              <Card border="1px ligtgray" mb="3px" width={"400px"}>
                <CardHeader>
                  <Heading size="md">{mdPost.title}</Heading>
                </CardHeader>

                <CardBody>
                  <Box display="flex">
                    <ContentParser content={mdPost.content} />
                    <Switch
                      isChecked={!!toggleState[mdPost.postId]}
                      onChange={() => handleMdSwitchChange(mdPost.postId)}
                      disabled={
                        selectedPosts.length >= 3 &&
                        !selectedPosts.includes(mdPost.postId)
                      }
                    />
                  </Box>
                  {toggleState[mdPost.postId] && (
                    <>
                      {previewUrls[mdPost.postId] ? (
                        // 이미지 미리보기를 표시합니다.
                        <Box mb={7} w="100%" h="200px" overflow="hidden">
                          <img
                            src={previewUrls[mdPost.postId]}
                            alt="Preview"
                            style={{ width: "100%", height: "auto" }}
                          />
                        </Box>
                      ) : (
                        // 기본 이미지 또는 플레이스홀더를 표시합니다.
                        <Box mb={7} w="100%" h="200px" bg="gray.200"></Box>
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
              placeholder="링크를 입력하세요"
              value={bannerLink}
              onChange={handleLinkChange}
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
    </Box>
  );
}

export default AdminPage;
