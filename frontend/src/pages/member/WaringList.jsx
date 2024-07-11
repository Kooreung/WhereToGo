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
} from "@chakra-ui/react";
import HeadingVariant from "../../components/ui/Heading/HeadingVariant.jsx";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function WaringList() {
  const navigate = useNavigate();
  const [reportList, setReportList] = useState([]);

  useMemo(() => {
    axios.get("/api/report/recordlist").then((res) => {
      setReportList(res.data);
    });
  }, []);

  return (
    <>
      <Box mb={"2rem"}>
        <HeadingVariant variant={"large"}>회원 목록</HeadingVariant>
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
                <Th w={"40%"}>게시판 제목</Th>
                <Th w={"40%"}>신고사유</Th>
                <Th w={"40%"}>상세사유</Th>
                <Th w={"40%"}>신고자</Th>
                <Th w={"10%"}>처리여부</Th>
                <Th w={"10%"}>신고일자</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reportList.map((report) => (
                <Tr
                  cursor={"pointer"}
                  onClick={() => navigate(`/report/${report.reportId}`)}
                  key={report.reportId}
                >
                  <Td w={"40%"}>{report.titlename}</Td>
                  <Td w={"30%"}>{report.reportreason}</Td>
                  <Td w={"10%"}>{report.repostdetailreason}</Td>
                  <Td w={"10%"}>{report.creatorname}</Td>
                  <Td w={"10%"}>{report.processyn}</Td>
                  <Td w={"10%"}>{report.creatdate}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
