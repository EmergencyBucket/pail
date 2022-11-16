// @generated automatically by Diesel CLI.

diesel::table! {
    users (id) {
        id -> Varchar,
        username -> Nullable<Tinytext>,
        email -> Nullable<Tinytext>,
    }
}
