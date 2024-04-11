SET NAMES utf8mb4;
SET foreign_key_checks = 0;
SET time_zone = '+00:00';

CREATE TABLE `bookmark` (
    `user_id` varchar(20) NOT NULL,
    `playlist_id` varchar(20) NOT NULL,
    `create_at` timestamp NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `comments` (
    `id` varchar(20) NOT NULL DEFAULT '0',
    `content_id` varchar(20) NOT NULL,
    `user_id` varchar(20) NOT NULL,
    `tutor_id` varchar(20) NOT NULL,
    `comment` varchar(1000) NOT NULL,
    `date` date DEFAULT NULL,
    `create_at` timestamp NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `contact` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL,
    `email` varchar(50) NOT NULL,
    `number` int NOT NULL,
    `message` varchar(1000) NOT NULL,
    `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
);

CREATE TABLE `content` (
    `id` varchar(20) NOT NULL DEFAULT '0',
    `tutor_id` varchar(20) NOT NULL,
    `playlist_id` varchar(20) NOT NULL,
    `title` varchar(100) NOT NULL,
    `description` text,
    `video` text,
    `thumb` text,
    `date` date DEFAULT NULL,
    `status` varchar(20) NOT NULL DEFAULT 'deactive',
    `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `likes` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` varchar(20) NOT NULL,
    `tutor_id` varchar(20) NOT NULL,
    `content_id` varchar(20) NOT NULL,
    `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
);

CREATE TABLE `playlist` (
    `id` varchar(20) NOT NULL DEFAULT '0',
    `tutor_id` varchar(20) NOT NULL,
    `title` varchar(100) NOT NULL,
    `description` varchar(1000) NOT NULL,
    `thumb` varchar(100) NOT NULL,
    `date` date DEFAULT NULL,
    `status` varchar(20) NOT NULL DEFAULT 'deactive',
    `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `tutors` (
    `id` varchar(20) NOT NULL DEFAULT '0',
    `name` varchar(50) NOT NULL,
    `profession` varchar(50) NOT NULL,
    `email` varchar(50) NOT NULL,
    `password` text NOT NULL,
    `image` text,
    `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `users` (
    `id` varchar(20) NOT NULL DEFAULT '0',
    `name` varchar(50) NOT NULL,
    `email` varchar(50) NOT NULL,
    `password` text NOT NULL,
    `image` text,
    `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
);

SET foreign_key_checks = 1;
