pub mod api;
pub mod database;
pub mod schema;

use dotenv::dotenv;
use rocket::{
    http::Status,
    serde::json::{serde_json::json, Value},
};
use std::env;

#[macro_use]
extern crate rocket;

#[get("/")]
fn index() -> (Status, Value) {
    (
        Status::BadRequest,
        json!({
            "status": "OK".to_string(),
            "version": env!("CARGO_PKG_VERSION").to_string(),
        }),
    )
}

#[get("/error")]
fn error() -> (Status, Value) {
    (
        Status::BadRequest,
        json!({
            "status": "error"
        }),
    )
}

#[launch]
fn rocket() -> _ {
    dotenv().ok();

    rocket::build()
        .attach(database::DB::fairing())
        .mount("/", routes![index, error])
        .mount("/api/auth/user", routes![api::auth::user::create_user])
}
