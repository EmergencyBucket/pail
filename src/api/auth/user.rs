use rocket::serde::{Serialize, json::Json};

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Status {
    pub status: String,
    pub version: String,
}

#[get("/")]
pub fn testuser() -> Json<Status> {
    Json(Status {
        status: "OK".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string()
    })
}