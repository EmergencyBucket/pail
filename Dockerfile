FROM rust:latest

ARG DATABASE_URL

WORKDIR /src

COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml

COPY . .

RUN cargo build --release

EXPOSE 8000

RUN touch .env

RUN echo "DATABASE_URL=$DATABASE_URL" >>.env

RUN echo "ROCKET_DATABASES='{db={url='$DATABASE_URL'}}'" >>.env

CMD ["cargo", "run"]