package com.backend.mapper.member;

import com.backend.domain.member.Member;
import org.apache.ibatis.annotations.*;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface MemberMapper {

    @Insert("""
            INSERT INTO member (email, password, nickname, name, gender, birth, address, phonenumber)
            VALUES (#{email}, #{password}, #{nickName}, #{name}, #{gender}, #{birth}, #{address}, #{phoneNumber})
            """)
    int insert(Member member);

    // 이메일 중복 체크
    @Select("""
            SELECT *
            FROM member
            WHERE email = #{email}
            """)
    Member selectByEmail(String email);

    // 닉네임 중복 체크
    @Select("""
            SELECT *
            FROM member
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
                   phoneNumber,
                   inserted
            FROM member
            where memberId = #{memberId};
            """)
    Member selectById(int memberId);

    @Update("""
            UPDATE member 
            SET
                password = #{password},
                nickname = #{nickName}
            WHERE memberid = #{memberId}
            """)
    int update(Member member);

    @Update("""
            UPDATE member
            SET email = '1',
                password = '1',
                nickname = #{randomNickName},
                name = '탈퇴유저',
                birth = '1999-01-01',
                address = '데이터 조각',
                phonenumber = '01012341234'
            WHERE memberid = #{memberId}
                        """)
    int deleteByid(Integer memberId, String randomNickName);

    @Insert("""
            insert into profile(memberid, profilename)
            values(#{memberId},#{profileName})
            """)
    int profileAdd(Integer memberId, String profileName);

    @Select("""
            SELECT profilename
            from profile
            where memberid = #{memberId}
            """)
    String getProfileNameByMemberId(Integer memberId);

    @Delete("""
            DELETE FROM profile
            WHERE memberid=#{boardId}
              AND profilename=#{fileName}
            """)
    int deleteFileByBoardIdAndName(Integer boardId, String fileName);


    @Select("""
            SELECT profilename 
            from profile
            where memberid = #{memberId}
            """)
    String getProfileByMemberId(int memberId);


    @Update("""
            update profile
            set profilename = #{profileName}
            where memberid = #{memberId}
            """)
    int profileUpdate(Integer memberId, String profileName);

    // email 받아서 encoding 된 임시 비밀번호로 password update
    @Update("""
                UPDATE member
                SET password = #{pw}
                WHERE email = #{email}
            """)
    int findByEmailAndUpdatePassword(String email, String pw);

    @Select("""
            SELECT authtype
            FROM authority
            WHERE memberid=${memberId}
            """)
    List<String> selectAuthorityByMemberId(Integer memberId);

    // 탈퇴 시 랜덤 닉네임 중복 확인
    @Select("""
            SELECT COUNT(*) FROM member
            WHERE nickname=#{nickName}
            """)
    boolean isUsernameExists(String nickname);

    // 가입 시 유저의 멤버 ID 가져오기
    @Select("""
            SELECT memberId
            FROM member
            WHERE email = #{email};
            """)
    int selectByLastMemberId(Member member);

    // 가입 시 유저 권한 부여
    @Insert("""
            INSERT INTO authority (memberId, authtype) 
            VALUES (#{memberId}, 'user') 
            """)
    int addAuthority(int memberId);

    // 회원 리스트 admin 권한 안나오면서 조회 및 검색
    @Select("""
        <script>
        SELECT m.memberId, m.email, m.nickname
        FROM member m JOIN authority a
        ON m.memberId = a.memberId
        <trim prefix="WHERE" prefixOverrides="OR">
                   <if test="searchType != null">
                       <bind name="pattern" value="'%' + keyword + '%'" />
                       <if test="searchType == 'all' || searchType == 'email'">
                           OR m.email LIKE #{pattern}
                            AND a.authtype &lt;&gt; 'admin'
                       </if>
                       <if test="searchType == 'all' || searchType == 'nickName'">
                           OR m.nickname LIKE #{pattern}
                            AND a.authtype &lt;&gt; 'admin'
                       </if>
                   </if>
               </trim>
        ORDER BY m.memberId DESC
        LIMIT #{offset}, 10
        </script>
        """)
    List<Member> selectMemberAllPaging(Integer offset, String searchType, String keyword);

    @Select("""
    SELECT COUNT(*) 
    FROM member m JOIN authority a
    ON m.memberId = a.memberId
    WHERE authtype <> 'admin'
    """)
    Integer countAll();

    @Select("""
<script>
SELECT COUNT(m.memberId)
FROM member m JOIN authority a
ON m.memberId = a.memberId
    <trim prefix="WHERE" prefixOverrides="OR">
        <if test="searchType != null">
            <bind name="pattern" value="'%' + keyword + '%'" />
            <if test="searchType == 'all' || searchType == 'email'">
                OR m.email LIKE #{pattern}
                AND a.authtype &lt;&gt; 'admin'
            </if>
            <if test="searchType == 'all' || searchType == 'nickName'">
                OR m.nickname LIKE #{pattern}
                AND a.authtype &lt;&gt; 'admin'
            </if>
        </if>
    </trim>
</script>
""")
    Integer countAllWithSearch(String searchType, String keyword);
}
