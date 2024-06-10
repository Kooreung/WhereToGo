package com.backend.service.member;

import com.backend.domain.member.Member;
import com.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class MemberService {

    final MemberMapper mapper;
    final BCryptPasswordEncoder passwordEncoder;

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
