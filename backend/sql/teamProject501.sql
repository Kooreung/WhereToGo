USE prj3;

SELECT *
FROM Comment;

INSERT INTO Post (post_id, member_id, title, content, create_date, view) VALUE (1, 1, 'title', 'content', '1996-02-21', 3);

DESC Comment;