package com.backend.service.post;

import com.backend.domain.post.Post;
import com.backend.mapper.post.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class PostService {

    private final PostMapper postMapper;

    // 게시글 작성 시 제목, 내용 공백 확인
    public boolean validate(Post post) {
        if (post.getTitle() == null || post.getTitle().isBlank()) {
            return false;
        }
        if (post.getContent() == null || post.getContent().isBlank()) {
            return false;
        }
        return true;
    }

    // 게시글 추가 서비스
    public Integer add(Post post, Authentication authentication) {
        post.setMemberId(Integer.valueOf(authentication.getName()));
        postMapper.insert(post);
        return post.getPostId();
    }

    // 게시글 조회 서비스
    public Map<String, Object> get(Integer postId, Authentication authentication) {
        Post post = postMapper.selectById(postId);
        Map<String, Object> result = new HashMap<>();


        Map<String, Object> like = new HashMap<>();
//        로그인안하면 빈하트 로그인하면 좋아요 한 게시물 하트
        if (authentication == null) {
            like.put("like", false);
        } else {
            int c = postMapper.selectLikeByPostIdAndMemberId(postId, authentication.getName());
            like.put("like", c == 1);
        }
//        게시물 조회시 좋아요 카운트 전송
        like.put("count", postMapper.selectCountLikeByBoardId(postId));
        result.put("like", like);
        result.put("post", post);

        int commentCount = postMapper.selectCountCommentByBoardId(postId);
        result.put("commentCount", commentCount);

        return result;
    }

    // 게시글 리스트 서비스
    public Map<String, Object> list(Integer page, String searchType, String searchKeyword) {
        // 페이징 내용
        Map pageInfo = new HashMap();

        Integer countAllPost = postMapper.countAllPost(searchType, searchKeyword);
        Integer offset = (page - 1) * 5;
        Integer lastPageNumber = (countAllPost - 1) / 10 + 1;
        Integer leftPageNumber = (page - 1) / 10 * 10 + 1;
        Integer rightPageNumber = leftPageNumber + 9;

        rightPageNumber = Math.min(rightPageNumber, lastPageNumber);
        leftPageNumber = rightPageNumber - 9;
        leftPageNumber = Math.max(leftPageNumber, 1);

        Integer prevPageNumber = leftPageNumber - 1;
        Integer nextPageNumber = rightPageNumber + 1;

        if (prevPageNumber > 0) {
            pageInfo.put("prevPageNumber", prevPageNumber);
        }
        if (nextPageNumber <= lastPageNumber) {
            pageInfo.put("nextPageNumber", nextPageNumber);
        }

        pageInfo.put("currentPageNumber", page);
        pageInfo.put("lastPageNumber", lastPageNumber);
        pageInfo.put("leftPageNumber", leftPageNumber);
        pageInfo.put("rightPageNumber", rightPageNumber);


        return Map.of("pageInfo", pageInfo, "postList", postMapper.selectAllPost(offset, searchType, searchKeyword));
    }

    // 게시글 수정 서비스
    public void edit(Post post) {
        postMapper.update(post);
    }

    // 게시글 수정 시 권한 체크 서비스
    public boolean hasMemberIdAccess(Integer postId, Authentication authentication) {
        Post post = postMapper.selectById(postId);
        return post.getMemberId().equals(Integer.valueOf(authentication.getName()));
    }

    // 게시글 삭제 서비스
    public void remove(Integer postId) {
        postMapper.deleteById(postId);
    }


    public Map<String, Object> postLike(Map<String, Object> like, Authentication authentication) {
        Map<String, Object> result = new HashMap<>();
        result.put("like", false);
        Integer postId = (Integer) like.get("postId");
        Integer memberId = Integer.valueOf(authentication.getName());

        int count = postMapper.deleteLike(postId, memberId);
        if (count == 0) {
            postMapper.insertLike(postId, memberId);
        }
        result.put("count", postMapper.selectCountLikeByBoardId(postId));
        return result;
    }
}
