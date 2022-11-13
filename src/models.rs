use diesel::prelude::*;

#[derive(Queryable)]
pub struct User {
    pub id: String,
    pub name: String,
    pub email: String,
    pub email_verified: i32,
    pub image: String,
}

#[derive(Queryable)]
pub struct Account {
    pub id: String,
    pub user_id: String,
    pub type: String,
}