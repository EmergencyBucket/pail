// @generated automatically by Diesel CLI.

diesel::table! {
    teams (id) {
        id -> Int4,
        teamname -> Nullable<Text>,
        leader_id -> Int4,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        username -> Nullable<Text>,
        email -> Nullable<Text>,
    }
}

diesel::joinable!(teams -> users (leader_id));

diesel::allow_tables_to_appear_in_same_query!(
    teams,
    users,
);
