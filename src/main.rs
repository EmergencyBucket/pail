use rocket::serde::{Serialize, json::Json};
pub mod api;

#[macro_use]
extern crate rocket;

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
    rocket::build()
    .mount("/", routes![index])
    .mount("/api/auth/user", routes![api::auth::user::testuser])
}