package com.backend.controller.member;

import com.backend.domain.member.Member;
import com.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {
    final MemberService service;

    // 회원가입
    @PostMapping("signup")
    public ResponseEntity signup(@RequestBody Member member) {
        if (service.validate(member)) {
            service.add(member);
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
    public void edit() {

    }

    // 회원 삭제
    @DeleteMapping("{id}")
    public void delete() {

    }

    // 회원 목록 보기
    @GetMapping("list")
    public void list() {

    }

    // 회원 정보 보기
    @GetMapping("{memberId}")
    public void getMemberId() {

    }

}
