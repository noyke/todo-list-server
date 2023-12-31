CREATE DATABASE todo_list_app;
USE todo_list_app;

CREATE TABLE users (
    user_name VARCHAR(255) PRIMARY KEY,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE todos (
    user_name VARCHAR(255) PRIMARY KEY,
    todo_item VARCHAR(255) NOT NULL,
);

INSERT INTO users (user_name, user_password)
VALUES
('Dani', '123456'),
('Noa', '10203040');