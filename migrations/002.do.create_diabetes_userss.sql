CREATE TABLE IF NOT EXISTS diabetes_users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    confirm_password TEXT
);
ALTER TABLE diabetes_months
  ADD COLUMN
    patient INTEGER REFERENCES diabetes_users(id)
    ON DELETE SET NULL;