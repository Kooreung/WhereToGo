package com.backend.service.post;

import com.backend.domain.place.Place;
import com.backend.domain.post.Banner;
import com.backend.domain.post.Post;
import com.backend.mapper.post.PostMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class PostService {

    private final PostMapper postMapper;
    @Autowired
    private HttpServletRequest request;

    final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    // 게시글 추가 | 작성 서비스
    public Integer add(Post post, Authentication authentication) {
        post.setMemberId(Integer.valueOf(authentication.getName()));
        postMapper.insert(post);
        return post.getPostId();
    }

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

    // 게시글 조회 서비스
    public Map<String, Object> get(Integer postId, Authentication authentication) {
        // 조회수 증가
        if (canIncrementView(postId)) {
            postMapper.incrementViewCount(postId);
            HttpSession session = request.getSession();
            session.setAttribute("lastViewTime_" + postId, Instant.now());
        }
        Post post = postMapper.selectById(postId);

        Map<String, Object> result = new HashMap<>();
        Map<String, Object> like = new HashMap<>();

        // 로그인 안하면 빈 하트 표기, 로그인 하면 좋아요 한 게시물 하트 표기
        if (authentication == null) {
            like.put("like", false);
        } else {
            int c = postMapper.selectLikeByPostIdAndMemberId(postId, authentication.getName());
            like.put("like", c == 1);
        }

        // 게시물 조회 시 좋아요 카운트 전송
        like.put("count", postMapper.selectCountLikeByBoardId(postId));
        result.put("like", like);
        result.put("post", post);

        // 게시물 조회 시 댓글 수 카운트 전송
        int commentCount = postMapper.selectCountCommentByBoardId(postId);
        result.put("commentCount", commentCount);

        return result;
    }

    //조회수 증가 세션 확인 서비스
    private boolean canIncrementView(Integer postId) {
        HttpSession session = request.getSession();
        Instant lastViewTime = (Instant) session.getAttribute("lastViewTime_" + postId);
        if (lastViewTime != null) {
            // 마지막 조회 시간부터 일정 시간(예: 1시간)이 지났는지 확인
            Instant now = Instant.now();
            Instant earliestTimeToIncrement = lastViewTime.plusSeconds(600);
            return now.isAfter(earliestTimeToIncrement);
        } else {
            // 이전에 조회 기록이 없는 경우에는 항상 조회수를 증가시킬 수 있도록 함
            return true;
        }
    }

    // 게시글 목록 서비스
    public Map<String, Object> list(Integer page, String searchType, String searchKeyword) {
        Map pageInfo = new HashMap();

        Integer countAllPost = postMapper.countAllPost(searchType, searchKeyword);
        Integer offset = (page - 1) * 5;
        Integer lastPageNumber = (countAllPost - 1) / 5 + 1;
        Integer leftPageNumber = ((page - 1) / 10) * 10 + 1;
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

    // 게시글 Top 3 인기글 목록 서비스
    public List<Post> postListOfBest() {
        return postMapper.selectPostOfBest();
    }

    // 게시글에서 선택한 장소 목록 서비스
    public List<Place> placeList(Integer postId) {
        return postMapper.getPlaceList(postId);
    }

    public List<Place> placeListData(String selectPlaces) {
        return postMapper.getPlaceListData(selectPlaces);
    }

    // 게시글 수정 서비스
    public void edit(Post post) {
        postMapper.update(post);
    }

    // 게시글 수정 시 권한 체크 서비스
    public boolean hasMemberIdAccess(Integer postId, Authentication authentication) {
        boolean scopeAdmin = authentication.getAuthorities().stream().map(a -> a.toString()).anyMatch(a -> a.equals("SCOPE_admin"));
        Post post = postMapper.selectById(postId);
        return post.getMemberId().equals(Integer.valueOf(authentication.getName())) || scopeAdmin;
    }

    // 게시글 삭제 서비스
    public void remove(Integer postId) {
        postMapper.deleteById(postId);
    }

    //좋아요 카운트 서비스
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

    //좋아요 목록 서비스
    public Map<String, Object> getLikeAllList(Integer memberId, Integer page, String searchType, String searchKeyword) {
        // 페이징 내용
        Map pageInfo = new HashMap();

        Integer countAllPost = postMapper.countAllLikePost(memberId, searchType, searchKeyword);
        System.out.println(countAllPost);
        Integer offset = (page - 1) * 5;
        Integer lastPageNumber = (countAllPost - 1) / 5 + 1;
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

        System.out.println(countAllPost);
        return Map.of("pageInfo", pageInfo, "postList", postMapper.selectLikeList(memberId, offset, searchType, searchKeyword));

    }

    //md 게시물 목록 서비스
    public Map<String, Object> mdlist(Map<String, Object> post, String searchType, String searchKeyword) {
        List<Post> posts = postMapper.selectMdPostList(post, searchType, searchKeyword);

        Map<String, Object> result = new HashMap<>();
        result.put("post", posts);
        return result;
    }


    public Map<String, Object> mdPickList() {
        List<Post> posts = postMapper.selectMdPickPostList();

        Map<String, Object> result = new HashMap<>();
        result.put("post", posts);

        return result;
    }

    // mdPick 추가(업데이트)
    public void mdPickPush(Integer postId, MultipartFile banner) throws IOException {
        postMapper.mdPickPush(postId);

        String key = String.format("prj3/banner/mdPostBanner/%s/%s", postId, banner.getOriginalFilename());
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();
        s3Client.putObject(objectRequest, RequestBody.fromInputStream(banner.getInputStream(), banner.getSize()));
        String bannerName = String.format("%s/%s", postId, banner.getOriginalFilename());
        postMapper.bannerUpdate(postId, bannerName);
    }

    // mdPick 삭제(업데이트)
    public void mdPickPop(Integer postId) {

        String key = String.format("prj3/banner/mdPostBanner/%s", postMapper.getMdBannerName(postId));
        DeleteObjectRequest objectRequest2 = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.deleteObject(objectRequest2);
        postMapper.mdPickPop(postId);
    }

    public String getMdPick(Integer postId) {
        return postMapper.getMdPick(postId);
    }

    // mdPick 한 게시물 개수
    public Integer mdPickCount() {
        return postMapper.getMdPickCount();
    }


    public void addBanner(String city, String link, MultipartFile file) throws IOException {

        String key = String.format("prj3/banner/localBanner/%s/%s", city, file.getOriginalFilename());
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();
        s3Client.putObject(objectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        String src = String.format("%s/%s", city, file.getOriginalFilename());
        postMapper.addBanner(city, link, src);
    }


    public List<Banner> getBannerList() {

        List<Banner> bannerList = postMapper.gatBannerList();
        for (Banner banner : bannerList) {
            String src = String.format("%s/banner/localBanner/%s", srcPrefix, banner.getBannerSrc());
            banner.setBannerSrc(src);
        }
        return bannerList;
    }


    public int removeBanner(Integer bannerId) {

        Banner banner = postMapper.getBannerSrcById(bannerId);

        String key = String.format("prj3/banner/localBanner/%s", banner.getBannerSrc());
        DeleteObjectRequest objectRequest2 = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.deleteObject(objectRequest2);
        return postMapper.deleteBannerById(bannerId);
    }
}
