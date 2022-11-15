use rocket::serde::{
    json::{serde_json::json, Json, Value}, Deserialize
};
use diesel::{prelude::*};

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

#[post("/", data="<user>")]
pub fn testuser(user: Json<UserTemplate<'_>>) -> Value {
    use crate::schema::users::dsl::*;

    let conn = &mut establish_connection();

    diesel::insert_into(users).values((id.eq(user.id), email.eq(user.email))).execute(conn).expect("Error");

    let table_user = users.filter(id.eq(user.id)).limit(1).load::<AdapterUser>(conn).expect("Error").pop().expect("Error adding user");
    json!({
        "id": table_user.id,
        "email": table_user.email.expect("Error setting email")
    })
}
