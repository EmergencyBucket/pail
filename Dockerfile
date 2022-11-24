FROM rust:latest

ARG DATABASE_URL

ARG PORT

WORKDIR /usr/src/pail

COPY Cargo.lock .
COPY Cargo.toml .
COPY docker_utils/dummy.rs .

# Change temporarely the path of the code
RUN sed -i 's|src/main.rs|dummy.rs|' Cargo.toml
# Build only deps
RUN cargo build --release
# Now return the file back to normal
RUN sed -i 's|dummy.rs|src/main.rs|' Cargo.toml

COPY . .

RUN cargo build --release

EXPOSE 8000

RUN touch .env

RUN echo "DATABASE_URL=$DATABASE_URL" >>.env

RUN echo "ROCKET_DATABASES='{db={url='$DATABASE_URL'}}'" >>.env

RUN echo "ROCKET_PORT=$PORT" >>.env

RUN echo "ROCKET_ADDRESS=0.0.0.0" >>.env

CMD ./target/release/pail