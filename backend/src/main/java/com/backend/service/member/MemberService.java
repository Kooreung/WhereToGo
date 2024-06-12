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
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.time.Instant;
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
    //    private MemberProfile memberProfile;
    final S3Client s3Client;

    @Value("${aws.s3.bucket.name}")
    String bucketName;

    @Value("${image.src.prefix}")
    String srcPrefix;

    public void add(Member member) {
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        mapper.insert(member);
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

        MemberProfile file = mapper.getProfileByMemberId(memberId);
        result.put("profile", file);

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
            mapper.profileUpdate(member.getMemberId());

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

                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self") // 토큰 발급자
                        .issuedAt(now) //  토큰 발급 시간
                        .expiresAt(now.plusSeconds(60 * 60 * 24 * 7)) // 토큰 만료 시간
                        .subject(db.getMemberId().toString()) // unique 한 값 사용
                        .claim("scope", "") // 권한
                        .claim("nickName", db.getNickName())
                        .build();

                // 인코딩 된 jwk 변수에 할당
                token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

                result.put("token", token);
            }
        }

        return result;
    }
}
