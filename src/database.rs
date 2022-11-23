use rocket_sync_db_pools::{database, diesel};

#[database("my_db")]
pub struct DB(diesel::PgConnection);
