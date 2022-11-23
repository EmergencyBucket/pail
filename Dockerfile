FROM rust:1.65

WORKDIR /pail

COPY Cargo.toml .
COPY Cargo.lock .

COPY docker_utils/dummy.rs .

RUN sed -i 's|src/main.rs|dummy.rs|' Cargo.toml

RUN cargo build --release

RUN sed -i 's|dummy.rs|src/main.rs|' Cargo.toml

FROM debian:bullseye-slim

RUN apt-get update \
 && apt-get install -y libpq-dev default-libmysqlclient-dev libsqlite3-dev

FROM rust:1.65

COPY . .

ARG DATABASE_URL

RUN touch .env

RUN sed -i "$ a DATABASE_URL=${DATABASE_URL}" .env

RUN cargo install diesel_cli

RUN diesel migration run

RUN cargo build --release

EXPOSE 8000

CMD ROCKET_DATABASES="ROCKET_DATABASES='{db={url='${DATABASE_URL}'}}'" ./target/release/pail