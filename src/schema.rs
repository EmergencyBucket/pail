// @generated automatically by Diesel CLI.

diesel::table! {
    accounts (id) {
        id -> Varchar,
        userId -> Nullable<Tinytext>,
        #[sql_name = "type"]
        type_ -> Nullable<Tinytext>,
        provider -> Nullable<Tinytext>,
        providerAccountId -> Nullable<Tinytext>,
        refresh_token -> Nullable<Tinytext>,
        access_token -> Nullable<Tinytext>,
        expires_at -> Nullable<Integer>,
        token_type -> Nullable<Tinytext>,
        scope -> Nullable<Tinytext>,
        id_token -> Nullable<Tinytext>,
        session_state -> Nullable<Tinytext>,
        oauth_token_secret -> Nullable<Tinytext>,
        oauth_token -> Nullable<Tinytext>,
    }
}

diesel::table! {
    sessions (id) {
        id -> Varchar,
        expires -> Timestamp,
        sessionToken -> Nullable<Tinytext>,
        userId -> Nullable<Tinytext>,
    }
}

diesel::table! {
    users (id) {
        id -> Varchar,
        name -> Nullable<Tinytext>,
        email -> Nullable<Tinytext>,
        emailVerified -> Nullable<Tinytext>,
        image -> Nullable<Mediumtext>,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    accounts,
    sessions,
    users,
);
