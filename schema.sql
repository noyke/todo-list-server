CREATE DATABASE todo_list_app;
USE todo_list_app;

CREATE TABLE users (
    user_name VARCHAR(255) PRIMARY KEY,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE todos (
    id integer PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(255) NOT NULL,
    todo_item VARCHAR(255) NOT NULL
);

INSERT INTO users (user_name, user_password)
VALUES
('Dani', '123456'),
('Noa', '10203040');