ARG DATABASE_URL

FROM rust:latest

WORKDIR /src

COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml

COPY . .

RUN cargo build --release

EXPOSE 8000

RUN touch .env

RUN sed -i -e '$ a DATABASE_URL=${DATABASE_URL}' .env

RUN sed -i -e '$ a ROCKET_DATABASES="{my_db={url="${DATABASE_URL}"}}"' .env

CMD ./target/release/pail