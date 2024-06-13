USE prj3;

-- 코멘트 SQL
SELECT *
FROM Comment;

INSERT INTO Post (postid, memberid, title, content, createdate, view) VALUE (1, 1, 'title', 'content', '1996-02-21', 3);

DESC Comment;

-- 멤버 SQL
DESC Member;

# Member 테이블에 AUTO_INCREMENT 설정
ALTER TABLE Member
    MODIFY memberid INT NOT NULL AUTO_INCREMENT;

ALTER TABLE Member
    ADD CONSTRAINT unique_email UNIQUE (email);

ALTER TABLE Member
    ADD CONSTRAINT unique_nm UNIQUE (nickname);

ALTER TABLE Member
    MODIFY password VARCHAR(100);

ALTER TABLE Member
    MODIFY phonenumber VARCHAR(20);

INSERT INTO Member (email, password, nickname, name, gender, birth, address, phonenumber)
VALUES (123, 123, 123, 123, 123, 123, 123, 123);

SELECT *
FROM Member;

INSERT INTO Comment (commentid, postid, memberid, comment, createdate)
VALUES (2, 1, 2, '성공', '2021-10-21');