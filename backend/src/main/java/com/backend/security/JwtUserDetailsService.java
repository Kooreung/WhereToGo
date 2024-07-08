package com.backend.security;

import com.backend.domain.member.Member;
import com.backend.mapper.member.MemberMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    @Autowired
    private MemberMapper memberMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = memberMapper.selectByEmail(username);

        return new User(member.getEmail(), member.getPassword(), getAuthority(member));
    }

    private Collection<? extends GrantedAuthority> getAuthority(Member member) {
        // 권한 정보를 GrantedAuthority 객체로 변환하여 반환
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }


}
