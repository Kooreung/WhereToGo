import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import { GuideLineMediumBanner } from "../../CustomStyles.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CommentComponent from "../../component/Comment/CommentComponent.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-regular-svg-icons";

export function PostView() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const [like, setLike] = useState({ like: false, count: 0 });
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  useEffect(() => {
    axios
      .get(`/api/post/${postId}`)
      .then((res) => {
        setPost(res.data.post);
        console.log(res.data);
      })
      .catch();
  }, []);

  if (post === null || post === undefined) {
    return <Spinner />;
  }

  function handleLikeCount() {
    setIsLikeLoading(true);
    axios
      .put("/api/post/like", { postId: post.postId })
      .then((res) => {
        setLike(res.data);
      })
      .catch((err) => {})
      .finally(() => {
        setIsLikeLoading(false);
      });
  }

  return (
    <Box>
      <Flex justify={"space-evenly"}>
        <Box>
          <Box {...GuideLineMediumBanner} w={500} h={500}>
            지도
            {/* Todo 지도 표기 필요 */}
          </Box>
          <Box {...GuideLineMediumBanner} w={500}>
            추가 dsadas
            {/* Todo 장소 내용 표기 필요 */}
          </Box>
        </Box>
        <Box>
          <Box {...GuideLineMediumBanner} w={500} h={1000} p={10}>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>제목</FormLabel>
                <Input value={post.title} readOnly />
              </FormControl>
            </Box>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>작성자</FormLabel>
                <Input value={post.nickName} readOnly />
              </FormControl>
            </Box>
            <Box align={"left"} my={10}>
              <FormControl>
                <FormLabel>설명</FormLabel>
                <Textarea h={200} value={post.content} readOnly></Textarea>
              </FormControl>
            </Box>
          </Box>
          {/*좋아요*/}
          <Flex justifyContent="center" alignItems="center" my={1}>
            <Box onClick={handleLikeCount}>
              {like.like && <FontAwesomeIcon icon={emptyHeart} />}
              {like.like || <FontAwesomeIcon icon={fullHeart} />}
            </Box>
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            <Box>like {like.count}</Box>
          </Flex>
          {/*댓글*/}
          <CommentComponent postId={post.postId} />
          <Box>
            <Box align={"left"} my={10}>
              <Button onClick={() => navigate(`/post/${postId}/edit`)}>
                수정
              </Button>
              <Button>삭제</Button>
              {/* Todo 게시글 삭제 기능 필요 */}
            </Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
