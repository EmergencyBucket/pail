pub mod api;
pub mod schema;
pub mod database;

use rocket::{serde::{json::Json, Serialize}};
use std::{env};

#[macro_use] extern crate rocket;

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct Status {
    pub status: String,
    pub version: String,
}

#[get("/")]
fn index() -> Json<Status> {
    Json(Status {
        status: "OK".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(database::DB::fairing())
        .mount("/", routes![index])
        .mount("/api/auth/user", routes![api::auth::user::create_user])
}
