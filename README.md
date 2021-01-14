# Snake-api-rest

This project is composed of 3 parts:

1.Api: API REST using Go, database: CockroachDB and API ROUTER chi.

2.Snake-phaser: snake game using Phaser game engine.

3.Table-score: User interface using Vue and Vuetify.

In each folder is specified how to run this module.

# How to create and configure the database

## Create a single node
Run in terminal  in the folder where is cockroach.exe
```
cockroach start-single-node --insecure --listen-addr=localhost:26257 --http-addr=localhost:8080
```
Open another terminal and run:
```
cockroach.exe sql --insecure
```
```
CREATE USER IF NOT EXISTS test;
```
```
CREATE DATABASE scoresdb;
```
```
set DATABASE = scoresdb;
```
```
CREATE TABLE IF NOT EXISTS players(id SERIAL PRIMARY KEY, nickname STRING , score INT);
```
```
GRANT ALL ON TABLE scoresdb.* TO test;
```
