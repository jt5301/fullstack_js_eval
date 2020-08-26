CREATE TABLE people
(
    id BIGSERIAL PRIMARY KEY,
    first_name varchar(256) NOT NULL,
    last_name varchar(256) NOT NULL,
    birthday date NOT NULL,
    company varchar(256)    ,
    title varchar(256),
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
) 