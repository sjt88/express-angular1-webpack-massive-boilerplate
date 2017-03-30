CREATE TABLE users(
  id SERIAL,
  username VARCHAR(64),
  email VARCHAR(255),
  password VARCHAR(64),
  PRIMARY KEY ("id")
)
