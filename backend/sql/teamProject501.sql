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

SELECT *
FROM member;

SELECT *
FROM comment;

DESC likes;

INSERT INTO comment (commentid, postid, memberid, comment, createdate)
VALUES (2, 1, 2, '성공', '2021-10-21');

DESC likes;
DESC post;