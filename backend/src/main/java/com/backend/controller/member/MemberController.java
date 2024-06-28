package com.backend.controller.member;

import com.backend.domain.member.Member;
import com.backend.service.member.EmailSenderService;
import com.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {
    final MemberService service;
    private final EmailSenderService senderService;

    // 회원가입
    @PostMapping("signup")
    public ResponseEntity signup(Member member,
                                 @RequestParam(value = "file", required = false)
                                 MultipartFile file) throws IOException {
        if (service.validate(member)) {
            service.addMember(member, file);
            int memberId = service.selectByLastMemberId(member);
            service.addAuthority(memberId);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    // 이메일 중복확인
    @GetMapping(value = "check", params = "email")
    public ResponseEntity checkEmail(@RequestParam("email") String email) {
        Member member = service.getByEmail(email);
        if (member == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(email);
    }

    // 닉네임 중복확인
    @GetMapping(value = "check", params = "nickName")
    public ResponseEntity checkNickName(@RequestParam("nickName") String nickName) {
        Member member = service.getByNickName(nickName);
        if (member == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(nickName);
    }

    // 로그인
    @PostMapping("login")
    public ResponseEntity login(@RequestBody Member member) {
        Map<String, Object> map = service.getToken(member);

        if (map == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(map);
    }

    // 임시 비밀번호 발급
    @PostMapping("sendEmail")
    public ResponseEntity<String> sendEmail(@RequestBody Member member) {
        String email = member.getEmail();
        Member memberEmail = service.getByEmail(email);
        if (memberEmail == null) {
            return ResponseEntity.notFound().build();
        }
        String tempPassword = senderService.createMail(email);
        return ResponseEntity.ok(tempPassword); // 임시 비밀번호 반환
    }


    @PostMapping("sendCode")
    public ResponseEntity<String> codeMail(@RequestBody Member member) {
        String email = member.getEmail();
        Member memberEmail = service.getByEmail(email);
        if (memberEmail == null) {
            return ResponseEntity.notFound().build();
        }
        String tempCode = senderService.createCode(email);
        return ResponseEntity.ok(tempCode); // 코드 반환
    }

    // 회원 수정
    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity editMemberInfo(Member member,
                                         @RequestParam(value = "file", required = false)
                                         MultipartFile newProfile, Authentication authentication) throws IOException {
        if (service.hasAccessModify(member, authentication)) {
            System.out.println(member.getPassword());
            Map<String, Object> result = service.modifyMemberInfo(member, authentication, newProfile);
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
//        return ResponseEntity.ok().build();

    }


    // 회원 목록 보기
    @GetMapping("list")
    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public Map<String, Object> memberList(@RequestParam(defaultValue = "1") Integer page,
                                          @RequestParam(value = "type", required = false) String searchType,
                                          @RequestParam(value = "keyword", defaultValue = "") String keyword) {
        return service.getMemberList(page, searchType, keyword);
    }

    // 마이페이지
    @GetMapping("memberinfo")
    public ResponseEntity memberInfo(Authentication authentication) {
        Integer memberId = Integer.parseInt(authentication.getName());
        if (!service.hasAccess(memberId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<String, Object> dbmember = service.getMemberInfoByMemberId(memberId);

        if (dbmember == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(dbmember);
        }
    }

    // 유저정보, 아이디로 들어가기
    @GetMapping("{memberId}")
    public ResponseEntity memberInfoByMemberId(@PathVariable Integer memberId) {
        Map<String, Object> member = service.getMemberInfoByMemberId(memberId);
        if (member == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok().body(member);
        }
    }


    //탈퇴하기, 어드민이 유저 삭제하기기능
    @DeleteMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity MemberDelete(
            @RequestBody Member member,
            Authentication authentication) {

        //삭제 요청을 본인이 보냈거나 or 권한이 어드민이라면 삭제
        if (service.hasAccess(member, authentication) || authentication.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("SCOPE_admin"))) {
            service.deleteMember(member.getMemberId());
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

}
