use diesel::prelude::*;
use diesel::result::Error;
use rocket::http::Status;
use rocket::serde::json::serde_json::json;
use rocket::serde::json::{Json, Value};
use serde::{Deserialize, Serialize};

use crate::database::DB;

#[derive(Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct CreateTableRequest {
    pub user_id: i32,
    pub teamname: String,
}

#[derive(Queryable, Serialize)]
pub struct Team {
    pub id: i32,
    pub teamname: String,
    pub leader_id: i32,
    pub members: Vec<Option<i32>>,
}

/// UNFINISHED
#[post("/", data = "<team>")]
pub async fn create_team(db: DB, team: Json<CreateTableRequest>) -> (Status, Value) {
    use crate::schema::teams::dsl::*;

    let user_id = team.user_id;

    let current_team: Result<Vec<Team>, Error> = db
        .run(move |conn| {
            teams
                .select((id, teamname, leader_id, members))
                .filter(members.contains(vec![user_id]))
                .load(conn)
        })
        .await;

    if current_team.ok().expect("").is_empty() {
        let insert = db.run(move |conn| {
            diesel::insert_into(teams)
                .values(leader_id.eq(team.user_id))
                .execute(conn)
        });
    }

    return (
        Status::Forbidden,
        json!({
            "error": "This user is already in a team, leave that team first"
        }),
    );
}

/// Gets the team by the user id
/// # Example
/// ``HTTP GET REQUEST TO https://api.ctf.ebucket.dev/api/auth/team/user/1``
/// ```json
/// {
///     "id": 1,
///     "teamname": "Emergency Bucket",
///     "leader_id": 1,
///     "members": [1],
/// }
#[get("/user/<user>")]
pub async fn get_team_by_user(db: DB, user: i32) -> (Status, Value) {
    use crate::schema::teams::dsl::*;

    let team: Result<Vec<Team>, Error> = db
        .run(move |conn| {
            teams
                .select((id, teamname, leader_id, members))
                .filter(members.contains(vec![user]))
                .load(conn)
        })
        .await;

    // TODO: Reformat this
    if team.is_ok() {
        let mut stored_team = team.ok().expect("");

        if stored_team.is_empty() {
            return (
                Status::NotFound,
                json!({
                    "error": "This user is not a member of a team"
                }),
            );
        }

        return (Status::Ok, json!(stored_team.pop()));
    }

    return (
        Status::NotFound,
        json!({
            "error": "This user is not a member of a team"
        }),
    );
}
