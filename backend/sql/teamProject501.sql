USE prj3;

DESC Member;

# Member 테이블에 AUTO_INCREMENT 설정
ALTER TABLE Member
    MODIFY member_id INT NOT NULL AUTO_INCREMENT;

INSERT INTO Member (email, password, nick_name, name, gender, birth, address, phone_number)
VALUES (123, 123, 123, 123, 123, 123, 123, 123);

select *
from Member;