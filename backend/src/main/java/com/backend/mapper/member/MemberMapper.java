package com.backend.mapper.member;

import com.backend.domain.member.Member;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MemberMapper {

    @Insert("""
            INSERT INTO Member (email, password, nick_name, name, gender, birth, address, phone_number)
            VALUES (#{email}, #{password}, #{nickName}, #{name}, #{gender}, #{birth}, #{address}, #{phoneNumber})
            """)
    int insert(Member member);


    @Select("""
            SELECT member_id, 
                   email, 
                   password, 
                   nick_name, 
                   name, 
                   gender, 
                   birth, 
                   address, 
                   phone_number
            FROM member
            where id = #{memberId};
            """)
    Member selectById(int memberId);


    @Select("""
            SELECT member_id, 
                   email, 
                   password, 
                   nick_name, 
                   name, 
                   gender, 
                   birth, 
                   address, 
                   phone_number
            FROM member
            order by member_id ASC
            """)
    List<Member> selectAll();


    @Update("""
            UPDATE member 
            SET
                password = #{password},
                nick_name = #{nickName}
            WHERE id = #{id}
            """)
    int update(Member member);


    @Delete("""
            DELETE FROM member
            where id = #{memberId}
            """)
    int deleteByid(Integer memberId);
}
