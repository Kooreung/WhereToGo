package com.backend.controller.member;

import com.backend.domain.member.Member;
import com.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {
    final MemberService service;

    // 회원가입
    @PostMapping("signup")
    public ResponseEntity signup(@RequestBody Member member,
                                 @RequestParam(value = "addFileList", required = false)
                                 MultipartFile newProfile) throws IOException {
        if (service.validate(member)) {
            service.add(member, newProfile);
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
    public ResponseEntity CheckNickName(@RequestParam("nickName") String nickName) {
        Member member = service.getByNickName(nickName);
        if (member == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(nickName);
    }

    // 로그인
    @PostMapping("login")
    public void login() {
    }

    // 회원 수정
    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity edit(@RequestBody Member member,
                               @RequestParam(value = "addFileList", required = false)
                               MultipartFile newProfile, Authentication authentication) {
        if (service.hasAccessModify(member, authentication)) {
            Map<String, Object> result = service.modify(member, authentication, newProfile);
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }


    // 회원 목록 보기
    @GetMapping("list")
    @PreAuthorize("hasAuthority('admin')")
    public List<Member> list() {
        return service.memberList();
    }

    // 회원 정보 보기
    @GetMapping("{memberId}")
    public ResponseEntity getMemberId(@PathVariable int memberId,
                                      Authentication authentication) {
        if (!service.hasAccess(memberId, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<String, Object> member = service.getById(memberId);

        if (member == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(member);
        }
    }

    @DeleteMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity delete(
            @RequestBody Member member,
            Authentication authentication) {
        if (service.hasAccess(member, authentication)) {
            service.delete(member.getMemberId());
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

}
