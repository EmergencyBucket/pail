use crate::schema::users;
use diesel::prelude::*;
use diesel::result::Error;
use rocket::http::Status;
use rocket::serde::json::serde_json::json;
use rocket::serde::json::Value;
use rocket::serde::{json::Json, Deserialize};
use serde::Serialize;

use crate::database::DB;

#[derive(Queryable, Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct User {
    id: i32,
    username: String,
    email: String,
    admin: bool,
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
/// This will create a new user with the github id
#[post("/", data = "<user>")]
pub async fn create_user(db: DB, user: Json<User>) -> (Status, Value) {
    use crate::schema::users::dsl::*;

    let insert_username: String = user.username.clone();

    let insert_email: String = user.email.clone();

    let insert_id: i32 = user.id.clone();

    let ids: Result<Vec<i32>, Error> = db
        .run(move |conn| users.select(id).filter(id.eq(insert_id)).load(conn))
        .await;

    // If the user is already in the database do not try to insert it
    if !ids.ok().expect("").is_empty() {
        // Return ok because client side won't be checking if the user is already in the database
        return (
            Status::Conflict,
            json!({
                "error": "User already in database"
            }),
        );
    }

    let insert: Result<_, Error> = db
        .run(move |conn: &mut PgConnection| {
            diesel::insert_into(users)
                .values((
                    id.eq(insert_id),
                    (username.eq(insert_username)),
                    (email.eq(insert_email)),
                    (admin.eq(false)),
                ))
                .execute(conn)
        })
        .await;

    if insert.is_err() {
        return (
            Status::InternalServerError,
            json!({
                "error": "Server error while inserting into database."
            }),
        );
    }

    return (
        Status::Created,
        json!({
            "id": user.id.clone(),
            "username": user.username.clone(),
            "email": user.email.clone(),
        }),
    );
}

/// Gets a user based off of their id
/// # Example
/// ``HTTP REQUEST TO https://api.ctf.ebucket.dev/api/auth/users/1``
/// ```json
/// {
///     "id": 1,
///     "username": "Mrxbox98",
///     "email": "mrxbox98@mrxbox98.me"
/// }
#[get("/<user_id>")]
pub async fn get_user(db: DB, user_id: i32) -> (Status, Value) {
    let tableuser: Result<User, Error> = db
        .run(move |conn: &mut PgConnection| users::table.filter(users::id.eq(user_id)).first(conn))
        .await;

    if tableuser.is_err() {
        return (
            Status::NotFound,
            json!({
                "error": "User not found"
            }),
        );
    }

    let user: User = tableuser.ok().expect("Error");

    return (Status::Ok, json!(user));
}
