package com.backend.mapper.member;

import com.backend.domain.member.Member;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface MemberMapper {

    @Insert("""
            INSERT INTO Member (email, password, nickname, name, gender, birth, address, phonenumber)
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
            WHERE nickname = #{nickName}
            """)
    Member selectByNickName(String nickName);

    @Select("""
            SELECT memberId, 
                   email, 
                   password, 
                   nickName, 
                   name, 
                   gender, 
                   birth, 
                   address, 
                   phoneNumber
            FROM Member
            where memberId = #{memberId};
            """)
    Member selectById(int memberId);

    @Select("""
            SELECT memberid, 
                   email, 
                   password, 
                   nickname, 
                   name, 
                   gender, 
                   birth, 
                   address, 
                   phonenumber
            FROM member
            order by memberid ASC
            """)
    List<Member> selectAll();

    @Update("""
            UPDATE member 
            SET
                password = #{password},
                nickname = #{nickName}
            WHERE memberid = #{id}
            """)
    int update(Member member);

    @Delete("""
            DELETE FROM member
            where memberid = #{memberId}
            """)
    int deleteByid(Integer memberId);

    @Insert("""
            insert into Profile(memberid,profilename)
            values(#{memberId},#{profileName})
            """)
    int profileAdd(Integer memberId, String profileName);

    @Select("""
            SELECT name
            from Profile
            where memberid = #{memberId}
            """)
    String getProfileNameByMemberId(Integer memberId);

    @Delete("""
            DELETE FROM profile
            WHERE memberid=#{boardId}
              AND name=#{fileName}
            """)
    int deleteFileByBoardIdAndName(Integer boardId, String fileName);


    @Select("""
            SELECT profilename 
            from Profile 
            where memberid = #{memberId}
            """)
    String getProfileByMemberId(int memberId);


    @Update("""
            update profile
            set profilename = #{profileName}
            where memberid = #{memberId}
            """)
    int profileUpdate(Integer memberId, String profileName);
}
