import { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export function MemberCertify() {
  const [searchParams] = useSearchParams();

  console.log("token:", searchParams.get("token"));
  const token = searchParams.set("token", searchParams.get("token"));

  useEffect(() => {
    axios
      .get(`/api/member/tokenCertify?token=${token}`)
      .then(() => {})
      .catch((error) => {
        // 에러 처리
        if (error.response.status === 404) {
          console.log("API 요청 실패 - 404 에러");
        } else {
          console.error("API 요청 실패:", error);
        }
      });
  }, [token]);

  return <div>나오지 말았으면 해</div>;
}
