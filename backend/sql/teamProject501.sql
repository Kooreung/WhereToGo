USE prj3;

DESC Member;

# Member 테이블에 AUTO_INCREMENT 설정
ALTER TABLE Member
    MODIFY member_id INT NOT NULL AUTO_INCREMENT;

ALTER TABLE Member
    ADD CONSTRAINT unique_email UNIQUE (email);

ALTER TABLE Member
    ADD CONSTRAINT unique_nm UNIQUE (nick_name);

ALTER TABLE Member
    MODIFY password VARCHAR(100);

ALTER TABLE Member
    MODIFY phone_number VARCHAR(20);

INSERT INTO Member (email, password, nick_name, name, gender, birth, address, phone_number)
VALUES (123, 123, 123, 123, 123, 123, 123, 123);

SELECT *
FROM Member;