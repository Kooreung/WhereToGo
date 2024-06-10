package com.backend.controller.member;

import com.backend.domain.member.Member;
import com.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

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
    public ResponseEntity edit(@RequestBody Member member,
                     Authentication authentication) {
        if(service.hasAccessModify(member,authentication)){
            Map<String, Object> result = service.modify(member, authentication);
            return ResponseEntity.ok(result);
        }else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

    }

    // 회원 삭제
    @DeleteMapping("{id}")
    public void delete() {

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
        if(!service.hasAccess(memberId,authentication)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Member member = service.getById(memberId);

        if(member == null){
            return ResponseEntity.notFound().build();
        }else{
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
