package com.backend.mapper.member;

import com.backend.domain.member.Member;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {

    @Insert("""
            INSERT INTO member (email, password, nick_name, name, gender, birth, address, phone_number)
            VALUES (#{email}, #{password}, #{nickName}, #{name}, #{gender}, #{birth}, #{address}, #{phoneNumber})
            """)
    int insert(Member member);
}
