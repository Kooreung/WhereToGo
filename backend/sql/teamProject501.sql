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
