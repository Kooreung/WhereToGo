import React, { useEffect, useState } from "react";
import { Box, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberInfo(props) {
  const [member, setMember] = useState({});
  const toast = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setMember(res.data.member))
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "warning",
            description: "존재하지 않는 회원입니다.",
            position: "top",
          });
          navigate("/");
        } else if (err.response.status === 403) {
          toast({
            status: "error",
            description: "권한이 없습니다.",
            position: "top",
          });
          navigate(-1);
        }
      });
  }, []);
  return (
    <Box>
      <p>{member.email}</p>
    </Box>
  );
}

export default MemberInfo;
