-- THIS IS JUST AN EXAMPLE, IN THIS FOLDER
-- SHOULD CREATE ALL THE INITIAL DB SCHEMA FOR PROD ENVIRONMENT
-- ONLY WHEN IT IS THE FIRST TIME THAT INSTANCE THROW 

-- CREATE DATABASE IF NOT EXISTS buzzbox_db;

-- USE buzzbox_db;

-- CREATE TABLE IF NOT EXISTS users (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   username VARCHAR(32) NOT NULL UNIQUE,
--   email VARCHAR(256) NOT NULL UNIQUE,
--   password TEXT NOT NULL,
--   avatar_url TEXT DEFAULT NULL,
--   status VARCHAR(16) DEFAULT 'offline',
--   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   last_login TIMESTAMP DEFAULT NULL,
--   is_verified BOOLEAN DEFAULT FALSE,
--   is_disabled BOOLEAN DEFAULT FALSE
-- );

-- INSERT INTO users (username, email, password, avatar_url, status, created_at, last_login, is_verified, is_disabled) 
-- VALUES
-- ('johnsd_doe', 'johsdn.doe@example.com', '$2y$10$ABCDEFGHIJKLMNOPQRSTUV12345678', 'https://example.com/avatar1.png', 'online', '2024-12-01 08:00:00', '2024-12-15 10:00:00', TRUE, FALSE),
-- ('jane_ssdmith', 'jane.sdsmith@example.com', '$2y$10$ZYXWVUTSRQPONMLKJIHGFEDCBA87654321', 'https://example.com/avatar2.png', 'offline', '2024-12-02 09:00:00', '2024-12-15 09:30:00', TRUE, FALSE),
-- ('alesdx89', 'alex89@exsdample.com', '$2y$10$ABCD1234EFGH5678IJKL910MNOPQRSTUV', NULL, 'busy', '2024-12-03 12:00:00', '2024-12-14 18:15:00', TRUE, FALSE),
-- ('emisdly_w', 'emilysd.w@example.com', '$2y$10$1234ABCD5678EFGH910IJKLMNOPQRSTUV', 'https://example.com/avatar3.png', 'online', '2024-12-04 15:00:00', '2024-12-15 12:45:00', TRUE, FALSE),
-- ('sdmichael_c', 'michsdael.c@example.com', '$2y$10$QWERTYUIOPLKJHGFDSAZXCVBNM12345678', NULL, 'away', '2024-12-05 14:30:00', '2024-12-13 14:00:00', FALSE, FALSE),
-- ('sarah_sdconnor', 'sarah.connor@example.com', '$2y$10$12345678ABCDEFGH910IJKLMNOPQRSTUV', 'https://example.com/avatar4.png', 'offline', '2024-12-06 16:00:00', '2024-12-14 08:15:00', TRUE, FALSE),
-- ('lucasds_p', 'lucas.p@exsdample.com', '$2y$10$MNOPQRSTUV1234ABCD5678EFGH910IJKL', 'https://example.com/avatar5.png', 'online', '2024-12-07 17:00:00', '2024-12-15 07:00:00', FALSE, FALSE),
-- ('olivisda_k', 'olivisda.k@example.com', '$2y$10$ABCDEFGHIJKL1234MNOPQRSTUV5678EFGH', NULL, 'offline', '2024-12-08 13:45:00', '2024-12-12 21:30:00', TRUE, FALSE),
-- ('danisdel_r', 'daniesdl.r@example.com', '$2y$10$QRSTUV1234ABCD5678EFGH910IJKLMNOP', 'https://example.com/avatar6.png', 'busy', '2024-12-09 10:30:00', '2024-12-11 16:45:00', TRUE, TRUE),
-- ('chloesd_lee', 'chloesd.lee@example.com', '$2y$10$EFGH1234ABCD5678IJKLMNOPQRSTUV910', 'https://example.com/avatar7.png', 'away', '2024-12-10 18:00:00', '2024-12-15 20:15:00', TRUE, FALSE);

