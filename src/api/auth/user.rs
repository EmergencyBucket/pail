use diesel::prelude::*;
use regex::Regex;
use rocket::serde::{
    json::{serde_json::json, Json, Value},
    Deserialize,
};

use crate::establish_connection;

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct UserTemplate<'a> {
    pub id: &'a str,
    pub email: &'a str,
}

#[derive(Queryable)]
pub struct AdapterUser {
    id: String,
    name: Option<String>,
    email: Option<String>,
    emailVerified: Option<String>,
    image: Option<String>,
}

#[derive(Queryable)]
pub struct TableAccount {
    id: String,
    userId: Option<String>,
    type_: Option<String>,
    provider: Option<String>,
    providerAccountId: Option<String>,
    refresh_token: Option<String>,
    access_token: Option<String>,
    expires_at: Option<i32>,
    token_type: Option<String>,
    scope: Option<String>,
    id_token: Option<String>,
    session_state: Option<String>,
    oauth_token_secret: Option<String>,
    oauth_token: Option<String>,
}

#[post("/", data = "<user>")]
pub fn create_user(user: Json<UserTemplate<'_>>) -> Value {
    use crate::schema::users::dsl::*;

    let conn = &mut establish_connection();

    diesel::insert_into(users)
        .values((id.eq(user.id), email.eq(user.email)))
        .execute(conn)
        .expect("Error");

    let table_user = users
        .filter(id.eq(user.id))
        .limit(1)
        .load::<AdapterUser>(conn)
        .expect("Error")
        .pop()
        .expect("Error adding user");
    json!({
        "id": table_user.id,
        "email": table_user.email.expect("Error setting email")
    })
}

#[get("/<user_id_or_email>")]
pub fn get_user(user_id_or_email: &str) -> Value {
    use crate::schema::users::dsl::*;

    let conn = &mut establish_connection();

    if Regex::new("[A-Za-z0_9.%+_-]*@[A-Za-z0_9.%+_-]*\\.[A-Za-z]*")
        .unwrap()
        .is_match(user_id_or_email)
    {
        let table_user = users
            .filter(email.eq(user_id_or_email))
            .limit(1)
            .load::<AdapterUser>(conn)
            .expect("Error")
            .pop()
            .expect("Error getting user");

        json!({
            "id": table_user.id,
            "email": table_user.email.expect("Error getting email")
        })
    } else {
        let table_user = users
            .filter(id.eq(user_id_or_email))
            .limit(1)
            .load::<AdapterUser>(conn)
            .expect("Error")
            .pop()
            .expect("Error getting user");

        json!({
            "id": table_user.id,
            "email": table_user.email.expect("Error getting email")
        })
    }
}

#[get("/<account_provider>/<provider_account_id>")]
pub fn get_user_by_account(account_provider: &str, provider_account_id: &str) -> Value {
    use crate::schema::accounts::dsl::*;
    use crate::schema::users::dsl::*;

    let conn = &mut crate::establish_connection();

    let table_account = accounts
        .filter(provider.eq(account_provider))
        .filter(providerAccountId.eq(provider_account_id))
        .limit(1)
        .load::<TableAccount>(conn)
        .expect("Error")
        .pop()
        .expect("Error getting user");

    let user_id = table_account.userId.expect("No user id in account");

    let table_user = users
        .filter(crate::schema::users::dsl::id.eq(user_id))
        .limit(1)
        .load::<AdapterUser>(conn)
        .expect("Error")
        .pop()
        .expect("Error getting user");

    json!({
        "id": table_user.id,
        "email": table_user.email.expect("Error getting email")
    })
}

#[patch("/", data = "<user>")]
pub fn update_user(user: Json<UserTemplate<'_>>) -> Value {
    use crate::schema::users::dsl::*;

    let conn = &mut establish_connection();

    diesel::update(users)
        .filter(id.eq(user.id))
        .set(email.eq(user.email))
        .execute(conn)
        .ok()
        .expect("No user");

    return get_user(user.id);
}

#[delete("/<user_id>")]
pub fn delete_user(user_id: &str) {
    use crate::schema::users::dsl::*;

    let conn = &mut establish_connection();

    diesel::delete(users).filter(id.eq(user_id)).execute(conn);
}