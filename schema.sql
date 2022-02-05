DROP TABLE IF EXISTS moviesTable;

CREATE TABLE moviesTable
(
id serial primary key ,
title varchar(10000),
release_date varchar(10000),
poster_path varchar(10000),
overview varchar(10000)
);
