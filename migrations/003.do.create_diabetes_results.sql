CREATE TABLE IF NOT EXISTS diabetes_results (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    month_taken TEXT NOT NULL,
    meal_taken TEXT NOT NULL,
    result_read INTEGER,
    date_tested TIMESTAMPTZ DEFAULT now() NOT NULL,
    month_id INTEGER REFERENCES diabetes_months(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER  REFERENCES diabetes_users(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    diabetesType TEXT NOT NULL
);