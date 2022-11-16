use diesel::prelude::*;
use rocket::serde::{
    json::{serde_json::json, Json, Value},
    Deserialize,
};
use rand::Rng;

use crate::establish_connection;

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct UserTemplate<'a> {
    pub username: &'a str,
    pub email: &'a str,
}

#[derive(Queryable)]
pub struct User {
    id: String,
    username: Option<String>,
    email: Option<String>,
}

/// Creates a new user with the username and email
/// # Example
/// 
/// HTTP POST Request to ``/api/user`` with body:
/// ```json
/// {
///     "username": "Mrxbox98",
///     "email": "mrxbox98@mrxbox98.me"
/// }
/// This will create a new user with a random u32 id
#[post("/", data = "<user>")]
pub fn create_user(user: Json<UserTemplate<'_>>) -> Value {
    use crate::schema::users::dsl::*;

    let mut rng = rand::thread_rng();

    let conn = &mut establish_connection();

    let user_id = rng.gen::<u32>();

    diesel::insert_into(users)
        .values((id.eq(user_id.to_string()), email.eq(user.email)))
        .execute(conn)
        .expect("Error");

    json!({
        "id": user_id.to_string(),
        "username": user.username,
        "email": user.email,
    })
}