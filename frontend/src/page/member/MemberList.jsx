import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";
import {
  Box, Button, Center, Flex,
  Heading, Input, Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";

export function MemberList() {
  const [memberList, setMemberList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");


  useEffect(() => {
    axios.get(`/api/member/list?${searchParams}`).then((res) => {
      setMemberList(res.data.memberList);
      setPageInfo(res.data.pageInfo);
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
  }, [searchParams]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handleSearchClick() {
    navigate(`/memberList/?type=${searchType}&keyword=${searchKeyword}`);
  }

  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    navigate(`/memberList/?${searchParams}`);
  }

  return (
    <Box>
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
                _hover={{ bgColor: "gray.200" }}
                onClick={() => navigate(`/member/${member.memberId}`)}
                key={member.memberId}
              >
                <Td>{member.memberId}</Td>
                <Td>{member.email}</Td>
                <Td>{member.nickName}</Td>
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
          <Box>
            <Input
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="검색어"
            />
          </Box>
          <Box>
            <Button onClick={handleSearchClick}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
          </Box>
        </Flex>
      </Center>

      <Center>
      <Box>
        {pageInfo.prevPageNumber && (
          <>
            <Button onClick={() => handlePageButtonClick(1)}>처음</Button>
          <Button onClick={() => handlePageButtonClick(pageInfo.prevPageNumber)}>
            이전
          </Button>
          </>
        )}
        {pageNumbers.map((pageNumber) => (
          <Button
            onClick={() => handlePageButtonClick(pageNumber)}
            key={pageNumber}
            colorScheme={
              pageNumber === pageInfo.currentPageNumber ? "blue" : "gray"
            }
          >
            {pageNumber}
          </Button>
        ))}
        {pageInfo.nextPageNumber && (
          <>
          <Button onClick={() => handlePageButtonClick(pageInfo.nextPageNumber)}>
            다음
          </Button>
        <Button
          onClick={() => handlePageButtonClick(pageInfo.lastPageNumber)}
        >
          맨끝
        </Button>
          </>
        )}
      </Box>
      </Center>
    </Box>
  );
}

export default MemberList;
