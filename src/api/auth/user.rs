use diesel::{prelude::*};
use rocket::{serde::{
    json::{Json},
    Deserialize,
}};
use rocket::response::{status::Created};
use rand::{Rng};
use rocket::response::Debug;
use serde::Serialize;

use crate::database::DB;

type Result<T, E = Debug<diesel::result::Error>> = std::result::Result<T, E>;

#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct UserTemplate {
    pub name: String,
    pub email: String,
}

#[derive(Queryable, Serialize, Debug)]
pub struct FullUser {
    id: String,
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
/// This will create a new user with a random u32 id
#[post("/", data = "<user>")]
pub async fn create_user(db: DB, user: Json<UserTemplate>) -> Result<Created<Json<FullUser>>> {
    use crate::schema::users::dsl::*;

    let insert_username: String = user.name.clone();

    let insert_email: String = user.email.clone();

    let user_id: u32 = rand::thread_rng().gen::<u32>();

    db.run(move |conn: &mut MysqlConnection| {
        diesel::insert_into(users)
            .values((id.eq(user_id.to_string()), (username.eq(insert_username)), (email.eq(insert_email))))
            .on_conflict_do_nothing()
            .execute(conn)
    }).await?;

    Ok(Created::new("/").body(Json(FullUser {
        id: user_id.to_string(),
        username: user.name.clone(),
        email: user.email.clone()
    })))
}