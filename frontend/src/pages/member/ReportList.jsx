import {
  Box,
  Center,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageInfo, setPageInfo] = useState({});
  const hColor = useColorModeValue(
    "rgba(216, 183, 229, 0.2)",
    "rgba(131, 96, 145, 0.2)",
  );

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

  return (
    <>
      <Box mb={"2rem"}>
        <HeadingVariant variant={"large"}>신고 목록</HeadingVariant>
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
                <Th w={"20%"}>게시판 제목</Th>
                <Th w={"20%"}>신고사유</Th>
                <Th w={"20%"}>상세사유</Th>
                <Th w={"10%"}>신고자</Th>
                <Th w={"10%"}>처리여부</Th>
                <Th w={"20%"}>신고일자</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reportList.map((report) => (
                <Tr
                  cursor={"pointer"}
                  sx={{
                    "&:hover": {
                      backgroundColor: hColor,
                    },
                  }}
                >
                  <Td w={"20%"} sx={tdCellStyle}>
                    {report.titleName
                      ? report.titleName
                      : "삭제된 게시글입니다"}
                  </Td>
                  <Td w={"20%"}>{report.reportReason}</Td>
                  <Td w={"20%"} sx={tdCellStyle}>
                    {report.reportDetailReason}
                  </Td>
                  <Td w={"10%"}>{report.creatorName}</Td>
                  <Td w={"10%"}>{report.processYn}</Td>
                  <Td w={"20%"}>{report.creatDate}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {/*페이징*/}
          <Box>
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
    </>
  );
}

export default ReportList;
