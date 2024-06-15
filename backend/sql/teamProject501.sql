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