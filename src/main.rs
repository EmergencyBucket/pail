pub mod api;
pub mod schema;

use rocket::serde::{Serialize, json::Json};
use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

#[macro_use]
extern crate rocket;

pub fn establish_connection() -> MysqlConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    MysqlConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

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
        version: env!("CARGO_PKG_VERSION").to_string()
    })
}

#[launch]
fn rocket() -> _ {
    let conn = establish_connection();
    rocket::build()
    .mount("/", routes![index])
    .mount("/api/auth/user", routes![api::auth::user::testuser])
}