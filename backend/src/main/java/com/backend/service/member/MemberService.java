package com.backend.service.member;

import com.backend.NicknameGenerator.NickNameCreator;
import com.backend.domain.member.Member;
import com.backend.domain.member.MemberProfile;
import com.backend.mapper.comment.CommentMapper;
import com.backend.mapper.member.MemberMapper;
import com.backend.mapper.post.PostMapper;
import com.backend.service.post.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MemberService {

    private final MemberMapper mapper;
    final BCryptPasswordEncoder passwordEncoder;
    final JwtEncoder jwtEncoder;
    //    private MemberProfile memberProfile;
    final S3Client s3Client;
    private final PostMapper postMapper;
    private final PostService postService;
    private final CommentMapper commentMapper;
    private final NickNameCreator nickNameCreator;


    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    //유저 가입
    public void addMember(Member member, MultipartFile newProfile) throws IOException {
        //입력한 패스워드 암호화후 저장
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        //데이터베이스에 추가
        mapper.insertMember(member);

        Member dbmember = getByEmail(member.getEmail());

        //가입시 입력한 사진파일이 있는지 확인
        if (newProfile != null && !newProfile.isEmpty()) {
            // 이미지가 있는 경우 S3에 저장

            String key = String.format("prj3/member/%s/%s", dbmember.getMemberId(), newProfile.getOriginalFilename());
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();
            s3Client.putObject(objectRequest, RequestBody.fromInputStream(newProfile.getInputStream(), newProfile.getSize()));
            //member 데이터베이스에 사진이름 저장
            mapper.updateProfileName(dbmember.getMemberId(), newProfile.getOriginalFilename());
        } else {
            // 선택한 프로필 이미지가 없는 경우 기본 프로필 이미지 사용
            //이미 s3에 저장돼있는 기본사진 가져오는 코드
            String defaultProfileKey = "prj3/defaultProfile.png";
            GetObjectRequest defaultProfileRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(defaultProfileKey)
                    .build();
            ResponseInputStream<GetObjectResponse> defaultProfileResponse = s3Client.getObject(defaultProfileRequest);

            //가져온 기본사진을 prj3/member/멤버아이디/defaultProfile.png 경로에 저장
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(String.format("prj3/member/%s/defaultProfile.png", dbmember.getMemberId()))
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();
            s3Client.putObject(objectRequest, RequestBody.fromInputStream(defaultProfileResponse, defaultProfileResponse.response().contentLength()));

            //기본사진 이름으로 저장
            mapper.updateProfileName(dbmember.getMemberId(), "defaultProfile.png");
        }
    }

    //이메일 있는지 확인
    public Member getByEmail(String email) {
        return mapper.selectByEmail(email);
    }

    //닉네임 있는지 확인
    public Member getByNickName(String nickName) {
        return mapper.selectByNickName(nickName);
    }


    public boolean hasAccess(Integer id, Authentication authentication) {
        boolean self = authentication.getName().equals(id.toString());

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("SCOPE_admin"));

        return self || isAdmin;
    }

    public boolean hasAccess(Member member, Authentication authentication) {
        if (!member.getMemberId().toString().equals(authentication.getName())) {
            return false;
        }

        Member dbMember = mapper.selectMemberByMemberId(member.getMemberId());

        if (dbMember == null) {
            return false;
        }

        return passwordEncoder.matches(member.getPassword(), dbMember.getPassword());
    }

    //어드민이 유저관리 페이지에서 해당 멤버의 개인정보를 볼때 사용
    public Map<String, Object> getMemberInfoByMemberId(Integer memberId) {
        Map<String, Object> result = new HashMap<>();
        Member dbmember = mapper.selectMemberByMemberId(memberId);
        result.put("member", dbmember);

        MemberProfile memberProfile = new MemberProfile();
        memberProfile.setName(mapper.getProfileNameByMemberId(memberId));
        String src = STR."\{srcPrefix}/member/\{dbmember.getMemberId()}/\{memberProfile.getName()}";
        memberProfile.setSrc(src);
        result.put("profile", memberProfile);

        return result;
    }

    public Map<String, Object> getMemberList(Integer page, String searchType, String keyword) {
        Map pageInfo = new HashMap();
        Integer countAll = mapper.countAllWithSearch(searchType, keyword);

        Integer offset = (page - 1) * 10;
        Integer lastPageNumber = (countAll - 1) / 10 + 1;
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

        List<Member> members = mapper.selectMemberAllPaging(offset, searchType, keyword);
        for (Member member : members) {
            int memberId = member.getMemberId();
            String authType = mapper.getAuthTypeByMemberId(memberId);
            member.setAuthType(authType);
        }

        return Map.of("pageInfo", pageInfo,
                "memberList", members);
    }

    public Map<String, Object> WithdrawnMember() {
        Map<String, Object> result = new HashMap<>();
        List<Member> withdrawnMembers = mapper.selectWithdrawnMember();
        result.put("withdrawnMembers", withdrawnMembers);
        return result;
    }


    //개인정보 수정할때 쓰는 권한확인 코드
    public boolean hasAccessModify(Member member, Authentication authentication) {
        if (!authentication.getName().equals(member.getMemberId().toString())) {
            return false;
        }
        Member dbMember = mapper.selectMemberByMemberId(member.getMemberId());
        if (dbMember == null) {
            return false;
        }
        if (member.getOldPassword().isEmpty() && !member.getPasswordCheck().isEmpty()) {
            return false;
        }
        if (!member.getOldPassword().isEmpty()) {
            if (!passwordEncoder.matches(member.getOldPassword(), dbMember.getPassword())) {
                return false;
            }
        }
        return true;
    }

    //개인정보 수정코드
    public Map<String, Object> modifyMemberInfo(Member member, Authentication authentication, MultipartFile newProfile) throws IOException {
        if (member.getPassword() != null && member.getPassword().length() > 0) {
            // 패스워드가 입력되었으니 바꾸기
            member.setPassword(passwordEncoder.encode(member.getPassword()));
        } else {
            // 입력 안됐으니 기존 값으로 유지
            Member dbMember = mapper.selectMemberByMemberId(member.getMemberId());
            member.setPassword(dbMember.getPassword());
        }


        if (newProfile != null && !newProfile.isEmpty()) {
            //사진 입력됐으니 기존 s3경로에 새로운 사진 입력
            String key = STR."prj3/member/\{member.getMemberId()}/\{newProfile.getOriginalFilename()}";
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();
            s3Client.putObject(objectRequest, RequestBody.fromInputStream(newProfile.getInputStream(), newProfile.getSize()));

            //기존의 사진은 삭제
            String prevProfileName = mapper.getProfileNameByMemberId(member.getMemberId());
            String key2 = STR."prj3/member/\{member.getMemberId()}/\{prevProfileName}";
            DeleteObjectRequest objectRequest2 = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key2)
                    .build();
            s3Client.deleteObject(objectRequest2);
            //새로운 이미지 이름으로 데이터베이스 업데이트
            mapper.profileUpdate(member.getMemberId(), newProfile.getOriginalFilename());
        }
        //변경사항 업데이트
        mapper.update(member);

        String token = "";

        Jwt jwt = (Jwt) authentication.getPrincipal();
        Map<String, Object> claims = jwt.getClaims();
        JwtClaimsSet.Builder jwtClaimsSetBuilder = JwtClaimsSet.builder();
        claims.forEach(jwtClaimsSetBuilder::claim);
        jwtClaimsSetBuilder.claim("nickName", member.getNickName());

        JwtClaimsSet jwtClaimsSet = jwtClaimsSetBuilder.build();
        token = jwtEncoder.encode(JwtEncoderParameters.from(jwtClaimsSet)).getTokenValue();
        return Map.of("token", token);
    }

    public void deleteMember(Integer memberId) {
        String fileName = mapper.getProfileNameByMemberId(memberId);
        //탈퇴시 게시물 삭제 안할것이기 때문에 댓글,회원정보만 삭제(정확히는 개인정보를 기본 정보로 업데이트)

        //s3에서 유저사진 삭제
        String key = STR."prj3/member/\{memberId}/\{fileName}";
        DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3Client.deleteObject(objectRequest);

        //탈퇴한 유저의 닉네임을 램덤으로 생성해서 저장
        String randomNickName = nickNameCreator.generateUniqueNicknameAndSave();
//        List<Post> postList = postMapper.selectAllPost(memberId);

        mapper.deleteByid(memberId, randomNickName);

        //멤버 프로필 db에서 삭제
        mapper.deleteFileByMemberId(memberId);
    }

    public boolean validate(Member member) {
        if (member.getEmail() == null || member.getEmail().isBlank()) {
            return false;
        }

        if (member.getPassword() == null || member.getPassword().isBlank()) {
            return false;
        }

        if (member.getName() == null || member.getName().isBlank()) {
            return false;
        }

        if (member.getNickName() == null || member.getNickName().isBlank()) {
            return false;
        }

        if (member.getGender() == null || member.getGender().isBlank()) {
            return false;
        }

        if (member.getBirth() == null) {
            return false;
        }

        if (member.getPhoneNumber() == null || member.getPhoneNumber().isBlank()) {
            return false;
        }

        if (member.getAddress() == null || member.getAddress().isBlank()) {
            return false;
        }

        return true;
    }

    public Map<String, Object> getToken(Member member) {

        Map<String, Object> result = null;

        // db 에서 해당 email 가져와서
        Member db = mapper.selectByEmail(member.getEmail());

        // 해당 email 이 null 이 아니면 실행
        if (db != null) {
            // db 에 저장된 password 와 사용자가 입력한 password 를 비교해서 같으면 실행
            if (passwordEncoder.matches(member.getPassword(), db.getPassword())) {
                result = new HashMap<>();
                String token = "";
                // 현재 시간 가져옴
                Instant now = Instant.now();

                List<String> authority = mapper.selectAuthorityByMemberId(db.getMemberId());

                String authorityString = authority.stream()
                        .collect(Collectors.joining(""));


                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self") // 토큰 발급자
                        .issuedAt(now) //  토큰 발급 시간
                        .expiresAt(now.plusSeconds(60 * 60 * 24 * 7)) // 토큰 만료 시간
                        .subject(db.getMemberId().toString()) // unique 한 값 사용
                        .claim("scope", authorityString) // 권한
                        .claim("nickName", db.getNickName())
                        .claim("email", db.getEmail())
                        .build();

                // 인코딩 된 jwk 변수에 할당
                token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

                result.put("token", token);
            }
        }

        return result;
    }

    public int selectByLastMemberId(Member member) {
        return mapper.selectByLastMemberId(member);
    }

    public void addAuthority(int memberId) {
        mapper.addAuthority(memberId);
    }


    public void updateAuthType(Integer memberId, String authType) {

        mapper.updateAuthTypeByMemberId(memberId, authType);
    }

    public void hardDeleteMember(Integer memberId) {
        mapper.hardDeleteByMemberId(memberId);
    }
}
