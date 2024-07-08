package com.backend.security;

import com.backend.domain.member.Member;
import com.backend.mapper.member.MemberMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// ... 기존의 import 문 ...

@RestController
public class TokenController {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private JwtUserDetailsService userDetailsService;
    @Autowired
    private MemberMapper memberMapper;

    // 리프레시 토큰을 받아 새로운 엑세스 토큰을 발급하는 엔드포인트
    @PostMapping("/api/token/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> request) {
        System.out.println("리프레쉬 검증");
        String refreshToken = request.get("refreshToken");
        Integer memberId = Integer.valueOf(request.get("memberId"));

        // 리프레시 토큰의 유효성 검증

        if (!jwtTokenUtil.validateRefreshToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid Refresh Token");
        }

        // 리프레시 토큰으로부터 사용자 정보 추출
        Member member = memberMapper.selectMemberByMemberId(memberId);

        // 새로운 엑세스 토큰 생성
        String newAccessToken = jwtTokenUtil.generateToken(member);
        System.out.println("새로운 엑세스 토큰 : " + newAccessToken);

        // 새로운 엑세스 토큰과 함께 리프레시 토큰 반환
        Map<String, String> response = new HashMap<>();
        response.put("accessToken", newAccessToken);
        response.put("refreshToken", refreshToken); // 기존 리프레시 토큰을 그대로 반환하거나 새로 갱신하여 반환 가능

        return ResponseEntity.ok(response);
    }
}

// JWT 토큰 관련 유틸리티 클래스
@Component
class JwtTokenUtil {

    @Autowired
    private JwtDecoder jwtDecoder;

    @Autowired
    private JwtEncoder jwtEncoder;
    @Autowired
    private MemberMapper memberMapper;

    // ... 기존의 메소드 ...

    public Boolean validateRefreshToken(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            System.out.println("검증결과 : " + jwt.getExpiresAt().isAfter(Instant.now()));
            return jwt.getExpiresAt().isAfter(Instant.now());
        } catch (JwtException e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        Jwt jwt = jwtDecoder.decode(token);
        System.out.println("name? : " + jwt);
        return (String) jwt.getClaims().get("email");
    }

    public String generateToken(Member member) {
        Instant now = Instant.now();

        List<String> authority = memberMapper.selectAuthorityByMemberId(member.getMemberId());

        String authorityString = authority.stream()
                .collect(Collectors.joining(" "));
        JwtClaimsSet accessClaims = JwtClaimsSet.builder()
                .issuer("self") // 토큰 발급자
                .issuedAt(now) // 토큰 발급 시간
                .expiresAt(now.plusSeconds(60 * 60 * 24)) // 토큰 만료 시간
                .subject(member.getMemberId().toString()) // unique 한 값 사용
                .claim("scope", authorityString) // 권한
                .claim("nickName", member.getNickName())
                .claim("email", member.getEmail())
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(accessClaims)).getTokenValue();
    }
}
