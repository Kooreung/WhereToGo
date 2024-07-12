import {
  Box,
  Button,
  Center,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import HeadingVariant from "../../components/ui/Heading/HeadingVariant.jsx";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import ButtonOutline from "../../components/ui/Button/ButtonOutline.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";

export function ReportList() {
  const navigate = useNavigate();
  const [reportList, setReportList] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageInfo, setPageInfo] = useState({});
  const hColor = useColorModeValue(
    "rgba(216, 183, 229, 0.2)",
    "rgba(131, 96, 145, 0.2)",
  );
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [processYn, setProcessYn] = useState();
  const toast = useToast();

  useEffect(() => {
    axios.get(`/api/report/recordlist?${searchParams}`).then((res) => {
      setReportList(res.data.reportList);
      setPageInfo(res.data.pageInfo);
    });
  }, [searchParams]);

  // 페이지 수
  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  // 페이지 버튼 클릭 시
  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    setSearchParams(searchParams); // URL 업데이트
  }

  const tdCellStyle = {
    maxWidth: "100px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const handleRowClick = (report) => {
    setSelectedReport(report);
    onOpen();
  };

  function handleSubmitProcess() {
    const selectProcess =
      processYn === "1" ? "P" : processYn === "2" ? "Y" : null;
    axios
      .put("/api/report/reportprocess", {
        reportId: selectedReport.reportId,
        processYn: selectProcess,
      })
      .then((res) => {
        toast({
          status: "success",
          position: "bottom",
          isClosable: true,
          description: "처리 완료",
        });
        onClose();
        navigate(`/post/${selectedReport.postId}`);
      })
      .catch(() => {
        toast({
          status: "error",
          isClosable: true,
          position: "bottom",
          description: "처리 실패",
        });
        onClose();
      });
  }

  return (
    <>
      <Box mb={"2rem"}>
        <HeadingVariant variant={"large"}>게시글 신고 목록</HeadingVariant>
      </Box>
      {reportList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
      {reportList.length > 0 && (
        <TableContainer
          w={{ base: "720px", sm: "720px", lg: "960px" }}
          mb={"1rem"}
        >
          <Table>
            <Thead>
              <Tr>
                <Th w={"10%"}>#</Th>
                <Th w={"20%"}>게시글 제목</Th>
                <Th w={"20%"}>신고사유</Th>
                <Th w={"10%"}>신고자</Th>
                <Th w={"10%"}>처리여부</Th>
                <Th w={"10%"}>처리자</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reportList.map((report, index) => (
                <Tr
                  cursor={"pointer"}
                  sx={{
                    "&:hover": {
                      backgroundColor: hColor,
                    },
                  }}
                  onClick={() => handleRowClick(report)}
                  key={index}
                >
                  <Td w={"10%"}>{report.reportId}</Td>
                  <Td w={"20%"} sx={tdCellStyle}>
                    {report.titleName
                      ? report.titleName
                      : "삭제된 게시글입니다"}
                  </Td>
                  <Td w={"20%"}>{report.reportReason}</Td>

                  <Td w={"10%"}>{report.creatorName}</Td>
                  <Td w={"10%"}>{report.processYn}</Td>
                  <Td w={"10%"}>{report.processorName}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {/*페이징*/}
          <Box mt={4}>
            <Center>
              {pageInfo.prevPageNumber && (
                <>
                  <ButtonOutline onClick={() => handlePageButtonClick(1)}>
                    <FontAwesomeIcon icon={faAnglesLeft} />
                  </ButtonOutline>
                  <ButtonOutline
                    onClick={() =>
                      handlePageButtonClick(pageInfo.prevPageNumber)
                    }
                  >
                    <FontAwesomeIcon icon={faAngleLeft} />
                  </ButtonOutline>
                </>
              )}
              {pageNumbers.map((pageNumber) => (
                <ButtonOutline
                  key={pageNumber}
                  onClick={() => handlePageButtonClick(pageNumber)}
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
                  >
                    <FontAwesomeIcon icon={faAngleRight} />
                  </ButtonOutline>
                  <ButtonOutline
                    onClick={() =>
                      handlePageButtonClick(pageInfo.lastPageNumber)
                    }
                  >
                    <FontAwesomeIcon icon={faAnglesRight} />
                  </ButtonOutline>
                </>
              )}
            </Center>
          </Box>
        </TableContainer>
      )}

      {/* 모달 */}
      {selectedReport && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex justify="space-between" align="center" w="100%">
                <Text>신고 상세 정보</Text>
                <Button
                  size="xs"
                  variant="outline"
                  color="#836091"
                  onClick={() => navigate(`/post/${selectedReport.postId}`)}
                >
                  게시글 확인
                </Button>
              </Flex>
            </ModalHeader>
            <ModalBody>
              <Flex mb={2}>
                <Text fontWeight={"bolder"} mr={2}>
                  신고 번호:
                </Text>
                <Text>{selectedReport.reportId}</Text>
              </Flex>
              <Flex mb={2}>
                <Text fontWeight={"bolder"} mr={2}>
                  신고 일자:
                </Text>
                <Text>{selectedReport.creatDate}</Text>
              </Flex>
              <Box mb={2}>
                <Text fontWeight={"bolder"}>게시글 제목:</Text>
                <Text whiteSpace="pre-wrap">
                  {selectedReport.titleName
                    ? selectedReport.titleName
                    : "삭제된 게시물 입니다."}
                </Text>
              </Box>
              <Flex mb={2}>
                <Text fontWeight={"bolder"} mr={2}>
                  신고 사유:
                </Text>
                <Text>{selectedReport.reportReason}</Text>
              </Flex>
              <Box mb={2}>
                <Text fontWeight={"bolder"}>처리 여부:</Text>
                <RadioGroup defaultValue={processYn} onChange={setProcessYn}>
                  <Stack direction="row">
                    <Radio colorScheme="purple" value="1">
                      블라인드
                    </Radio>
                    <Radio colorScheme="purple" value="2">
                      완료
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>
              <Box>
                <Text fontWeight={"bolder"}>상세 사유:</Text>
                <Textarea
                  readOnly={true}
                  value={selectedReport.reportDetailReason}
                />
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button
                // onClick={() => navigate(`/post/${selectedReport.postId}`)}
                onClick={handleSubmitProcess}
              >
                확인
              </Button>
              <Button onClick={onClose}>취소</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default ReportList;
