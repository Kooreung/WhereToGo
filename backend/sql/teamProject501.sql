USE prj3;

-- 코멘트 SQL
SELECT *
FROM comment;

INSERT INTO post (postid, memberid, title, content, createdate, view) VALUE (1, 1, 'title', 'content', '1996-02-21', 3);

DESC comment;

-- 멤버 SQL
DESC member;

# Member 테이블에 AUTO_INCREMENT 설정
ALTER TABLE member
    MODIFY memberid INT NOT NULL AUTO_INCREMENT;

ALTER TABLE member
    ADD CONSTRAINT unique_email UNIQUE (email);

ALTER TABLE member
    ADD CONSTRAINT unique_nm UNIQUE (nickname);

ALTER TABLE member
    MODIFY password VARCHAR(100);

ALTER TABLE member
    MODIFY phonenumber VARCHAR(20);

INSERT INTO member (email, password, nickname, name, gender, birth, address, phonenumber)
VALUES (123, 123, 123, 123, 123, 123, 123, 123);

CREATE TABLE IF NOT EXISTS selected_places
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    place_name VARCHAR(255) NOT NULL,
    place_url  VARCHAR(255),
    address    VARCHAR(255),
    category   VARCHAR(255),
    latitude   DECIMAL(10, 8),
    longitude  DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE selected_places RENAME TO Place;

SELECT *
FROM Place;

INSERT INTO Place (place_name, place_url, address, category, latitude, longitude)
VALUES ('서울타워', 'http://place.map.kakao.com/123456', '서울특별시 용산구 남산동2가 YTN서울타워', '명소', 37.5511694, 126.9882288);

INSERT INTO Place (place_name, place_url, address, category, latitude, longitude)
VALUES ('서울타워', 'http://place.map.kakao.com/123456', '서울특별시 용산구 남산동2가 YTN서울타워', '명소', 37.5511694, 126.9882288);

SELECT *
FROM member;

SELECT *
FROM comment;

DESC likes;

INSERT INTO comment (commentid, postid, memberid, comment, createdate)
VALUES (2, 1, 2, '성공', '2021-10-21');

DESC likes;
DESC post;

INSERT INTO post (postid, memberid, title, content, createdate, view)
VALUES (1090, 40, '조회수연습', 'ㅇㅁㄴㅇㄴㅁㅇㄴㅁ', '2020-02-21', 35);

SELECT p.postid,
       p.title,
       p.content,
       p.createdate,
       p.view,
       m.nickname,
       COUNT(DISTINCT c.commentid) commentCount,
       COUNT(DISTINCT l2.memberid) likeCount
FROM post p
         JOIN member m ON p.memberid = m.memberid
         LEFT JOIN comment c ON p.postid = c.postid
         LEFT JOIN likes l2 ON p.postid = l2.postid
         JOIN likes l ON p.postid = l.postid
WHERE l.memberid = 134
GROUP BY p.postid
ORDER BY p.postid DESC;

INSERT INTO authority (memberid, authtype)
VALUES (101, 'admin');

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
ORDER BY p.postid DESC;

SELECT COUNT(p.postid)
FROM post p
         JOIN member m ON p.memberid = m.memberid
         JOIN likes l ON p.postid = l.postid
WHERE l.memberid = 101;

SELECT p.postid,
       p.title,
       p.content,
       p.createdate,
       p.view,
       m.nickname,
       COUNT(DISTINCT c.commentid) commentCount,
       COUNT(DISTINCT l2.memberid) likeCount
FROM post p
         JOIN member m ON p.memberid = m.memberid
         LEFT JOIN comment c ON p.postid = c.postid
         LEFT JOIN likes l2 ON p.postid = l2.postid
         JOIN likes l ON p.postid = l.postid
WHERE l.memberid = 101
GROUP BY p.postid
ORDER BY p.postid DESC;


SELECT p.postid,
       p.title,
       p.content,
       p.createdate,
       p.view,
       m.nickname,
       COUNT(DISTINCT c.commentid) commentCount,
       COUNT(DISTINCT l2.memberid) likeCount
FROM post p
         JOIN member m ON p.memberid = m.memberid
         LEFT JOIN comment c ON p.postid = c.postid
         LEFT JOIN likes l2 ON p.postid = l2.postid
         JOIN likes l ON p.postid = l.postid
WHERE l.memberid = 101
GROUP BY p.postid
ORDER BY p.postid DESC;


SELECT p.postid,
       p.title,
       p.content,
       p.createdate,
       p.view,
       m.nickname,
       COUNT(DISTINCT c.commentid) commentCount,
       COUNT(DISTINCT l2.memberid) likeCount
FROM post p
         JOIN member m ON p.memberid = m.memberid
         LEFT JOIN comment c ON p.postid = c.postid
         LEFT JOIN likes l2 ON p.postid = l2.postid
         JOIN likes l ON p.postid = l.postid
where l.memberid = 101;

SELECT COUNT(p.postid)
FROM post p
         JOIN member m ON p.memberid = m.memberid
         JOIN likes l ON p.postid = l.postid
         LEFT JOIN place pl ON p.postid = pl.postid;

SELECT COUNT(p.postid)
FROM post p
         JOIN member m ON p.memberid = m.memberid
         JOIN likes l ON p.postid = l.postid
         JOIN place pl ON p.postid = pl.postid
WHERE l.memberid = 101;

SELECT *
FROM post;


SELECT *
FROM likes;

select *
from authority;


SELECT p.postid,
       p.title,
       p.content,
       p.createdate,
       p.view,
       m.memberid,
       COUNT(DISTINCT c.commentid) commentCount,
       COUNT(DISTINCT l.memberid)  likeCount,
       p.mdpick
FROM post p
         JOIN member m ON p.memberid = m.memberid
         JOIN authority a ON p.memberid = a.memberid
         LEFT JOIN comment c ON p.postid = c.postid
         LEFT JOIN likes l ON p.postid = l.postid
WHERE a.authtype = 'admin'
  AND p.mdpick = 'o'
GROUP BY p.postid, p.title, p.content, p.createdate, p.view, m.memberid
ORDER BY p.postid DESC;


SELECT a.authtype
from authority a
         join post p on p.memberid = a.memberid
where p.postid = 1240;

CREATE TABLE `Reply`
(
    `replyId`      INT(11)       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `commentid`    INT(11)       NOT NULL,
    `postid`       INT(11)       NOT NULL,
    `memberid`     INT(11)       NOT NULL,
    `replyComment` VARCHAR(1000) NOT NULL,
    `createdate`   DATE          NOT NULL
);

DESC commentreply;
DESC comment;


CREATE TABLE report (
    reportid INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    postid INT(11),
    commentid INT(11),
    reportreason varchar(20),
    repostdetailreason text,
    processyn char(1),
    processdate timestamp,
    processorid int(11),
    createid   int(11),
    creatdate timestamp
);

    id
    게시판 id
    댓글 id
    신고사유 enum
    신고상세사유
    처리여부
    처리일자
    처리한사람
    생성한사람
    생성일자

SELECT
    r.reportId,
    r.postId,
    r.commentId,
    r.reportReason,
    r.reportDetailReason,
    r.processYn,
    r.processDate,
    r.processorId,
    r.createId,
    r.creatDate,
    p.title as titlename,
    creator.nickName as creatorname
FROM report r
         LEFT JOIN post p ON p.postId = r.postId
         LEFT JOIN comment c ON c.commentId = r.commentId
         LEFT JOIN member creator ON creator.memberId = r.createId
         LEFT JOIN member processor ON processor.memberId = r.processorId;
