CREATE TABLE authorization_user_allowed_scopes(
  user_id INTEGER,
  authorized_scopes INTEGER[],
  PRIMARY KEY ("user_id")
);
