use diesel::prelude::*;
use rocket::response::status::Created;
use rocket::response::Debug;
use rocket::serde::{json::Json, Deserialize};
use serde::Serialize;

use crate::database::DB;

type Result<T, E = Debug<diesel::result::Error>> = std::result::Result<T, E>;

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
pub async fn create_user(db: DB, user: Json<UserTemplate>) -> Result<Created<Json<FullUser>>> {
    use crate::schema::users::dsl::*;

    let insert_username: String = user.name.clone();

    let insert_email: String = user.email.clone();

    let insert_id: i32 = user.id.clone();

    let ids: Vec<i32> = db
        .run(move |conn| users.select(id).filter(id.eq(insert_id)).load(conn))
        .await?;

    // If the user is already in the database do not try to insert it
    if !ids.is_empty() {
        // Return ok because client side won't be checking if the user is already in the database
        return Ok(Created::new("/").body(Json(FullUser {
            id: user.id.clone(),
            username: user.name.clone(),
            email: user.email.clone(),
        })));
    }

    db.run(move |conn: &mut PgConnection| {
        diesel::insert_into(users)
            .values((
                id.eq(insert_id),
                (username.eq(insert_username)),
                (email.eq(insert_email)),
            ))
            .execute(conn)
    })
    .await?;

    Ok(Created::new("/").body(Json(FullUser {
        id: user.id.clone(),
        username: user.name.clone(),
        email: user.email.clone(),
    })))
}
