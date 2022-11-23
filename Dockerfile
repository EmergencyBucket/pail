ARG DATABASE_URL

FROM rust:1.65

WORKDIR /pail

COPY Cargo.toml .
COPY Cargo.lock .

COPY docker_utils/dummy.rs .

RUN sed -i 's|src/main.rs|dummy.rs|' Cargo.toml

RUN cargo build --release

RUN sed -i 's|dummy.rs|src/main.rs|' Cargo.toml

COPY . .

RUN cp Rocket.toml.example Rocket.toml

RUN sed -i 's/DATABASE_URL/${DATABASE_URL}/g' Rocket.toml

RUN cargo build --release

EXPOSE 8000

CMD ./target/release/pail