use rocket_sync_db_pools::{database, diesel};

#[database("db")]
pub struct DB(diesel::MysqlConnection);
