package com.backend.service.member;

import com.backend.domain.member.Member;
import com.backend.domain.member.MemberProfile;
import com.backend.mapper.member.MemberMapper;
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

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MemberService {

    private final MemberMapper mapper;
    final BCryptPasswordEncoder passwordEncoder;
    final JwtEncoder jwtEncoder;
    private MemberProfile memberProfile;
    final S3Client s3Client;


    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public void add(Member member, File newProfile) throws IOException {
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        mapper.insert(member);

        if (newProfile != null && !newProfile.isEmpty()) {
            //가입시 선택한 이미지가 있다면 해당 이미지로 s3에 저장후 사용
            String key = STR."prj3/\{member.getMemberId()}/\{newProfile.getOriginalFilename()}";
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();
            s3Client.putObject(objectRequest,
                    RequestBody.fromInputStream(newProfile, newProfile.));
            mapper.profileAdd(member.getMemberId(), newProfile.getOriginalFilename());
        } else if (newProfile == null) {
            // else 일때 s3에 저장된 기본 프로필 사진을 가져와서 사용하려면 다음과 같이 할 수 있습니다:

            String defaultProfileKey = "prj3/defaultProfile";
// 기본 프로필 사진을 가져오기 위한 GetObjectRequest 생성
            GetObjectRequest defaultProfileRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(defaultProfileKey)
                    .build();
// s3로부터 기본 프로필 사진을 가져옴
            ResponseInputStream<GetObjectResponse> defaultProfileResponse = s3Client.getObject(defaultProfileRequest);

// 가져온 기본 프로필 사진을 member의 프로필로 저장
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key("prj3/" + member.getMemberId() + "/defaultProfile")
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();
            s3Client.putObject(objectRequest, RequestBody.fromInputStream(defaultProfileResponse, defaultProfileResponse.response().contentLength()));

// mapper를 사용하여 member의 프로필 정보를 업데이트
            mapper.profileAdd(member.getMemberId(), "defaultProfile");

        }

    }


    public Member getByEmail(String email) {
        return mapper.selectByEmail(email);
    }

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

        Member dbMember = mapper.selectById(member.getMemberId());

        if (dbMember == null) {
            return false;
        }

        return passwordEncoder.matches(member.getPassword(), dbMember.getPassword());
    }

    public Map<String, Object> getById(int memberId) {
        Map<String, Object> result = new HashMap<>();
        Member member = mapper.selectById(memberId);
        result.put("member", member);

        MemberProfile memberProfile = new MemberProfile();
        memberProfile.setName(mapper.getProfileByMemberId(memberId));
        String src = STR."prj3/\{member.getMemberId()}/\{memberProfile.getName()}";
        memberProfile.setSrc(src);
        result.put("profile", memberProfile);

        return result;
    }

    public List<Member> memberList() {
        return mapper.selectAll();
    }

    public boolean hasAccessModify(Member member, Authentication authentication) {
        if (!authentication.getName().equals(member.getMemberId().toString())) {
            return false;
        }
        Member dbMember = mapper.selectById(member.getMemberId());
        if (dbMember == null) {
            return false;
        }

        if (!passwordEncoder.matches(member.getPassword(), dbMember.getPassword())) {
            return false;
        }
        return true;
    }

    public Map<String, Object> modify(Member member, Authentication authentication, MultipartFile newProfile) {
        if (member.getPassword() != null && member.getPassword().length() > 0) {
            // 패스워드가 입력되었으니 바꾸기
            member.setPassword(passwordEncoder.encode(member.getPassword()));
        } else {
            // 입력 안됐으니 기존 값으로 유지
            Member dbMember = mapper.selectById(member.getMemberId());
            member.setPassword(dbMember.getPassword());
        }

        if (newProfile != null && !newProfile.isEmpty()) {
            String key = STR."prj3/\{member.getMemberId()}/\{newProfile.getOriginalFilename()}";
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();
            mapper.profileUpdate(member.getMemberId(), newProfile.getOriginalFilename());

            String prevProfileName = mapper.getProfileNameByMemberId(member.getMemberId());
            String key2 = STR."prj3/\{member.getMemberId()}/\{prevProfileName}";
            DeleteObjectRequest objectRequest2 = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(objectRequest2);
            mapper.deleteFileByBoardIdAndName(member.getMemberId(), prevProfileName);
        }
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

    public void delete(Integer memberId) {
        String fileName = mapper.getProfileNameByMemberId(memberId);
        //탈퇴시 게시물 삭제 안할것이기 때문에 댓글,회원정보만 삭제
        String key = STR."prj3/\{memberId}/\{fileName}";
        DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3Client.deleteObject(objectRequest);
        mapper.deleteByid(memberId);
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
}
