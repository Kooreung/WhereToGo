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

select *
from Member
where memberid = 23;

-- 기존 memberid 컬럼 삭제
ALTER TABLE Member
    DROP COLUMN memberid;

-- 새로운 memberid 컬럼 추가 및 자동 증가 설정
ALTER TABLE Member
    ADD memberid INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE Member
    MODIFY memberid INT AUTO_INCREMENT PRIMARY KEY;
