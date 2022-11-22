// @generated automatically by Diesel CLI.

diesel::table! {
    teams (id) {
        id -> Integer,
        teamname -> Nullable<Tinytext>,
        leader_id -> Unsigned<Integer>,
    }
}

diesel::table! {
    users (id) {
        id -> Unsigned<Integer>,
        username -> Nullable<Tinytext>,
        email -> Nullable<Tinytext>,
    }
}

diesel::joinable!(teams -> users (leader_id));

diesel::allow_tables_to_appear_in_same_query!(
    teams,
    users,
);
