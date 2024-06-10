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
