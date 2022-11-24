// @generated automatically by Diesel CLI.

diesel::table! {
    invites (id) {
        id -> Int4,
        team_id -> Int4,
        user_id -> Int4,
    }
}

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

diesel::joinable!(invites -> teams (team_id));

diesel::allow_tables_to_appear_in_same_query!(
    invites,
    teams,
    users,
);
