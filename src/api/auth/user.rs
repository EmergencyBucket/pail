use diesel::prelude::*;
use diesel::result::Error;
use rocket::http::Status;
use rocket::serde::json::serde_json::json;
use rocket::serde::json::Value;
use rocket::serde::{json::Json, Deserialize};
use serde::Serialize;

use crate::database::DB;

#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct UserTemplate {
    pub id: i32,
    pub name: String,
    pub email: String,
}

#[derive(Queryable, Serialize, Debug)]
pub struct FullUser {
    id: i32,
    username: String,
    email: String,
}

#[derive(Queryable, Serialize, Debug)]
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
/// This will create a new user with the github id
#[post("/", data = "<user>")]
pub async fn create_user(db: DB, user: Json<UserTemplate>) -> (Status, Value) {
    use crate::schema::users::dsl::*;

    let insert_username: String = user.name.clone();

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
            "username": user.name.clone(),
            "email": user.email.clone(),
        }),
    );
}
