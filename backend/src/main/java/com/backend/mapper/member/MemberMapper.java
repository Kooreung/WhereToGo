package com.backend.mapper.member;

import com.backend.domain.member.Member;
import org.apache.ibatis.annotations.*;

import java.security.Timestamp;
import java.util.List;

@Mapper
public interface MemberMapper {

    //유저 가입기능
    @Insert("""
            INSERT INTO member (email, password, nickname, name, gender, birth, address, phonenumber)
            VALUES (#{email}, #{password}, #{nickName}, #{name}, #{gender}, #{birth}, #{address}, #{phoneNumber})
            """)
    int insertMember(Member member);

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

    //멤버 정보 멤버 아이디로 찾는 기능
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
    Member selectMemberByMemberId(int memberId);

    //유저 닉네임, 비밀번호 업데이트에 사용
    @Update("""
            UPDATE member 
            SET
                password = #{password},
                nickname = #{nickName}
            WHERE memberid = #{memberId}
            """)
    int update(Member member);

    //유저 임시삭제 상태 유저가 작성한 게시물, 댓글은 남아있음 유저 상태를 업데이트해 삭제처럼 보이게함
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

    //프로필 업데이트, 가입시 선택한 프로필 넣음
    @Insert("""
            insert into profile(memberid, profilename)
            values(#{memberId},#{profileName})
            """)
    int updateProfileName(Integer memberId, String profileName);

    //프로필이름 가져오는 기능
    @Select("""
            SELECT profilename
            from profile
            where memberid = #{memberId}
            """)
    String getProfileNameByMemberId(Integer memberId);

    //프로필 삭제
    @Delete("""
            DELETE FROM profile
            WHERE memberid=#{boardId}
            """)
    int deleteFileByMemberId(Integer memberId);


    //프로필 업데이트
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
            SELECT m.memberId, m.email, m.nickname, m.inserted
            FROM member m JOIN authority a
            ON m.memberId = a.memberId
            <where>
                a.authtype &lt;&gt; 'admin'
                AND m.email &lt;&gt; '1'
                <if test="searchType != null">
                    <bind name="pattern" value="'%' + keyword + '%'" />
                    <choose>
                        <when test="searchType == 'all' || searchType == 'email'">
                            AND (m.email LIKE #{pattern} OR m.nickname LIKE #{pattern})
                        </when>
                        <when test="searchType == 'all' || searchType == 'nickName'">
                            AND (m.nickname LIKE #{pattern} OR m.email LIKE #{pattern})
                        </when>
                    </choose>
                </if>
            </where>
            ORDER BY m.memberId DESC
            LIMIT #{offset}, 10
            </script>
            """)
    List<Member> selectMemberAllPaging(Integer offset, String searchType, String keyword);


    //탈퇴한 유저 조회
    @Select("""
            SELECT * from member
            where email = '1'
            """)
    List<Member> selectWithdrawnMember();

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
                <where>
                a.authtype &lt;&gt; 'admin'
                AND m.email &lt;&gt; '1'
                <if test="searchType != null">
                    <bind name="pattern" value="'%' + keyword + '%'" />
                    <choose>
                        <when test="searchType == 'all' || searchType == 'email'">
                            AND (m.email LIKE #{pattern} OR m.nickname LIKE #{pattern})
                        </when>
                        <when test="searchType == 'all' || searchType == 'nickName'">
                            AND (m.nickname LIKE #{pattern} OR m.email LIKE #{pattern})
                        </when>
                    </choose>
                </if>
            </where>
            </script>
            """)
    Integer countAllWithSearch(String searchType, String keyword);

    //멤버의 권한확인
    @Select("""
            SELECT authtype from authority
            where memberid = #{memberId}
            """)
    String getAuthTypeByMemberId(int memberId);

    //멤버의 권한변경
    @Update("""
            UPDATE authority
            SET authtype=#{authType}
            where memberid=#{memberId}
            """)
    int updateAuthTypeByMemberId(Integer memberId, String authType);


    //유저 완전삭제 게시물, 댓글, 좋아요, 프로필 모든정보 삭제
    @Delete("""
            DELETE FROM member
            where memberid=#{memberId}
            """)
    int hardDeleteByMemberId(Integer memberId);

    // 이메일 발송하면서 토큰 저장
    @Insert("""
            INSERT INTO certifytoken (memberId, token)
            VALUES (#{memberId}, #{token})
            """)
    int tokenSave(Integer memberId, String token);

    // 해당 멤버의 토큰 가져오기
    @Select("""
            SELECT memberId
            FROM certifytoken
            WHERE token = #{token}
            """)
    Integer getMemberIdByToken(String token);

    // 인증 링크 누르면 권한 바꾸기
    @Update("""
            UPDATE authority
            SET authtype='certifyUser'
            WHERE memberid=#{memberId}
            """)
    int authCertify(Integer memberId);

    // 토큰이 있는경우 토큰 업데이트
    @Update("""
            UPDATE certifytoken
            SET token=#{token},
            createdAt = CURRENT_TIMESTAMP,
            expirationTime = TIMESTAMPADD(SECOND , 300, CURRENT_TIMESTAMP)
            WHERE memberid=#{memberId}
            """)
    int tokenUpdate(Integer memberId, String token);

    // 해당 멤버가 토큰 가지고있는지 없는지
    @Select("""
            SELECT memberId
            FROM certifytoken
            WHERE memberid=#{memberId}
            """)
    Integer getCertifyMemberId(Integer memberId);

    // 현재시간과 토큰 만료시간 비교해서 true, false 값 리턴
    @Select("""
            SELECT expirationTime < NOW()
            FROM certifytoken
            WHERE memberid=#{memberId}
            """)
    boolean isTokenExpired(Integer memberId);
}
