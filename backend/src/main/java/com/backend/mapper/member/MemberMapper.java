package com.backend.mapper.member;

import com.backend.domain.member.Member;
import com.backend.domain.member.MemberProfile;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MemberMapper {

    @Insert("""
            INSERT INTO Member (email, password, nick_name, name, gender, birth, address, phone_number)
            VALUES (#{email}, #{password}, #{nickName}, #{name}, #{gender}, #{birth}, #{address}, #{phoneNumber})
            """)
    int insert(Member member);

    // 이메일 중복 체크
    @Select("""
            SELECT *
            FROM Member
            WHERE email = #{email}
            """)
    Member selectByEmail(String email);

    // 닉네임 중복 체크
    @Select("""
            SELECT *
            FROM Member
            WHERE nick_name = #{nickName}
            """)
    Member selectByNickName(String nickName);

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

    @Insert("""
            insert into profile(member_id,profile_name)
            values(#{memberId},#{profileName})
            """)
    int profileAdd(Integer memberId, String profileName);

    @Select("""
            SELECT name
            from Profile
            where member_id = #{memberId}
            """)
    String getProfileNameByMemberId(Integer memberId);

    @Delete("""
            DELETE FROM profile
            WHERE member_id=#{boardId}
              AND name=#{fileName}
            """)
    int deleteFileByBoardIdAndName(Integer boardId, String fileName);


    @Select("""
            SELECT * 
            from profile 
            where member_id = #{memberId}
            """)
    MemberProfile getProfileByMemberId(int memberId);


    @Update("""
            update profile
            set profile_name = #{profileName}
            where member_id = #{memberId}
            """)
    int profileUpdate(Integer memberId, String profileName);
}
