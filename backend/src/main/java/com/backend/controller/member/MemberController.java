package com.backend.controller.member;

import com.backend.domain.member.Member;
import com.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {
    final MemberService service;

    // 회원가입
    @PostMapping("signup")
    public void signup(@RequestBody Member member) {
        service.add(member);
    }

    // 이메일 중복확인
    @GetMapping(value = "check", params = "email")
    public void CheckEmail() {

    }

    // 닉네임 중복확인
    @GetMapping(value = "check", params = "nickName")
    public void CheckNickName() {

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
