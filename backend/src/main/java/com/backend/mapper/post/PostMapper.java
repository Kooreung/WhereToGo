package com.backend.mapper.post;

import com.backend.domain.place.Place;
import com.backend.domain.post.Post;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface PostMapper {

    // 게시글 추가 | 작성 매퍼
    @Insert("""
            INSERT INTO post (title, content, memberid)
            VALUES (#{title}, #{content}, #{memberId})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "postId")
    int insert(Post post);

    // 게시글 조회 매퍼
    @Select("""
            SELECT p.postid,
                   p.title,
                   p.content,
                   p.createdate,
                   p.view,
                   p.memberid,
                   m.nickname,
                   COUNT(DISTINCT c.commentid) commentCount,
                   COUNT(DISTINCT l.memberid)  likeCount
            FROM post p
                     JOIN member m ON p.memberid = m.memberid
                     LEFT JOIN comment c ON p.postid = c.postid
                     LEFT JOIN likes l ON p.postid = l.postid
            WHERE p.postid = #{postId};
            """)
    Post selectById(Integer postId);

    // 게시글 목록 매퍼
    @Select("""
            <script>
            SELECT p.postid, p.title, p.content, p.createdate, p.view,
                   m.nickname,
                   COUNT(DISTINCT c.commentid) commentCount,
                   COUNT(DISTINCT l.memberid) likeCount
            FROM post p JOIN member m ON p.memberid = m.memberid
                        JOIN authority a ON p.memberid = a.memberid
                        LEFT JOIN comment c ON p.postid = c.postid
                        LEFT JOIN likes l ON p.postid = l.postid
                        LEFT JOIN place pl ON p.postid = pl.postid
            <where>
            a.authtype != 'admin'
                <if test="searchType != null">
                    <bind name="pattern" value="'%' + searchKeyword + '%'"/>
                    <if test="searchType =='all' || searchType =='titleAndContent'">
                        OR p.title LIKE #{pattern}
                        OR p.content LIKE #{pattern}
                    </if>
                    <if test="searchType == 'all' || searchType == 'nickName'">
                        OR m.nickname LIKE #{pattern}
                    </if>
                    <if test="searchType == 'all' || searchType == 'placeName'">
                            OR pl.placename LIKE #{pattern}
                        </if>
                    <if test="searchType == 'all' || searchType == 'address'">
                        OR pl.address LIKE #{pattern}
                    </if>
                </if>
            </where>
            GROUP BY p.postid
            ORDER BY p.postid DESC
            LIMIT #{offset}, 5
            </script>
            """)
    List<Post> selectAllPost(Integer offset, String searchType, String searchKeyword);

    // 게시글 목록 카운트 매퍼
    @Select("""
            <script>
            SELECT COUNT(DISTINCT p.postid)
            FROM post p JOIN member m ON p.memberid = m.memberid
                        JOIN authority a ON p.memberid = a.memberid
                        LEFT JOIN place pl ON p.postid = pl.postid
                <where>
            a.authtype != 'admin'
                    <if test="searchType != null">
                        <bind name="pattern" value="'%' + searchKeyword + '%'"/>
                        <if test="searchType =='all' || searchType =='titleAndContent'">
                            OR p.title LIKE #{pattern}
                            OR p.content LIKE #{pattern}
                        </if>
                        <if test="searchType == 'all' || searchType == 'nickName'">
                            OR m.nickname LIKE #{pattern}
                        </if>
                        <if test="searchType == 'all' || searchType == 'placeName'">
                            OR pl.placename LIKE #{pattern}
                        </if>
                        <if test="searchType == 'all' || searchType == 'address'">
                            OR pl.address LIKE #{pattern}
                        </if>
                    </if>
                </where>
            </script>
            """)
    Integer countAllPost(String searchType, String searchKeyword);

    // 게시글 Top 3 인기글 목록 매퍼
    @Select("""
            SELECT p.postid,
                   p.title,
                   p.view,
                   p.createDate,
                   m.nickName,
                   COUNT(DISTINCT c.commentid)                                                 commentCount,
                   COUNT(DISTINCT l.memberid)                                                  likeCount,
                   ROW_NUMBER() OVER (ORDER BY likeCount DESC, p.view DESC, commentCount DESC) postOfBest
            FROM post p
                     JOIN member m ON p.memberid = m.memberid
                     LEFT JOIN comment c ON p.postid = c.postid
                     LEFT JOIN likes l ON p.postid = l.postid
            GROUP BY p.postid, p.title, p.view, m.nickName
            LIMIT 3
            """)
    List<Post> selectPostOfBest();

    // 게시글에서 선택한 장소 목록 매퍼
    @Select("""
            SELECT p.postid,
                   pl.placename,
                   pl.address,
                   pl.placeurl,
                   pl.latitude,
                   pl.longitude,
                   (SELECT COUNT(pl_inner.postid)
                    FROM place pl_inner
                    WHERE pl_inner.placeurl = pl.placeurl) countPlace
            FROM post p
                     JOIN place pl ON p.postid = pl.postid
            WHERE p.postid = #{postId}
            """)
    List<Place> getPlaceList(Integer postId);

    // 게시글 삭제 매퍼
    @Delete("""
            DELETE FROM post
            WHERE postid=#{postId}
            """)
    Integer deleteById(Integer postId);

    // 게시글 수정 매퍼
    @Update("""
            UPDATE post
            SET title=#{title}, content=#{content}
            WHERE postid=#{postId}
            """)
    void update(Post post);

    // 좋아요 추가 매퍼
    @Insert("""
            INSERT INTO likes (postid, memberid)
            VALUES (#{postId}, #{memberId})
            """)
    int insertLike(Integer postId, Integer memberId);

    // 좋아요 삭제 매퍼
    @Delete("""
            DELETE FROM likes
            WHERE postid=#{postId} AND memberid=#{memberId}
            """)
    int deleteLike(Integer postId, Integer memberId);

    // 게시글 별 좋아요 개수 카운트 매퍼
    @Select("""
            SELECT COUNT(*)
            FROM likes
            WHERE postid=#{postId}
            """)
    Object selectCountLikeByBoardId(Integer postId);

    // 회원 별 좋아요 개수 카운트 매퍼
    @Select("""
            select COUNT(*) from likes
            where postid=#{postId}
            and memberid=#{memberId}
            """)
    int selectLikeByPostIdAndMemberId(Integer postId, String memberId);

    // 게시글 별 댓글 개수 카운트 매퍼
    @Select("""
            SELECT COUNT(*)
            FROM comment
            WHERE postid = #{postId}
            """)
    int selectCountCommentByBoardId(Integer postId);

    // 조회수 매퍼
    @Update("""
            UPDATE post
            SET view=view+1
            WHERE postid=#{postId}
            """)
    int incrementViewCount(Integer postId);


    //MD List
    @Select("""
                        SELECT p.postid,
                               p.title,
                               p.content,
                               p.createdate,
                               p.view,
                               m.memberid,
                               COUNT(DISTINCT c.commentid) commentCount,
                               COUNT(DISTINCT l.memberid)  likeCount
                        FROM post p
                                 JOIN member m ON p.memberid = m.memberid
                                 JOIN authority a ON p.memberid = a.memberid
                                 LEFT JOIN comment c ON p.postid = c.postid
                                 LEFT JOIN likes l ON p.postid = l.postid
                        WHERE a.authtype = 'admin'
            GROUP BY p.postid, p.title, p.content, p.createdate, p.view, m.memberid
            ORDER BY p.postid DESC
            """)
    List<Post> selectMdPostList(Map<String, Object> post);

    //좋아요 리스트
    @Select("""
            <script>
            SELECT p.postid, p.title, p.content, p.createdate, p.view,
                                      m.nickname,
                                      COUNT(DISTINCT c.commentid) commentCount,
                                      COUNT(DISTINCT l2.memberid) likeCount
                               FROM post p
                               JOIN member m ON p.memberid = m.memberid
                               LEFT JOIN comment c ON p.postid = c.postid
                               LEFT JOIN likes l2 ON p.postid = l2.postid
                               JOIN likes l ON p.postid = l.postid
                       <where>
               l.memberid = #{memberId}
               <if test="searchType != null">
                   <bind name="pattern" value="'%' + searchKeyword + '%'"/>
                   <if test="searchType == 'all'">
                       AND (p.title LIKE #{pattern} OR p.content LIKE #{pattern} OR m.nickname LIKE #{pattern})
                   </if>
                   <if test="searchType == 'title'">
                       AND (p.title LIKE #{pattern} OR p.content LIKE #{pattern})
                   </if>
                   <if test="searchType == 'nickName'">
                       AND m.nickname LIKE #{pattern}
                   </if>
               </if>
                       </where>
            GROUP BY p.postid
            ORDER BY p.postid DESC
            LIMIT #{offset}, 5
                   </script>
            """)
    List<Post> selectLikeList(Integer memberId, Integer offset, String searchType, String searchKeyword);

    //좋아요 리스트 카운트
    @Select("""
            <script>
            SELECT COUNT(p.postid)
            FROM post p JOIN member m ON p.memberid = m.memberid
                               JOIN likes l ON p.postid = l.postid
            <where>
                l.memberid = #{memberId}
                <if test="searchType != null">
                    <bind name="pattern" value="'%' + searchKeyword + '%'"/>
                    <if test="searchType == 'all'">
                        AND (p.title LIKE #{pattern} OR p.content LIKE #{pattern} OR m.nickname LIKE #{pattern})
                    </if>
                    <if test="searchType == 'title'">
                        AND (p.title LIKE #{pattern} OR p.content LIKE #{pattern})
                    </if>
                    <if test="searchType == 'nickName'">
                        AND m.nickname LIKE #{pattern}
                    </if>
                </if>
            </where>
            </script>
            """)
    Integer countAllLikePost(Integer memberId, String searchType, String searchKeyword);

    @Update("""
        UPDATE post
        SET mdpick = 'o'
        WHERE postid = #{postId}
            """)
    int mdPickPush(Integer postId);


    @Select("""
            SELECT p.postid,
                               p.title,
                               p.content,
                               p.createdate,
                               p.view,
                               m.memberid,
                               COUNT(DISTINCT c.commentid) commentCount,
                               COUNT(DISTINCT l.memberid)  likeCount
                        FROM post p
                                 JOIN member m ON p.memberid = m.memberid
                                 JOIN authority a ON p.memberid = a.memberid
                                 LEFT JOIN comment c ON p.postid = c.postid
                                 LEFT JOIN likes l ON p.postid = l.postid
                        WHERE a.authtype = 'admin' AND
                              p.mdpick = 'o'
            GROUP BY p.postid, p.title, p.content, p.createdate, p.view, m.memberid
            ORDER BY p.postid DESC
""")
    List<Post> selectMdPickPostList(Map<String, Object> post);

    @Select("""
    SELECT mdpick
    FROM post
    WHERE postid = #{postId}
            """)
    String getMdPick(Integer postId);

    @Update("""
        UPDATE post
        SET mdpick = 'x'
        WHERE postid = #{postId}
            """)
    int mdPickPop(Integer postId);
}